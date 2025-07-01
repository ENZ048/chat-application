const jwt = require("jsonwebtoken");
const { WebSocketServer } = require("ws");
const Message = require("./models/messageModel");

const onlineUsers = new Map();

function broadcastOnlineUsers(wss) {
    const onlineUserIds = [...onlineUsers.keys()];
    const data = JSON.stringify({ type: "online-users", online: onlineUserIds });

    [...wss.clients].forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(data);
        }
    });
}

function createWebSocketServer(server) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws, req) => {
        const cookies = req.headers.cookie;
        const tokenCookie = cookies?.split("; ").find((c) => c.startsWith("token="));

        const token = tokenCookie?.split("=")[1];

        if (!token) {
            ws.close();
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
            ws.user = decoded;
            console.log(`WebSocket connected : ${ws.user.email}`);

            onlineUsers.set(ws.user._id, ws);

            broadcastOnlineUsers(wss);


        } catch (error) {
            console.log("Invalid WebSocket token");
            ws.close();
            return;
        }

        ws.on("message", async (message) => {
            try {
                const msg = JSON.parse(message);
                console.log("Message received:", msg);

                // ✅ Typing indicators
                if (msg.type === "typing" || msg.type === "stop-typing") {
                    const receiverSocket = onlineUsers.get(msg.receiver);

                    if (receiverSocket && receiverSocket.readyState === receiverSocket.OPEN) {
                        receiverSocket.send(
                            JSON.stringify({
                                type: msg.type,
                                from: ws.user._id,
                            })
                        );
                    }
                    return;
                }

                // ✅ Message read receipt
                if (msg.type === "message-read") {
                    const senderSocket = onlineUsers.get(msg.to);
                    if (senderSocket && senderSocket.readyState === senderSocket.OPEN) {
                        senderSocket.send(
                            JSON.stringify({
                                type: "message-read",
                                messageId: msg.messageId,
                            })
                        );
                    }
                    return;
                }

                // ✅ Only handle actual chat messages from here
                if (msg.type === "message") {
                    const { text, receiver, group } = msg;

                    const savedMessage = await Message.create({
                        sender: ws.user._id,
                        receiver: receiver || null,
                        text,
                        group: group || null,
                        read: false,
                    });

                    const receiverSocket = onlineUsers.get(receiver);

                    // ✅ Handle group chat
                    if (group) {
                        const Group = require("./models/groupModel");
                        const groupDoc = await Group.findById(group);

                        if (groupDoc) {
                            [...wss.clients]
                                .filter(
                                    (client) =>
                                        client.readyState === client.OPEN &&
                                        groupDoc.participants.some((p) => p.toString() === client.user._id)
                                )
                                .forEach((client) => {
                                    client.send(
                                        JSON.stringify({
                                            type: "new-group-message",
                                            _id: savedMessage._id,
                                            group,
                                            from: ws.user._id,
                                            text: savedMessage.text,
                                            createdAt: savedMessage.createdAt,
                                        })
                                    );
                                });
                            return;
                        }
                    }

                    // ✅ Handle direct chat
                    if (receiverSocket && receiverSocket.readyState === ws.OPEN) {
                        receiverSocket.send(
                            JSON.stringify({
                                type: "new-message",
                                _id: savedMessage._id,
                                from: ws.user._id,
                                receiver,
                                text: savedMessage.text,
                                createdAt: savedMessage.createdAt,
                            })
                        );
                        console.log("📤 Sent to receiver:", {
                            type: "new-message",
                            _id: savedMessage._id,
                            from: ws.user._id,
                            receiver,
                            text: savedMessage.text,
                            createdAt: savedMessage.createdAt,
                        });
                    }

                    const senderSocket = onlineUsers.get(ws.user._id);
                    if (senderSocket && senderSocket.readyState === senderSocket.OPEN) {
                        senderSocket.send(
                            JSON.stringify({
                                type: "message-sent",
                                messageId: savedMessage._id,
                            })
                        );
                    }

                    console.log("🧠 Received from:", ws.user._id);
                    console.log("🧠 To receiver:", receiver);
                    console.log("🧠 OnlineUsers:", [...onlineUsers.keys()]);
                    console.log(receiverSocket ? "✅ Found receiver socket" : "❌ Receiver socket not found");
                }

            } catch (error) {
                console.log("Error in processing websocket message:", error);
            }
        });


        ws.on("close", () => {
            console.log(`Disconnected : ${ws.user.email}`)
            onlineUsers.delete(ws.user._id);
            broadcastOnlineUsers(wss);
        });

    })
}

module.exports = createWebSocketServer;