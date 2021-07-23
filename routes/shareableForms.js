const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const shareableFormRouter = express.Router();
const { ShareableForm, validate } = require("../models/shareableForm");
const { College } = require("../models/college");
const { Department } = require("../models/department");
const { SubjectRequirement } = require("../models/subjectRequirement");
const { Subject } = require("../models/subject");

/**
 * ShareableForm API to get all shareableForm of a college
 * API Endpoint - /api/shareable-form/?byCollegeId=collegeId
 * Type - GET
 */
shareableFormRouter.get("/", [auth, validateObjectId], async (req, res) => {
    let where = {};
    const byCollege = req.query.byCollegeId;
    if (byCollege && byCollege !== "") {
        const college = await College.findById(byCollege);
        if (!college) return res.status(404).send("The college with the given ID not found");

        where.college = byCollege;
    }
    const shareableForm = await ShareableForm.find(where).populate("department").populate("subjectRequirement").populate("subject");
    res.send(shareableForm);
});

/**
 * ShareableForm API to get specific shareableForm by id
 * API Endpoint example - /api/shareable-form/5eb5b831e0b82e02086a4815
 * Type - GET
 */
shareableFormRouter.get("/:id", [validateObjectId], async (req, res) => {
    const shareableForm = await ShareableForm.findById(req.params.id)
        .populate("department")
        .populate("subjectRequirement")
        .populate("subject");

    if (!shareableForm) return res.status(404).send("The shareableForm with the given ID not found");
    res.send(shareableForm);
});

/**
 * ShareableForm API to save a shareableForm
 * API Endpoint - /api/shareable-form/
 * Type - POST
 */
shareableFormRouter.post("/", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const college = await College.findById(req.body.collegeId);
    if (!college) return res.status(404).send("The college with the given ID not found");

    const department = await Department.findById(req.body.departmentId);
    if (!department) return res.status(404).send("The department with the given ID not found");

    const subjectRequirement = await SubjectRequirement.findById(req.body.subjectRequirementId);
    if (!subjectRequirement) return res.status(404).send("The subjectRequirement with the given ID not found");

    const subject = await Subject.findById(req.body.subjectId);
    if (!subject) return res.status(404).send("The subject with the given ID not found");

    let shareableForm = new ShareableForm({
        college: req.body.collegeId,
        department: req.body.departmentId,
        subjectRequirement: req.body.subjectRequirementId,
        subject: req.body.subjectId,
    });

    shareableForm = await shareableForm.save();
    /**
     * Reason for quering again is we need department name, subject requirement name & subject name
     **/
    shareableForm = await ShareableForm.findById(shareableForm._id)
        .populate("department")
        .populate("subjectRequirement")
        .populate("subject");

    res.send(shareableForm);
});

/**
 * ShareableForm API to delete a shareableForm
 * API Endpoint - /api/shareable-form/5eb5b831e0b82e02086a4815
 * Type - DELETE
 */
shareableFormRouter.delete("/:id", [auth, validateObjectId], async (req, res) => {
    const shareableForm = await ShareableForm.findByIdAndRemove(req.params.id);
    if (!shareableForm) return res.status(404).send("The shareableForm with the given ID not found");
    res.send(shareableForm);
});

module.exports = shareableFormRouter;
