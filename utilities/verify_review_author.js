const Review = require("./review_model");

const verifyReviewAuthor = async(req, res, next) => {
    const { reviewId, id } = req.params;
    const { author } = await Review.findById(reviewId);
    const { userID } = req.session;
    if (userID == author) {
        return next();
    } else {
        req.flash("error", "You don't have the permission to do that...");
        res.redirect(`/campgrounds/${id}`);
    }
};

module.exports = verifyReviewAuthor;