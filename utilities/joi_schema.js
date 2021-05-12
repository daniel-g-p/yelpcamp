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

module.exports = validateCampground;