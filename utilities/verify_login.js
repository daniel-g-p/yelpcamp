const AppError = require("./app_error");

const verifyLogin = (req, res, next) => {
    const user = req.query.user;
    const url = req.originalUrl;
    if (user === "loggedIn") {
        return next();
    } else {
        return next(new AppError("Please log into your Account", 403, url));
    }
};

module.exports = verifyLogin;