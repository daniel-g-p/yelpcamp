const User = require("../utilities/user_model");
const bcrypt = require("bcrypt");

module.exports.newUser = (req, res) => {
    res.render("new_user");
};

module.exports.createUser = async(req, res) => {
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
};

module.exports.loginForm = (req, res) => {
    res.render("login");
};

module.exports.loginUser = async(req, res) => {
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
};

module.exports.logoutUser = (req, res) => {
    req.session.userID = null;
    res.redirect("/campgrounds");
};