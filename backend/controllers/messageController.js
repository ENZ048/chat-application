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

module.exports = getMessages;