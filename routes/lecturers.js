const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const lecturerRouter = express.Router();
const { Lecturer, validate } = require("../models/lecturer");
const { College } = require("../models/college");

/**
 * Lecturer API to get all lecturers
 * API Endpoint - /api/lecturers/?byCollegeId=collegeId
 * Type - GET
 */
lecturerRouter.get("/", [auth, validateObjectId], async (req, res) => {
    let where = {};
    const byCollege = req.query.byCollegeId;
    if (byCollege && byCollege !== "") {
        where.college = byCollege;
    }
    const lecturers = await Lecturer.find(where).populate("college");
    res.send(lecturers);
});

/**
 * Lecturer API to get specific lecturer by id
 * API Endpoint example - /api/lecturers/5eb5b831e0b82e02086a4815
 * Type - GET
 */
lecturerRouter.get("/:id", [auth, validateObjectId], async (req, res) => {
    const lecturer = await Lecturer.findById(req.params.id);
    if (!lecturer) return res.status(404).send("The lecturer with the given ID not found");
    res.send(lecturer);
});

/**
 * Lecturer API to save a lecturer
 * API Endpoint - /api/lecturers/
 * Type - POST
 */
lecturerRouter.post("/", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const college = await College.findById(req.body.collegeId);
    if (!college) return res.status(404).send("The college with the given ID not found");

    let lecturer = new Lecturer({
        name: req.body.name,
        customLecturerId: req.body.customLecturerId,
        college: req.body.collegeId,
    });

    lecturer = await lecturer.save();
    res.send(lecturer);
});

/**
 * Lecturer API to update a lecturer
 * API Endpoint - /api/lecturers/5eb5b831e0b82e02086a4815
 * Type - PUT
 */
lecturerRouter.put("/:id", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let lecturer = await Lecturer.findById(req.params.id);
    if (!lecturer) return res.status(404).send("The lecturer with the given ID not found");

    const {name, customLecturerId} = req.body;
    lecturer.name = name;
    lecturer.customLecturerId = customLecturerId;
    lecturer = await lecturer.save();
    res.send(lecturer);
});

/**
 * Lecturer API to delete a lecturer
 * API Endpoint - /api/lecturers/5eb5b831e0b82e02086a4815
 * Type - DELETE
 */
lecturerRouter.delete("/:id", [auth, validateObjectId], async (req, res) => {
    const lecturer = await Lecturer.findByIdAndRemove(req.params.id);
    if (!lecturer) return res.status(404).send("The lecturer with the given ID not found");
    res.send(lecturer);
});

module.exports = lecturerRouter;
