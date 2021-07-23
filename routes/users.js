const express = require("express");
const config = require("config");
const Joi = require("joi");
const sendEmail = require("../utility/Mail");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const userRouter = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { Settings, validateSettings } = require("../models/settings");
const { User, validate } = require("../models/user");
const { College } = require("../models/college");
const { SubjectRequirement, getPredefinedSubjectRequirements } = require("../models/subjectRequirement");
const { Department, getPredefinedDepartments } = require("../models/department");

/**
 * User API to get specific user by id
 * API Endpoint example - /api/users/5eb5b831e0b82e02086a4815
 * Type - GET
 */
userRouter.get("/me", auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).send("The user with the given ID not found");
    res.send(user);
});

/**
 * User API to save a user
 * API Endpoint - /api/users/
 * Type - POST
 */
userRouter.post("/", async (req, res) => {
    const  { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).send("Email is already used!");

    let college = new College({
        name: "College " + Date.now(),
    });
    college = await college.save();

    const settings = new Settings({
        clockType: 12,
        firstDayOfWeek: "sun",
        timeIncrement: 30,
        appLanguage: 'english',
    });
    user = new User({ name, email, password, college: college._id, settings });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();

    const token = user.generateAuthToken();
    let userInfo = _.pick(user, ["_id", "name", "email", "college", "settings"]);

    if (process.env.NODE_ENV !== 'production') {
        userInfo.token = token; // for testing
    }

    res.header("X-Auth-Token", token).send(userInfo);
});
/**
 * Invite API to invite a user to the same timetable instance
 * API Endpoint - /api/users/invite
 * Type - POST
 */
userRouter.post("/invite", [auth, validateObjectId], async (req, res) => {
    const userSchema = {
        name: Joi.string().min(1).max(50).required().trim().label("Name"),
        email: Joi.string().email().min(1).max(255).required().trim().label("Email"),
        password: Joi.string().min(8).max(255).required().trim().label("Password"),
        collegeId: Joi.string().min(8).max(255).required().trim().label("Password"),
    };

    const { error } = Joi.validate(req.body, userSchema);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, email, password, collegeId } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).send("Email is already used!");

    const settings = new Settings({
        clockType: 12,
        firstDayOfWeek: "sun",
        timeIncrement: 30,
        appLanguage: 'english',
    });
    user = new User({ name, email, password, college: collegeId, settings });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();

    if (process.env.NODE_ENV === 'production') {
        try {
            await sendEmail("You have been invited", email, "Please check");
        } catch (e) {
            // Do not do anything
        }
    }

    res.send(_.pick(user, ["_id", "name", "email", "college", "settings"]));
});

/**
 * User API to update a user
 * API Endpoint - /api/users/me
 * Type - PUT
 */
userRouter.put("/me", auth, async (req, res) => {
    const userSchema = {
        name: Joi.string().min(1).max(50).required().trim().label("Name"),
        email: Joi.string().email().min(1).max(255).required().trim().label("Email"),
        password: Joi.string().allow("", null).min(8).max(255).trim().label("Password"),
    };

    const { error } = Joi.validate(req.body, userSchema);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findById(req.user._id); // req.user is set from jwt token in middleware
    if (!user) return res.status(404).send("The user with the given ID not found");

    const { name, email, password } = req.body;

    /* Check if email already in use */
    if (email !== user.email) {
        const isEmailExist = await User.findOne().where({ email });
        if (isEmailExist) return res.status(400).send("The email is already in use! Try different one");
    }

    user.name = name;
    user.email = email;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    }

    user = await user.save();
    res.send(_.pick(user, ["_id", "name", "email", "college", "settings"]));
});

/**
 * User API to update a user
 * API Endpoint - /api/users/updateSettings
 * Type - PUT
 */
userRouter.put("/updateSettings", auth, async (req, res) => {
    const { error } = validateSettings(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).send("The user with the given ID not found");
    const { clockType, firstDayOfWeek, timeIncrement, appLanguage } = req.body;

    user.settings = { clockType, firstDayOfWeek, timeIncrement, appLanguage };
    user = await user.save();
    res.send(user);
});

/**
 * Setup default departments / subject requirements / roles for the college
 * API Endpoint - /api/users/addDefaultDataForCollege
 * Type - POST
 */
userRouter.post("/addDefaultDataForCollege", auth, async (req, res) => {
    const collegeId = req.user.collegeId;
    const defaultDepartments = getPredefinedDepartments();
    const defaultSubjectRequirements = getPredefinedSubjectRequirements();

    defaultDepartments.forEach((department) => {
        department.college = collegeId;
    });
    const departments = await Department.insertMany(defaultDepartments);

    for (const department of departments) {
        let departmentId = department._id;
        defaultSubjectRequirements.forEach((sub) => {
            sub.department = departmentId;
        });
        await SubjectRequirement.insertMany(defaultSubjectRequirements);
    }
    res.send("true");
});

module.exports = userRouter;
