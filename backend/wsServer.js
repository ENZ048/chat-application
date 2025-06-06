const jwt = require("jsonwebtoken");
const {WebSocketServer} = require("ws");
const url = require("url");
const Message = require("./models/messageModel");

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
        } catch (error) {
            console.log("Invalid WebSocket token");
            ws.close();
            return;
        }

        ws.on("message", async (message) => {
            const msg = JSON.parse(message);
            console.log("Message recieved : ", msg);

            const {text, receiver} = msg;

            const savedMessage = await Message.create({
                sender: ws.user._id,
                receiver,
                text,
            });



            [...wss.clients].filter((client) => client !== ws && client.readyState === ws.OPEN)
            .forEach((client) => client.send(JSON.stringify({
                from: ws.user.email,
                text: savedMessage.text,
                createdAt: savedMessage.createdAt,
            })));
        });

        ws.on("close", () => {
            console.log(`Disconnected : ${ws.user.email}`)
        });

    })
}

module.exports = createWebSocketServer;