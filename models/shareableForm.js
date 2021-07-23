const mongoose = require("mongoose");
const Joi = require("joi");

const ShareableForm = mongoose.model(
    "ShareableForm",
    new mongoose.Schema({
        college: {type: mongoose.Schema.Types.ObjectId, ref: "College", required: true},
        department: {type: mongoose.Schema.Types.ObjectId, ref: "Department"},
        subjectRequirement: {type: mongoose.Schema.Types.ObjectId, ref: "SubjectRequirement"},
        subject: {type: mongoose.Schema.Types.ObjectId, ref: "Subject"},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
    })
);

function validateShareableForm(facility) {
    const schema = {
        collegeId: Joi.string().min(3).required().trim(),
        departmentId: Joi.string().required().trim(),
        subjectRequirementId: Joi.string().required().trim(),
        subjectId: Joi.string().required().trim(),
    };

    return Joi.validate(facility, schema);
}

exports.ShareableForm = ShareableForm;
exports.validate = validateShareableForm;
