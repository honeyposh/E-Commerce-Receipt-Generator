const express = require("express");
const { login, signup } = require("../controllers/user.controller");
const route = express.Router();
route.post("/signup", signup);
route.post("/login", login);
module.exports = route;
