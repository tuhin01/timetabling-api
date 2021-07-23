require("dotenv").config();
const config = require("config");
const winston = require("winston");
const express = require("express");
const app = express();

/**
 * Timetabling App specific router & error settings
 * Send the 'app' instance in startup routes file so we have only single app instance throughout the app.
 */
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();

/**
 * Production specific configuration
 */
require("./startup/production")(app);

if (!process.env.TIMETABLING_JWT_KEY) {
    throw new Error("FATAL ERROR: TIMETABLING_JWT_KEY is not defined");
}

const port = process.env.PORT || 3000;
app.listen(port, async () => {
    winston.info(`Listening on port ${port}`);
});

if (process.env.NODE_ENV !== 'production') {
    module.exports = app; // for testing
}
