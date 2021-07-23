const mongoose = require("mongoose");
const Joi = require("joi");

const sectionDaySchema = new mongoose.Schema({
    dayKey: { type: String, required: true, minlength: 3, maxlength: 10 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const SectionDay = mongoose.model("SectionDay", sectionDaySchema);

function validateSectionDay(lecturer) {
    const schema = {
        dayKey: Joi.string()
            .min(3)
            .max(10)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Day cannot be empty.",
                };
            }),
    };

    return Joi.validate(lecturer, schema);
}

exports.SectionDay = SectionDay;
exports.sectionDaySchema = sectionDaySchema;
exports.validate = validateSectionDay;
