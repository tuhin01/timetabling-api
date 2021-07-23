const winston = require("winston");
const config = require("config");
const mongoose = require("mongoose");

module.exports = async function () {
    await mongoose.connect(process.env.DB_CONNECT_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
    if (process.env.NODE_ENV === 'production') {
        winston.info("Connected to mongodb");
    }
};
