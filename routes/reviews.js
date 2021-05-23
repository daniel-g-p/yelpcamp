const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");
const catchError = require("../utilities/error_handler");
const { validateReview } = require("../utilities/joi_schema");
const verifyLogin = require("../utilities/verify_login");
const verifyReviewAuthor = require("../utilities/verify_review_author");

router.post("/", verifyLogin, validateReview, catchError(reviews.newReview));

router.delete("/:reviewId", verifyReviewAuthor, catchError(reviews.deleteReview));

module.exports = router;