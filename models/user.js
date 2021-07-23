const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { settingsSchema } = require("./settings");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, unique: true, required: true, minlength: 5, maxlength: 255 },
    password: { type: String, required: true, minlength: 8, maxlength: 1024 },
    college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
    settings: settingsSchema,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

userSchema.methods.generateAuthToken = function () {
    const jwtPrivateKey = process.env.TIMETABLING_JWT_KEY;

    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            collegeId: this.college,
        },
        jwtPrivateKey,
        { expiresIn: "365d" }
    );
};

const User = mongoose.model("User", userSchema);

const validate = (user) => {
    const userSchema = {
        name: Joi.string().min(1).max(50).required().trim().label("Name"),
        email: Joi.string().email().min(1).max(255).required().trim().label("Email"),
        password: Joi.string().min(8).max(255).required().trim().label("Password"),
    };

    return Joi.validate(user, userSchema);
};

exports.User = User;
exports.validate = validate;
