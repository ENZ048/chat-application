const express = require('express');
require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');
const userRoutes = require('./Routes/userRoutes')
const createWebSocketServer = require('./wsServer');
const messageRoutes = require('./Routes/messageRoutes');
const protect = require('./middleware/protect');
const groupRoutes = require('./Routes/groupRoutes');

const app = express();
connectDB();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/groups', groupRoutes);





app.get('/', (req, res) => {
    res.send("Chat App Backend is Running...");
})

app.get('/me', protect, (req, res) => {
  res.send({
    user: req.user,
  })
})

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`Server is Running on the Port ${PORT}`);
})

createWebSocketServer(server)
