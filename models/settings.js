const mongoose = require("mongoose");
const Joi = require("joi");

const settingsSchema = new mongoose.Schema({
    clockType: { type: Number, required: true, minlength: 1, maxlength: 10 },
    firstDayOfWeek: { type: String, required: true, minlength: 1, maxlength: 10 },
    timeIncrement: { type: Number, required: true, minlength: 1, maxlength: 10 },
    appLanguage: { type: String, required: true, minlength: 1, maxlength: 20 },
});

const Settings = mongoose.model("Settings", settingsSchema);

const validate = (settings) => {
    const settingsSchema = {
        clockType: Joi.number().min(12).max(24).required(),
        firstDayOfWeek: Joi.string().min(1).max(10).required(),
        timeIncrement: Joi.number().min(30).max(60).required(),
        appLanguage: Joi.string().min(1).max(20).required(),
    };

    return Joi.validate(settings, settingsSchema);
};

exports.Settings = Settings;
exports.settingsSchema = settingsSchema;
exports.validateSettings = validate;
