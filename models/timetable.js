const mongoose = require("mongoose");
const Joi = require("joi");
const { sectionSchema } = require("../models/section");

const Timetable = mongoose.model(
    "Timetable",
    new mongoose.Schema({
        department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
        subjectRequirement: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubjectRequirement",
            required: true,
        },
        subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
        sections: [sectionSchema],
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    })
);

function validateTimetable(lecturer) {
    const schema = {
        departmentId: Joi.string()
            .min(3)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Department cannot be empty.",
                };
            }),
        subjectRequirementId: Joi.string()
            .min(3)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Subject requirement cannot be empty.",
                };
            }),
        subjectId: Joi.string()
            .min(3)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Subject cannot be empty.",
                };
            }),
        sections: Joi.array()
            .required()
            .error(() => {
                return {
                    message: "Sections cannot be empty.",
                };
            }),
    };

    return Joi.validate(lecturer, schema);
}

exports.Timetable = Timetable;
exports.validate = validateTimetable;
