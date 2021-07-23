const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const express = require("express");
const authRouter = express.Router();

/**
 * Auth API to authenticate a user and return a token to reauthenticate user for future
 * API Endpoint - /api/auth
 * Type - POST
 */
authRouter.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { email, password } = req.body;
    const errorMessage = "Invalid email or password.";

    let user = await User.findOne({ email });
    if (!user) return res.status(400).send(errorMessage);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send(errorMessage);

    const token = user.generateAuthToken();
    let userInfo = _.pick(user, ["_id", "name", "email", "college", "settings"]);

    if (process.env.NODE_ENV !== "production") {
        userInfo.token = token; // for testing
    }

    res.header("X-Auth-Token", token).send(userInfo);
});

function validate(req) {
    const schema = {
        email: Joi.string()
            .min(5)
            .max(255)
            .required()
            .email()
            .error(() => {
                return {
                    message: "Email cannot be empty.",
                };
            }),
        password: Joi.string()
            .min(8)
            .max(255)
            .required()
            .error(() => {
                return {
                    message: "Password cannot be empty.",
                };
            }),
    };

    return Joi.validate(req, schema);
}

module.exports = authRouter;
