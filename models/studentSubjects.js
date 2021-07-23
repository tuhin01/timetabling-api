const mongoose = require("mongoose");
const Joi = require("joi");

const StudentSubjects = mongoose.model(
    "StudentSubjects",
    new mongoose.Schema({
        department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
        subjectRequirement: { type: mongoose.Schema.Types.ObjectId, ref: "SubjectRequirement", required: true },
        subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
        student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    })
);

function validateStudentSubjects(student) {
    const schema = {
        departmentId: Joi.string().min(3).max(255).required(),
        subjectRequirementId: Joi.string().min(3).max(255).required(),
        subjectId: Joi.string().min(3).max(255).required(),
        studentId: Joi.string().min(3).max(255).required(),
    };

    return Joi.validate(student, schema);
}

exports.StudentSubjects = StudentSubjects;
exports.validate = validateStudentSubjects;
