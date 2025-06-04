const {User} = require('../models/userModel');
const {Token} = require('../models/tokenModel');

const emailVerifyController = async (req, res) => {
    try {
        const {userId,token} = req.params;

        const user = await User.findById(userId);
        if(!user){
            res.status(400).send({
                message: "Invalid link (user not found)"
            });
        };

        const tokenDoc = await Token.findOne({userId: user._id, token});
        if(!token){
            res.status(400).send({
                message: "Invalid or expired token",
            });
        };

        user.verified = true;
        await user.save();

        await tokenDoc.deleteOne();

        res.status(200).send({
            message: "Email verified successfully!"
        })
    } catch (error) {
        console.log("Email Verifiction Error : ", error);
        res.status(500).send({
            message: "Internal Server Error",
        })
    }
};

module.exports = emailVerifyController;