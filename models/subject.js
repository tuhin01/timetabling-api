const mongoose = require("mongoose");
const Joi = require("joi");

const Subject = mongoose.model(
    "Subject",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
        },
        customSubjectId: { type: String, required: true },
        subjectRequirement: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubjectRequirement",
            required: true,
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    })
);

function validateSubject(lecturer) {
    const schema = {
        name: Joi.string()
            .min(3)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Subject name cannot be empty.",
                };
            }),
        customSubjectId: Joi.string()
            .min(3)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Subject ID cannot be empty.",
                };
            }),
        subjectRequirementId: Joi.string().min(3).required().trim(),
    };

    return Joi.validate(lecturer, schema);
}

exports.Subject = Subject;
exports.validate = validateSubject;
