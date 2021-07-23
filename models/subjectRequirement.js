const mongoose = require("mongoose");
const Joi = require("joi");

const SubjectRequirement = mongoose.model(
    "SubjectRequirement",
    new mongoose.Schema({
        title: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
        },
        color: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 255,
        },
        department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    })
);

function validate(subjectRequirement) {
    console.log({subjectRequirement})
    const schema = {
        title: Joi.string()
            .min(3)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Subject Requirement title cannot be empty.",
                };
            }),
        color: Joi.string().min(1).max(255).required(),
        departmentId: Joi.string().min(3).required().trim(),
    };

    return Joi.validate(subjectRequirement, schema);
}

const getPredefinedSubjectRequirements = () => {
    return [
        { title: "Department Electives", color: "#b4fcff" },
        { title: "Department Requirements", color: "#d7fdd0" },
        { title: "Science & Math Requirements", color: "#f2d9fa" },
        { title: "University Requirements", color: "#ffdede" },
    ];
};

exports.SubjectRequirement = SubjectRequirement;
exports.validate = validate;
exports.getPredefinedSubjectRequirements = getPredefinedSubjectRequirements;
