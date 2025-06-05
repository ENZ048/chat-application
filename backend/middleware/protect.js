const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if(!token){
            return res.status(401).send({
                message: "Access denied. No token provided"
            });
        };

        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        req.user = decoded;

        next();
    } catch (error) {
        console.log("Protect middleware error : ", error.message);
        res.status(500).send({
            message: "Internal Server Error",
        });
    }
}

module.exports = protect;