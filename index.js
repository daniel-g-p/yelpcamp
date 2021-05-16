const express = require("express");
const app = express();

const path = require("path");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const morgan = require("morgan");
app.use(morgan("tiny"));

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

const Campground = require("./utilities/campground_model");

const Review = require("./utilities/review_model");

const AppError = require("./utilities/app_error");

const { validateCampground, validateReview } = require("./utilities/joi_schema");

const catchError = require("./utilities/error_handler");

const verifyLogin = require("./utilities/verify_login");

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", function() {
    console.log("Connected to Mongo DB")
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/campgrounds", catchError(async(req, res, next) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds) {
        return next(new AppError("Couldn't retrieve the campground list from the database", 500, "/"));
    };
    res.render("home", { campgrounds });
}));

app.get("/campgrounds/new", verifyLogin, (req, res, next) => {
    res.render("new");
});
app.post("/campgrounds", validateCampground, catchError(async(req, res, next) => {
    const data = req.body;
    const campground = new Campground(data.cg);
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
}));

app.get("/campgrounds/:id", catchError(async(req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground) {
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    res.render("show", { campground });
}));

app.get("/campgrounds/edit/:id", verifyLogin, catchError(async(req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).exec();
    if (!campground) {
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    res.render("edit", { campground });
}));
app.patch("/campgrounds/edit/:id", validateCampground, catchError(async(req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    if (!campground) {
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    await Campground.findByIdAndUpdate(id, data.cg, { useFindAndModify: false });
    res.redirect(`/campgrounds/${id}`);
}));

app.get("/campgrounds/delete/:id", verifyLogin, catchError(async(req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).exec();
    if (!campground) {
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    res.render("delete", { campground });
}));
app.delete("/campgrounds/delete/:id", catchError(async(req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndDelete(id);
    if (!campground) {
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    res.redirect("/campgrounds");
}));

app.post("/campground/:id/review", validateReview, catchError(async(req, res) => {
    const id = req.params.id;
    const data = req.body.review;
    const review = await Review.create(data);
    const campground = await Campground.findById(id);
    campground.reviews.unshift(review);
    campground.save();
    res.redirect(`/campgrounds/${id}`);
}));

app.delete("/campground/:id/review/:reviewId", catchError(async(req, res) => {
    campgroundID = req.params.id;
    reviewID = req.params.reviewId;
    const campground = await Campground.findByIdAndUpdate(campgroundID, { $pull: { reviews: reviewID } });
    await Review.findByIdAndDelete(reviewID);
    res.redirect(`/campgrounds/${campgroundID}`);
}));

app.use((err, req, res, next) => {
    const { message = "An error occurred...", status = 500, url = "/campgrounds" } = err;
    if (status === 403) {
        res.render("logged_out", err);
    }
    res.render("error", { message, status, url });
});

app.listen(3000, () => {
    console.log("Connected to Port 3000");
});