const bycrpt = require('bcrypt');
const { User, validateRegister } = require('../models/userModel');
const { Token } = require('../models/tokenModel');
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

const registerController = async (req, res) => {
    try {

        const { error } = validateRegister(req.body);

        if (error) {
            return res.status(400).send({
                message: error.details[0].message
            });
        }

        const { firstName, lastName, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(409).send({
                message: "User Already Exists"
            });
        }

        const salt = await bycrpt.genSalt(Number(process.env.SALT) || 10);
        const hashedPassowrd = await bycrpt.hash(password, salt);

        user = await new User({
            firstName,
            lastName,
            email,
            password: hashedPassowrd,
        }).save();


        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        const url = `${process.env.CLIENT_URL}/users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify your email", url);

        res.status(201).send({
            message: "User registered successfully. Verification email sent.",
        });
    } catch (error) {
        console.log("Registration error : ", error.message);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
}

module.exports = registerController;