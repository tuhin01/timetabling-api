const express = require("express");
const error = require("../middleware/error");
const authRouter = require("../routes/auth");
const homeRouter = require("../routes/home");
const userRouter = require("../routes/users");
const lecturerRouter = require("../routes/lecturers");
const studentRouter = require("../routes/students");
const shareableFormRouter = require("../routes/shareableForms");
const facilityRouter = require("../routes/facilities");
const departmentRouter = require("../routes/departments");
const subjectRouter = require("../routes/subjects");
const subjectRequirementRouter = require("../routes/subjectRequirements");
const timetableRouter = require("../routes/timetables");

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static("public"));

    /**
     * Allow access to the API from anywhere
     */
    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
        res.header("Access-Control-Expose-Headers", "x-auth-token");
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token"
        );
        next();
    });

    /**
     * Timetabling App specific routers
     */
    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);
    app.use("/api/lecturers", lecturerRouter);
    app.use("/api/students", studentRouter);
    app.use("/api/facilities", facilityRouter);
    app.use("/api/shareable-forms", shareableFormRouter);
    app.use("/api/departments", departmentRouter);
    app.use("/api/subjects", subjectRouter);
    app.use("/api/subjectRequirements", subjectRequirementRouter);
    app.use("/api/timetables", timetableRouter);
    app.use("/", homeRouter);

    /**
     * Timetabling App specific error handling
     */
    app.use(error);
};
