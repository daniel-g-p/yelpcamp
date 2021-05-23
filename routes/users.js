const express = require("express");
const router = express.Router({ mergeParams: true });
const users = require("../controllers/users");
const { validateUser } = require("../utilities/joi_schema");
const catchError = require("../utilities/error_handler");

router.route("/register")
    .get(users.newUser)
    .post(validateUser, catchError(users.createUser));

router.route("/login")
    .get(users.loginForm)
    .post(users.loginUser);

router.get("/logout", users.logoutUser);

module.exports = router;