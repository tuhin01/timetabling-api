const winston = require("winston");

module.exports = function (err, req, res, next) {
    // Log the exception
    winston.error(err.message, err);

    if (err.name === "ValidationError") {
        return res.status(400).send(err.message);
    }
    res.status(500).send("An error occurred while trying to process your request");
};
