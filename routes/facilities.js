const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const facilityRouter = express.Router();
const { Facility, validate } = require("../models/facility");
const { College } = require("../models/college");

/**
 * Facility API to get all facilities of a college
 * API Endpoint - /api/facilities/?byCollegeId=collegeId
 * Type - GET
 */
facilityRouter.get("/", [auth, validateObjectId], async (req, res) => {
    let where = {};
    const byCollege = req.query.byCollegeId;
    if (byCollege && byCollege !== "") {
        where.college = byCollege;
    }
    const facilities = await Facility.find(where).populate("college");
    res.send(facilities);
});

/**
 * Facility API to get specific facility by id
 * API Endpoint example - /api/facilities/5eb5b831e0b82e02086a4815
 * Type - GET
 */
facilityRouter.get("/:id", [auth, validateObjectId], async (req, res) => {
    const facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).send("The facility with the given ID not found");
    res.send(facility);
});

/**
 * Facility API to save a facility
 * API Endpoint - /api/facilities/
 * Type - POST
 */
facilityRouter.post("/", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const college = await College.findById(req.body.collegeId);
    if (!college) return res.status(404).send("The college with the given ID not found");

    let facility = new Facility({
        name: req.body.name,
        customFacilityId: req.body.customFacilityId,
        college: req.body.collegeId,
        department: req.body.departmentId || null,
        subjectRequirement: req.body.subjectRequirementId || null,
        subject: req.body.subjectId || null,
        lecturer: req.body.lecturerId || null,
    });

    facility = await facility.save();
    res.send(facility);
});

/**
 * Facility API to update a facility
 * API Endpoint - /api/facilities/5eb5b831e0b82e02086a4815
 * Type - PUT
 */
facilityRouter.put("/:id", [auth, validateObjectId], async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let facility = await Facility.findById(req.params.id);
    if (!facility) return res.status(404).send("The facility with the given ID not found");

    facility.name = req.body.name;
    facility.customFacilityId = req.body.customFacilityId;
    facility.department = req.body.departmentId || null;
    facility.subjectRequirement = req.body.subjectRequirementId || null;
    facility.subject = req.body.subjectId || null;
    facility.lecturer = req.body.lecturerId || null;

    facility = await facility.save();
    res.send(facility);
});

/**
 * Facility API to delete a facility
 * API Endpoint - /api/facilities/5eb5b831e0b82e02086a4815
 * Type - DELETE
 */
facilityRouter.delete("/:id", [auth, validateObjectId], async (req, res) => {
    const facility = await Facility.findByIdAndRemove(req.params.id);
    if (!facility) return res.status(404).send("The facility with the given ID not found");
    res.send(facility);
});

module.exports = facilityRouter;
