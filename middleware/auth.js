const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  // if (!config.get("requiresAuth")) return next();

  const token = req.header("X-Auth-Token");
  // 401 = Unauthorized
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    req.user = jwt.verify(token, process.env.TIMETABLING_JWT_KEY);
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};
