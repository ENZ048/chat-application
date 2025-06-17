const bcrypt = require('bcrypt');
const {User, validateLogin} = require('../models/userModel');

const loginController = async (req, res) => {
    try {
        const {error} = validateLogin(req.body);

        if(error){
            return res.status(400).send({
                message: error.details[0].message
            });
        }

        const {email, password} = req.body;

        const user = await User.findOne({email});

        if(!user){
             return res.status(401).send({
                message: "Invalid email or password"
            });
        };

        // if(!user.verified){
        //     return res.status(403).send({
        //         message: "Email not verified"
        //     });
        // };

        const validatePassword = await bcrypt.compare(password, user.password);
        if(!validatePassword){
            return res.status(401).send({
                message: "Invalid email or password"
            });
        };

        const token = user.generateAuthToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Lax",
             maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200).send({
            message: "Login Successfull",
            user: {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });
    } catch (error) {
        console.log("Login Error : ", error.message);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
}

module.exports = loginController;