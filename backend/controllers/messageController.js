const Message = require("../models/messageModel");

const getMessages = async (req, res) => {
    try {
        const {userId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {sender: myId, receiver: userId},
                {sender: userId, receiver: myId},
            ],
        })
        .sort({createdAt: 1})
        .populate("sender", "firstName lastName email")
        .populate("receiver", "firstName, lastName email");

        res.status(200).send(messages);

    } catch (error) {
        console.log("Failed to fetch messages : ", error);
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
}

const deleteMessage = async (req, res) => {
    try {
        const {messageId} = req.params;

        const message = await Message.findById(messageId);

        if(!message){
            return res.status(404).send({
                message: "Message not found"
            });
        };

        if(message.sender.toString() !== req.user._id){
            return res.status(403).send({
                message: "Not authorized to delete this message"
            });
        };

        await message.deleteOne();

        res.status(200).send({
            message: "Message deleted successfully"
        });
    } catch (error) {
        console.log("Error in deleting message : ", error);
        res.status(500).send({
            message: "Internal Server Error"
        });
    };
};

const readReceipt = async (req, res) => {
    try {
        const {messageId} = req.params;

        const message = await Message.findById(messageId);

        if(!message){
            return res.status(404).send({
                message: "Meesage not found"
            });
        };

        if(message.receiver.toString() !== req.user._id){
            return res.status(403).send({
                message: "Not Authorized",
            });
        };

        message.read = true;
        await message.save();

        res.status(200).send({
            message: "Marked as read",
        });
    } catch (error) {
        console.log("Error in read receipt", error);
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
}

module.exports = {getMessages, deleteMessage, readReceipt};