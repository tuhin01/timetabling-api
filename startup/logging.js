const winston = require("winston");
require("express-async-errors");

module.exports = function () {
    winston.handleExceptions(
        new winston.transports.Console({colorize: true, prettyPrint: true}),
        new winston.transports.File({ filename: "log/uncaughtException.log" }),
    );
    process.on("unhandledRejection", (ex) => {
        throw ex;
    });

    winston.add(winston.transports.File, { filename: "logs/error.log" });

}
