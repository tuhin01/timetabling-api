const express = require("express");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const subjectRouter = express.Router();
const { Subject, validate } = require("../models/subject");
const { SubjectRequirement } = require("../models/subjectRequirement");
const { StudentSubjects, validate: studentSubjectValidate } = require("../models/studentSubjects");


/**
 * Subject API to get all subjects
 * API Endpoint - /api/subjects/?bySubjectRequirementId=Id
 * Type - GET
 */
subjectRouter.get("/", [auth, validateObjectId], async (req, res) => {
    let where = {};
    const bySubjectRequirement = req.query.bySubjectRequirementId;
    if (bySubjectRequirement && bySubjectRequirement !== "") {
        where.subjectRequirement = bySubjectRequirement;
    }
    const subjects = await Subject.find(where);
    res.send(subjects);
});

/**
 * NOTE - THIS API has to be on top of any other API defined in this file.
 * Subject API to get all students for the subject
 * API Endpoint - /api/subjects/students/?subjectId=Id
 * Type - GET
 */
subjectRouter.get("/students", [auth, validateObjectId], async (req, res) => {
    let where = {};
    const subject = req.query.subjectId;
    if (subject && subject !== "") {
        where.subject = subject;
    }
    const studentSubjects = await StudentSubjects.find(where).populate("student");
    res.send(studentSubjects);
});


/**
 * Subject API to get specific subject by id
 * API Endpoint example - /api/subjects/5eb5b831e0b82e02086a4815
 * Type - GET
 */
subjectRouter.get("/:id", [auth, validateObjectId], async (req, res) => {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).send("The subject with the given ID not found");
    res.send(subject);
});

/**
 * Subject API to save a subject
 * API Endpoint - /api/subjects/
 * Type - POST
 */
subjectRouter.post("/", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const college = await SubjectRequirement.findById(req.body.subjectRequirementId);
    if (!college)
        return res.status(404).send("The subject requirement with the given ID not found");

    let subject = new Subject({
        name: req.body.name,
        customSubjectId: req.body.customSubjectId,
        subjectRequirement: req.body.subjectRequirementId,
    });

    subject = await subject.save();
    res.send(subject);
});

/**
 * API to assign a subject to a student with departmentId and subjectRequirementId
 * API Endpoint - /api/subjects/students/
 * Type - POST
 */
subjectRouter.post("/students/", [auth, validateObjectId], async (req, res) => {
    const { error } = studentSubjectValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const postData = {
        department: req.body.departmentId,
        subjectRequirement: req.body.subjectRequirementId,
        subject: req.body.subjectId,
        student: req.body.studentId,
    }

    const isExistInSameClass = await StudentSubjects.where(postData).findOne();
    if (isExistInSameClass) return res.status(404).send("The student is already assigned to the subject");



    let studentSubject = new StudentSubjects(postData);
    studentSubject = await studentSubject.save();
    res.send(studentSubject);
});


/**
 * Subject API to update a subject
 * API Endpoint - /api/subjects/5eb5b831e0b82e02086a4815
 * Type - PUT
 */
subjectRouter.put("/:id", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).send("The subject with the given ID not found");

    subject.name = req.body.name;
    subject.customSubjectId = req.body.customSubjectId;
    subject = await subject.save();
    res.send(subject);
});

/**
 * Subject API to delete a subject
 * API Endpoint - /api/subjects/5eb5b831e0b82e02086a4815
 * Type - DELETE
 */
subjectRouter.delete("/:id", [auth, validateObjectId], async (req, res) => {
    const subject = await Subject.findByIdAndRemove(req.params.id);
    if (!subject) return res.status(404).send("The subject with the given ID not found");
    res.send(subject);
});




/**
 * Student API to delete a student
 * API Endpoint - /api/subjects/students/remove/:id
 * Type - DELETE
 */
subjectRouter.delete("/students/remove/:id", [auth, validateObjectId], async (req, res) => {
    const studentSubject = await StudentSubjects.findByIdAndRemove(req.params.id);
    if (!studentSubject) return res.status(404).send("The student subject with the given ID not found");
    res.send(studentSubject);
});


module.exports = subjectRouter;
