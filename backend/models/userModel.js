const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passwordComplexity = require('joi-password-complexity');
const Joi = require('joi');

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        verified: { type: Boolean, default: false },
        verificationLinkSent: { type: Boolean, required: false },
        avatar: { type: String, default: 'https://api.dicebear.com/9.x/notionists/svg?seed=Jocelyn' },
    },
    { timestamps: true }
)

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
    },
        process.env.JWTPRIVATEKEY, { expiresIn: "7d" }
    );
};

const User = mongoose.model("user", userSchema);

const validateRegister = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: passwordComplexity().required(),
    });
    return schema.validate(data);
};

const validateLogin = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: passwordComplexity().required(),
    });
    return schema.validate(data);
}

module.exports = { User, validateLogin, validateRegister }