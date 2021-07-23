const mongoose = require("mongoose");
const Joi = require("joi");

const Student = mongoose.model(
    "Student",
    new mongoose.Schema({
        name: { type: String, required: true, minlength: 3, maxlength: 255 },
        customStudentId: { type: String, required: true, minlength: 1, maxlength: 255 },
        college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    })
);

function validateStudent(student) {
    const schema = {
        name: Joi.string()
            .min(3)
            .max(255)
            .required()
            .error(() => {
                return {
                    message: "Student name cannot be empty.",
                };
            }),
        customStudentId: Joi.string()
            .min(1)
            .max(255)
            .required()
            .error(() => {
                return {
                    message: "Student ID cannot be empty.",
                };
            }),
        collegeId: Joi.string().min(3).required(),
    };

    return Joi.validate(student, schema);
}

exports.Student = Student;
exports.validate = validateStudent;
