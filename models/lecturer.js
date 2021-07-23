const mongoose = require("mongoose");
const Joi = require("joi");

const Lecturer = mongoose.model(
    "Lecturer",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 255,
        },
        customLecturerId: { type: String, required: true },
        autoCreated: Boolean,
        college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    })
);

function validateLecturer(lecturer) {
    const schema = {
        name: Joi.string()
            .min(3)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Lecturer name cannot be empty.",
                };
            }),
        customLecturerId: Joi.string()
            .min(1)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Lecturer ID cannot be empty.",
                };
            }),
        autoCreated: Joi.string().allow("", null),
        collegeId: Joi.string().min(3).required().trim(),
    };

    return Joi.validate(lecturer, schema);
}

exports.Lecturer = Lecturer;
exports.validate = validateLecturer;
