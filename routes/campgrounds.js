const express = require("express");
const router = express.Router();

const catchError = require("../utilities/error_handler");
const verifyLogin = require("../utilities/verify_login");
const { validateCampground } = require("../utilities/joi_schema");
const Campground = require("../utilities/campground_model");
const AppError = require("../utilities/app_error");

router.get("/", catchError(async(req, res, next) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds) {
        return next(new AppError("Couldn't retrieve the campground list from the database", 500, "/"));
    };
    res.render("home", { campgrounds });
}));

router.get("/new", verifyLogin, (req, res, next) => {
    res.render("new");
});
router.post("/", validateCampground, catchError(async(req, res, next) => {
    const data = req.body;
    const campground = new Campground(data.cg);
    await campground.save();
    req.flash("success", "Campground has been added to the list...");
    res.redirect(`/campgrounds/${campground.id}`);
}));

router.get("/:id", catchError(async(req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).populate("reviews");
    if (!campground) {
        req.flash("error", "Something went wrong...");
        return res.redirect("/campgrounds");
    }
    res.render("show", { campground });
}));

router.get("/edit/:id", verifyLogin, catchError(async(req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    res.render("edit", { campground });
}));
router.patch("/edit/:id", validateCampground, catchError(async(req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const campground = await Campground.findByIdAndUpdate(id, data.cg, { useFindAndModify: false });
    if (!campground) {
        req.flash("error", "Something went wrong...");
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    req.flash("success", "Campground has been updated...");
    res.redirect(`/campgrounds/${id}`);
}));

router.get("/delete/:id", verifyLogin, catchError(async(req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    res.render("delete", { campground });
}));
router.delete("/delete/:id", catchError(async(req, res, next) => {
    const id = req.params.id;
    req.flash("error", "Something went wrong...")
    const campground = await Campground.findByIdAndDelete(id);
    if (!campground) {
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    res.redirect("/campgrounds");
}));

module.exports = router;