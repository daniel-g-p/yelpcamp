// SET UP EXPRESS
const express = require("express");
const app = express();

// REQUIRE THE PATH MODULE
const path = require("path");

// REQUIRE THE METHOD OVERRIDE MODULE
const methodOverride = require("method-override");

// REQUIRE MORGAN MIDDLEWARE
const morgan = require("morgan");

// REQUIRE EJS MATE PACKAGE
const ejsMate = require("ejs-mate");

// REQUIRE APPERROR CLASS
const AppError = require("./AppError");

// SET UP MONGOOSE
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", function() {
    console.log("Connected to Mongo DB")
});

// REQUIRE THE DATABASE MODEL
const Campground = require("./models/campgrounds");

// SET UP ENGINE
app.engine("ejs", ejsMate);

// SET UP THE VIEWS DIRECTORY
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ENABLE FORM PARSING
app.use(express.urlencoded({ extended: true }));

// ENABLE METHOD OVERRIDE
app.use(methodOverride("_method"));

// ENABLE MORGAN MIDDLEWARE
app.use(morgan("tiny"));

// USER VERIFICATION FUNCTION
const verifyLogin = (req, res, next) => {
    const user = req.query.user;
    const url = req.originalUrl;
    if (user === "loggedIn") {
        return next();
    } else {
        throw new AppError("Please log into your Account", 401, url);
    }
};

// INDEX ROUTE
app.get("/", (req, res) => {
    res.render("index");
});

// ROUTE FOR ALL CAMPGROUNDS
app.get("/campgrounds", async(req, res, next) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds) {
        throw new AppError("Couldn't retrieve the requested data from the database (ALL)...", 400);
    };
    res.render("campgrounds/index", { campgrounds });
});

// ROUTES TO CREATE A NEW CAMPGROUND
app.get("/campgrounds/new", verifyLogin, (req, res, next) => {
    res.render("campgrounds/new");
});
app.post("/campgrounds", async(req, res, next) => {
    const url = req.originalUrl;
    const data = req.body;
    try {
        const campground = new Campground(data.cg);
        await campground.save();
    } catch {
        return next(new AppError("Couldn't save the new data to the database (CREATE)...", 500, url))
    };
    res.redirect(`/campgrounds/${campground.id}`);
});

// ROUTE TO VIEW AN EXISTING CAMPGROUND IN DETAIL
app.get("/campgrounds/:id", async(req, res, next) => {
    const id = req.params.id;
    const url = req.originalUrl;
    try {
        const campground = await Campground.findById(id).exec();
        res.render("campgrounds/show", { campground });
    } catch {
        return next(new AppError("Couldn't retrieve the requested data from the database (READ)...", 400, url));
    }
});

// ROUTES TO UPDATE AN EXISTING CAMPGROUND
app.get("/campgrounds/edit/:id", verifyLogin, async(req, res, next) => {
    const id = req.params.id;
    const url = req.originalUrl;
    try {
        const campground = await Campground.findById(id).exec();
        res.render("campgrounds/edit", { campground });
    } catch {
        return next(new AppError("Couldn't retrieve the requested data from the database (UPDATE)...", 400, url))
    };
});
app.patch("/campgrounds/edit/:id", async(req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const url = req.originalUrl;
    try {
        await Campground.findByIdAndUpdate(id, data.cg, { useFindAndModify: false });
        res.redirect(`/campgrounds/${id}`);
    } catch {
        return next(new AppError("Couldn't save the new data from the database (UPDATE)...", 400, url))
    };
});

// ROUTES TO DELETE AN EXISTING CAMPGROUND
app.get("/campgrounds/delete/:id", verifyLogin, async(req, res, next) => {
    const id = req.params.id;
    const url = req.originalUrl;
    try {
        const campground = await Campground.findById(id).exec();
        res.render("campgrounds/delete", { campground });
    } catch {
        return next(new AppError("Couldn't retrieve the requested data from the database (DELETE)...", 400, url))
    };
});
app.delete("/campgrounds/delete/:id", async(req, res, next) => {
    const id = req.params.id;
    const url = req.originalUrl;
    try {
        const campground = await Campground.findByIdAndDelete(id);
        res.redirect("/campgrounds");
    } catch {
        return next(new AppError("Couldn't delete the data from the database (DELETE)...", 500, url));
    };
});

// ROUTE FOR ERROR HANDLING
app.use((err, req, res, next) => {
    const { message = "An error occurred...", status = 500, url = "/" } = err;
    console.log(err.name);
    if (status === 401) {
        res.render("campgrounds/logged_out", err);
    }
    console.log("Error occurred...");
    res.render("campgrounds/error", { message, status, url });
});

// START THE SERVER
app.listen(3000, () => {
    console.log("Connected to Port 3000");
});