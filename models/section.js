const mongoose = require("mongoose");
const Joi = require("joi");
const { sectionDaySchema } = require("../models/sectionDay");

const sectionSchema = new mongoose.Schema({
    lecturerOne: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecturer",
        required: true,
    },
    lecturerTwo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecturer",
    },
    facility: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facility",
        required: [true, "Facility cannot be empty."],
    },
    startTime: { type: String, minlength: 3, maxlength: 5, required: true },
    startTimeKey: { type: Number, minlength: 3, maxlength: 5, required: true },
    startTimeHour: { type: String, minlength: 1, maxlength: 5, required: true },
    startTimeMin: { type: String, minlength: 1, maxlength: 5, required: true },
    endTime: { type: String, minlength: 3, maxlength: 5, required: true },
    endTimeKey: { type: Number, minlength: 3, maxlength: 5, required: true },
    endTimeHour: { type: String, minlength: 1, maxlength: 5, required: true },
    endTimeMin: { type: String, minlength: 1, maxlength: 5, required: true },
    amPmSettings: { type: Object },
    days: [sectionDaySchema],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const Section = mongoose.model("Section", sectionSchema);

function validateSection(section) {
    return Joi.validate(section, {
        facility: Joi.string()
            .min(3)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Facility cannot be empty.",
                };
            }),
        lecturerOne: Joi.string()
            .min(3)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Lecturer One cannot be empty.",
                };
            }),
        startTime: Joi.string()
            .min(3)
            .max(10)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Start time cannot be empty.",
                };
            }),
        endTime: Joi.string()
            .min(3)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "End time cannot be empty.",
                };
            }),
    });
}

exports.Section = Section;
exports.sectionSchema = sectionSchema;
exports.validate = validateSection;
