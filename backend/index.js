const express = require('express');
require("dotenv").config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db');

const app = express();
connectDB();

app.use(express);
app.use(cookieParser);

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send("Chat App Backend is Running...");
})

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
    console.log(`Server is Running on the Port ${PORT}`);
})
