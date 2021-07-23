const auth = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");
const express = require("express");
const departmentRouter = express.Router();
const { Department, validate } = require("../models/department");
const { College } = require("../models/college");

/**
 * Department API to get all departments of a college
 * API Endpoint - /api/departments/?byCollegeId=collegeId
 * Type - GET
 */
departmentRouter.get("/", [auth, validateObjectId], async (req, res) => {
    let where = {};
    const byCollege = req.query.byCollegeId;
    if (byCollege && byCollege !== "") {
        where.college = byCollege;
    }
    const departments = await Department.find().where(where);
    res.send(departments);
});

/**
 * Department API to get specific department by id
 * API Endpoint example - /api/departments/5eb5b831e0b82e02086a4815
 * Type - GET
 */
departmentRouter.get("/:id", [auth, validateObjectId], async (req, res) => {
    const department = await Department.findById(req.params.id);
    if (!department) return res.status(404).send("The department with the given ID not found");
    res.send(department);
});

/**
 * Department API to save a department
 * API Endpoint - /api/departments/
 * Type - POST
 */
departmentRouter.post("/", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const college = await College.findById(req.body.collegeId);
    if (!college) return res.status(404).send("The college with the given ID not found");

    let department = new Department({
        name: req.body.name,
        college: req.body.collegeId,
    });

    department = await department.save();
    res.send(department);
});

/**
 * Department API to update a department
 * API Endpoint - /api/departments/5eb5b831e0b82e02086a4815
 * Type - PUT
 */
departmentRouter.put("/:id", [auth, validateObjectId], async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let department = await Department.findById(req.params.id);
    if (!department) return res.status(404).send("The department with the given ID not found");

    department.name = req.body.name;
    department = await department.save();
    res.send(department);
});

/**
 * Department API to delete a department
 * API Endpoint - /api/departments/5eb5b831e0b82e02086a4815
 * Type - DELETE
 */
departmentRouter.delete("/:id", [auth, validateObjectId], async (req, res) => {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) return res.status(404).send("The department with the given ID not found");
    res.send(department);
});

module.exports = departmentRouter;
