const Joi = require("joi");
const AppError = require("./app_error");

const validateCampground = (req, res, next) => {
    const validCampground = Joi.object({
        name: Joi.string().required(),
        price: Joi.number().required().min(10).max(50),
        description: Joi.string().required(),
        location: Joi.string().required(),
        image: Joi.string().uri().required()
    }).required();
    const cg = validCampground.validate(req.body.cg);
    if (cg.error) {
        console.log(cg.error.details);
        return next(new AppError("Invalid Campground", 407));
    } else {
        next();
    };
};

const validateReview = (req, res, next) => {
    const validReview = Joi.object({
        name: Joi.string().required(),
        comment: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required()
    }).required();
    const review = validReview.validate(req.body.review);
    if (review.error) {
        return next(new AppError("Invalid Review", 407));
    } else {
        next();
    }
}

const validateUser = (req, res, next) => {
    const validUser = Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        password: Joi.string().min(8).max(20).required()
    }).required();
    const user = validUser.validate(req.body.user);
    if (user.error) {
        req.flash("error", "Invalid User");
        res.redirect("/users/register");
    } else {
        next();
    }
};

module.exports.validateCampground = validateCampground;
module.exports.validateReview = validateReview;
module.exports.validateUser = validateUser;