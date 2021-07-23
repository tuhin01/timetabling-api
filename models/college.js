const mongoose = require("mongoose");

const College = mongoose.model(
    "College",
    new mongoose.Schema({
        name: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    })
);

exports.College = College;
