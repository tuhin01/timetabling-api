const express = require("express");
const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const studentRouter = express.Router();
const { Student, validate } = require("../models/student");
const { StudentSubjects, validate: studentSubjectValidate } = require("../models/studentSubjects");
const { College } = require("../models/college");

/**
 * Student API to get all students
 * API Endpoint - /api/students/?byCollegeId=collegeId
 * Type - GET
 */
studentRouter.get("/", [auth, validateObjectId], async (req, res) => {
    let where = {};
    const byCollege = req.query.byCollegeId;
    if (byCollege && byCollege !== "") {
        where.college = byCollege;
    }

    const students = await Student.find(where).populate("college");
    res.send(students);
});


/**
 * Student API to get all subject for a student
 * API Endpoint - /api/students/subjects/?studentId=Id
 * Type - GET
 */
studentRouter.get("/subjects/", [auth, validateObjectId], async (req, res) => {
    let where = {};
    const studentId = req.query.studentId;
    if (studentId && studentId !== "") {
        where.student = studentId;
    }

    const studentSubjects = await StudentSubjects.find(where).populate("subject").populate('department').populate('subjectRequirement');
    res.send(studentSubjects);
});

/**
 * Student API to get specific student by id
 * API Endpoint example - /api/students/5eb5b831e0b82e02086a4815
 * Type - GET
 */
studentRouter.get("/:id", [auth, validateObjectId], async (req, res) => {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send("The student with the given ID not found");
    res.send(student);
});

/**
 * Student API to save a student
 * API Endpoint - /api/students/
 * Type - POST
 */
studentRouter.post("/", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const college = await College.findById(req.body.collegeId);
    if (!college) return res.status(404).send("The college with the given ID not found");

    let student = new Student({
        name: req.body.name,
        customStudentId: req.body.customStudentId,
        college: req.body.collegeId,
    });

    student = await student.save();
    res.send(student);
});

/**
 * API to assign a subject to a student with departmentId and subjectRequirementId
 * API Endpoint - /api/students/subjects/
 * Type - POST
 */
studentRouter.post("/subjects/", [auth, validateObjectId], async (req, res) => {
    const { error } = studentSubjectValidate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const postData = {
        department: req.body.departmentId,
        subjectRequirement: req.body.subjectRequirementId,
        subject: req.body.subjectId,
        student: req.body.studentId,
    }

    const isExist = await StudentSubjects.where(postData).findOne();
    if (isExist) return res.status(404).send("The subject is already assigned to the student");

    let studentSubject = new StudentSubjects(postData);
    studentSubject = await studentSubject.save();
    res.send(studentSubject);
});

/**
 * Student API to update a student
 * API Endpoint - /api/students/5eb5b831e0b82e02086a4815
 * Type - PUT
 */
studentRouter.put("/:id", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send("The student with the given ID not found");

    const {name, customStudentId} = req.body;
    student.name = name;
    student.customStudentId = customStudentId;
    student = await student.save();
    res.send(student);
});

/**
 * Student API to delete a student
 * API Endpoint - /api/students/5eb5b831e0b82e02086a4815
 * Type - DELETE
 */
studentRouter.delete("/:id", [auth, validateObjectId], async (req, res) => {
    const student = await Student.findByIdAndRemove(req.params.id);
    if (!student) return res.status(404).send("The student with the given ID not found");
    res.send(student);
});


/**
 * Student API to delete a student
 * API Endpoint - /api/students/subjects/remove/:id
 * Type - DELETE
 */
studentRouter.delete("/subjects/remove/:id", [auth, validateObjectId], async (req, res) => {
    const studentSubject = await StudentSubjects.findByIdAndRemove(req.params.id);
    if (!studentSubject) return res.status(404).send("The student subject with the given ID not found");
    res.send(studentSubject);
});

module.exports = studentRouter;
