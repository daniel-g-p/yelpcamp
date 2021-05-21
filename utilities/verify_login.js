const verifyLogin = (req, res, next) => {
    if (req.session.userID) {
        next();
    } else {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "Please log into your account...");
        res.redirect("/users/login");
    }
};

module.exports = verifyLogin;