const mongoose = require("mongoose");
const Joi = require("joi");

const Department = mongoose.model(
    "Department",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
        },
        college: { type: mongoose.Schema.Types.ObjectId, ref: "College", required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    })
);

const validateDepartment = (department) => {
    const schema = {
        name: Joi.string()
            .min(3)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Department name cannot be empty.",
                };
            }),
        collegeId: Joi.string().min(3).required().trim(),
    };

    return Joi.validate(department, schema);
};

const getPredefinedDepartments = () => {
    return [
        { name: "Department of Computer Science" },
        { name: "Department of Information Technology" },
    ];
};

exports.Department = Department;
exports.validate = validateDepartment;
exports.getPredefinedDepartments = getPredefinedDepartments;
