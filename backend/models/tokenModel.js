const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
        unique: true,
    },
    token : {
        type: String,
        required: true,
    },
    createdAt : {
        type: Date,
        default: Date.now(),
    },
    expiresAt : {
        type: Date,
        default: () => Date.now() + 360000,
    },
});

const Token = mongoose.model("token", tokenSchema);

module.exports = {Token}