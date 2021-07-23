const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const subjectRequirementRouter = express.Router();
const { SubjectRequirement, validate } = require("../models/subjectRequirement");
const { Department } = require("../models/department");

/**
 * SubjectRequirement API to get all subjectRequirements of a college
 * API Endpoint - /api/subjectRequirements/?byDepartmentId=departmentId
 * Type - GET
 */
subjectRequirementRouter.get("/", [auth, validateObjectId], async (req, res) => {
    let where = {};
    const byDepartment = req.query.byDepartmentId;
    if (byDepartment && byDepartment !== "") {
        where.department = byDepartment;
    }
    const subjectRequirements = await SubjectRequirement.find(where);
    res.send(subjectRequirements);
});

/**
 * SubjectRequirement API to get specific subjectRequirement by id
 * API Endpoint example - /api/subjectRequirements/5eb5b831e0b82e02086a4815
 * Type - GET
 */
subjectRequirementRouter.get("/:id", [auth, validateObjectId], async (req, res) => {
    const subjectRequirement = await SubjectRequirement.findById(req.params.id);
    if (!subjectRequirement)
        return res.status(404).send("The subject requirement with the given ID not found");
    res.send(subjectRequirement);
});

/**
 * SubjectRequirement API to save a subjectRequirement
 * API Endpoint - /api/subjectRequirements/
 * Type - POST
 */
subjectRequirementRouter.post("/", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const department = await Department.findById(req.body.departmentId);
    if (!department) return res.status(404).send("The department with the given ID not found");

    let subjectRequirement = new SubjectRequirement({
        title: req.body.title,
        color: req.body.color,
        department: req.body.departmentId,
    });

    subjectRequirement = await subjectRequirement.save();
    res.send(subjectRequirement);
});

/**
 * SubjectRequirement API to update a subjectRequirement
 * API Endpoint - /api/subjectRequirements/5eb5b831e0b82e02086a4815
 * Type - PUT
 */
subjectRequirementRouter.put("/:id", [auth, validateObjectId], async (req, res) => {
    console.log(req.body);
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let subjectRequirement = await SubjectRequirement.findById(req.params.id);
    if (!subjectRequirement)
        return res.status(404).send("The subject requirement with the given ID not found");

    subjectRequirement.title = req.body.title;
    subjectRequirement.color = req.body.color;
    subjectRequirement = await subjectRequirement.save();
    res.send(subjectRequirement);
});

/**
 * SubjectRequirement API to delete a subjectRequirement
 * API Endpoint - /api/subjectRequirements/5eb5b831e0b82e02086a4815
 * Type - DELETE
 */
subjectRequirementRouter.delete("/:id", [auth, validateObjectId], async (req, res) => {
    const subjectRequirement = await SubjectRequirement.findByIdAndRemove(req.params.id);
    if (!subjectRequirement)
        return res.status(404).send("The subject requirement with the given ID not found");
    res.send(subjectRequirement);
});

module.exports = subjectRequirementRouter;
