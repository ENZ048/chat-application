const {User} = require('../models/userModel');

const getMe = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error while fetching user" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, avatar } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            })
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.avatar = avatar || user.avatar;

        await user.save();

        res.status(200).send({
            message: "Profile updated",
            user,
        })
    } catch (error) {
        console.error("Update profile error:", error.message);
        res.status(500).send({ message: "Internal server error" });
    }
}

module.exports = { getMe, updateProfile };