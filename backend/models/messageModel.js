const { required, ref } = require('joi');
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        },
        text: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "group",
            default: null
        }
    },
    {
        timestamps: true,
    }
);

const Message = mongoose.model("Message", MessageSchema);

module.exports = Message;