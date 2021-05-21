const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../utilities/user_model");
const { validateUser } = require("../utilities/joi_schema");
const catchError = require("../utilities/error_handler");
const verifyLogin = require("../utilities/verify_login");
const bcrypt = require("bcrypt");

router.get("/register", (req, res) => {
    res.render("new_user");
});

router.post("/register", validateUser, catchError(async(req, res) => {
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
}));

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", async(req, res) => {
    const { username, password } = req.body.user;
    const user = await User.findOne({ username });
    if (user) {
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid) {
            const returnTo = req.session.returnTo;
            req.session.userID = user.id;
            req.flash("success", `Welcome back, ${username}!`);
            if (returnTo) {
                res.redirect(returnTo);
            } else {
                res.redirect("/campgrounds");
            }
        } else {
            req.flash("error", "Invalid credentials, please try again...");
            res.redirect("/users/login");
        }
    } else {
        req.flash("error", "Invalid credentials, please try again...");
        res.redirect("/users/login");
    }
});

router.get("/logout", (req, res) => {
    req.session.userID = null;
    res.redirect("/campgrounds");
});

module.exports = router;