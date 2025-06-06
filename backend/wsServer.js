const jwt = require("jsonwebtoken");
const {WebSocketServer} = require("ws");
const Message = require("./models/messageModel");

const onlineUsers = new Map();

function broadcastOnlineUsers(wss) {
    const onlineUserIds = [...onlineUsers.keys()];
    const data = JSON.stringify({type: "online-users", online: onlineUserIds});

    [...wss.clients].forEach((client) => {
        if(client.readyState === client.OPEN){
            client.send(data);
        }
    });
}

function createWebSocketServer(server) {
    const wss = new WebSocketServer({server});

    wss.on("connection", (ws, req) => {
        const cookies = req.headers.cookie;
        const tokenCookie = cookies?.split("; ").find((c) => c.startsWith("token="));

        const token = tokenCookie?.split("=")[1];

        if(!token){
            ws.close();
            return;
        }

        try {
            const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
            ws.user = decoded;
            console.log(`WebSocket connected : ${using.user.email}`);

            onlineUsers.set(ws.user._id, ws);

            broadcastOnlineUsers(wss);


        } catch (error) {
            console.log("Invalid WebSocket token");
            ws.close();
            return;
        }

        ws.on("message", async (message) => {
            const msg = JSON.parse(message);
            console.log("Message recieved : ", msg);

            if(msg.type === "typing" || msg.type === "stop-typing"){
                const receiverSocket = onlineUsers.get(msg.receiver);

                if(receiverSocket && receiverSocket.readyState === receiverSocket.OPEN){
                    receiverSocket.send(
                        JSON.stringify({
                            type: msg.type,
                            from: ws.user._id,
                        })
                    );
                }
                return;
            }

            const {text, receiver} = msg;

            const savedMessage = await Message.create({
                sender: ws.user._id,
                receiver,
                text,
            });

            const receiverSocket = onlineUsers.get(receiver);

            if(receiverSocket && receiverSocket.readyState === ws.OPEN){
                receiverSocket.send(
                    JSON.stringify({
                        type: "new-message",
                        form: ws.user._id,
                        text: savedMessage.text,
                        createdAt: savedMessage.createdAt,
                    })
                )
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