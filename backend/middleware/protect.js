const jwt = require("jsonwebtoken");
const {User} = require("../models/userModel")

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).send({
                message: "Access denied. No token provided"
            });
        };

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        
        const user = await User.findById(decoded._id).select("-password");

        if(!user){
            return res.status(401).json({
                message: "User not found"
            })
        }

        req.user = user;

        next();
    } catch (error) {
        console.log("Protect middleware error : ", error.message);
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
}

module.exports = protect;