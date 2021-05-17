const express = require("express");
const router = express.Router();

const catchError = require("../utilities/error_handler");
const { validateReview } = require("../utilities/joi_schema");

const Campground = require("../utilities/campground_model");
const Review = require("../utilities/review_model");

router.post("/:id/review", validateReview, catchError(async(req, res) => {
    const id = req.params.id;
    const data = req.body.review;
    const review = await Review.create(data);
    const campground = await Campground.findById(id);
    campground.reviews.unshift(review);
    campground.save();
    res.redirect(`/campgrounds/${id}`);
}));

router.delete("/:id/review/:reviewId", catchError(async(req, res) => {
    campgroundID = req.params.id;
    reviewID = req.params.reviewId;
    const campground = await Campground.findByIdAndUpdate(campgroundID, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${campgroundID}`);
}));

module.exports = router;