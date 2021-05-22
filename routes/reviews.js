const express = require("express");
const router = express.Router({ mergeParams: true });

const catchError = require("../utilities/error_handler");
const { validateReview } = require("../utilities/joi_schema");
const verifyLogin = require("../utilities/verify_login");
const verifyReviewAuthor = require("../utilities/verify_review_author");
const Campground = require("../utilities/campground_model");
const Review = require("../utilities/review_model");

router.post("/", verifyLogin, validateReview, catchError(async(req, res) => {
    const id = req.params.id;
    const data = req.body.review;
    const review = new Review(data);
    review.author = req.session.userID;
    await review.save();
    const campground = await Campground.findById(id);
    campground.reviews.unshift(review);
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
}));

router.delete("/:reviewId", verifyReviewAuthor, catchError(async(req, res) => {
    campgroundID = req.params.id;
    reviewID = req.params.reviewId;
    await Campground.findByIdAndUpdate(campgroundID, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${campgroundID}`);
}));

module.exports = router;