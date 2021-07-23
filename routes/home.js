const express = require("express");
const homeRouter = express.Router();

homeRouter.get("/", (req, res) => {
    res.send("Timetabling API");
});

module.exports = homeRouter;
