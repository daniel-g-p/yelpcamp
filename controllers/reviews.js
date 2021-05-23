const Campground = require("../utilities/campground_model");
const Review = require("../utilities/review_model");

module.exports.newReview = async(req, res) => {
    const id = req.params.id;
    const data = req.body.review;
    const review = new Review(data);
    review.author = req.session.userID;
    await review.save();
    const campground = await Campground.findById(id);
    campground.reviews.unshift(review);
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async(req, res) => {
    campgroundID = req.params.id;
    reviewID = req.params.reviewId;
    await Campground.findByIdAndUpdate(campgroundID, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    req.flash("success", "Your review was deleted");
    res.redirect(`/campgrounds/${campgroundID}`);
};