const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../utilities/user_model");
const { validateUser } = require("../utilities/joi_schema");
const catchError = require("../utilities/error_handler");

router.get("/register", (req, res) => {
    res.render("new_user");
});

router.post("/register", validateUser, async(req, res) => {
    const data = req.body.user;
    const existingUser = await User.findOne({ username: data.username });
    if (existingUser) {
        req.flash("error", "Sorry, that username is already taken...");
        res.redirect("/users/register");
    }
    const newUser = await User.create(data);
    req.session.userID = newUser.id;
    req.flash("success", "Welcome to Yelpcamp");
    res.redirect("/campgrounds");
});

module.exports = router;