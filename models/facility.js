const mongoose = require("mongoose");
const Joi = require("joi");

const Facility = mongoose.model(
    "Facility",
    new mongoose.Schema({
        name: {
            type: String,
            required: [true, "Facility name cannot be empty"],
            minlength: 1,
            maxlength: 255,
        },
        customFacilityId: {type: String, required: true},
        autoCreated: Boolean,
        college: {type: mongoose.Schema.Types.ObjectId, ref: "College", required: true},
        department: {type: mongoose.Schema.Types.ObjectId, ref: "Department"},
        subjectRequirement: {type: mongoose.Schema.Types.ObjectId, ref: "SubjectRequirement"},
        subject: {type: mongoose.Schema.Types.ObjectId, ref: "Subject"},
        lecturer: {type: mongoose.Schema.Types.ObjectId, ref: "Lecturer"},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
    })
);

function validateFacility(facility) {
    const schema = {
        name: Joi.string()
            .min(3)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Facility name cannot be empty.",
                };
            }),
        customFacilityId: Joi.string()
            .min(1)
            .max(255)
            .required()
            .trim()
            .error(() => {
                return {
                    message: "Facility ID cannot be empty.",
                };
            }),
        collegeId: Joi.string().min(3).required().trim(),
        departmentId: Joi.string().allow('', null),
        subjectRequirementId: Joi.string().allow('', null),
        subjectId: Joi.string().allow('', null),
        lecturerId: Joi.string().allow('', null),
        autoCreated: Joi.string().allow("", null),

    };

    return Joi.validate(facility, schema);
}

exports.Facility = Facility;
exports.validate = validateFacility;
