const mongoose = require("mongoose");

module.exports = function (req, res, next) {
    if (req.params.id && !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(404).send("Invalid ID.");
    }
    if (req.query.byCollegeId && !mongoose.Types.ObjectId.isValid(req.query.byCollegeId)) {
        return res.status(404).send("Invalid College ID.");
    }
    if (req.body.collegeId && !mongoose.Types.ObjectId.isValid(req.body.collegeId)) {
        return res.status(404).send("Invalid College ID.");
    }
    if (req.body.subjectRequirementId && !mongoose.Types.ObjectId.isValid(req.body.subjectRequirementId)) {
        return res.status(404).send("Invalid Subject Requirement ID.");
    }
    if (req.body.departmentId && !mongoose.Types.ObjectId.isValid(req.body.departmentId)) {
        return res.status(404).send("Invalid Department ID.");
    }
    if (req.query.byDepartmentId && !mongoose.Types.ObjectId.isValid(req.query.byDepartmentId)) {
        return res.status(404).send("Invalid Department ID.");
    }
    if (req.body.subjectId && !mongoose.Types.ObjectId.isValid(req.body.subjectId)) {
        return res.status(404).send("Invalid Subject ID.");
    }
    if (req.body.studentId && !mongoose.Types.ObjectId.isValid(req.body.studentId)) {
        return res.status(404).send("Invalid Student ID.");
    }
    if (req.body.sectionId && !mongoose.Types.ObjectId.isValid(req.body.sectionId)) {
        return res.status(404).send("Invalid Section ID.");
    }
    if (req.query.bySubjectRequirementId && !mongoose.Types.ObjectId.isValid(req.query.bySubjectRequirementId)) {
        return res.status(404).send("Invalid Subject Requirement ID.");
    }

    next();
};
