const {User} = require('../models/userModel');
// const {Group} = require('../models/groupModel');

const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const users = await User.find({ _id: { $ne: currentUserId } })
            .select("_id firstName lastName email avatar");

        // const groups = await Group.find({ participants: currentUserId }).select("_id name participants");

        res.status(200).send({
            users,
            // groups
        });
    } catch (error) {
        console.error("Failed to fetch people/groups:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = { getAllUsers };