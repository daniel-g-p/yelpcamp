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

// SET UP REQUEST CONFIRMATION
app.use((req, res, next) => {
    const time = new Date;
    console.log(`Request received on ${time.toDateString()} at ${time.toTimeString()}`);
    next();
});

// USER VERIFICATION FUNCTION
const verifyLogin = (req, res, next) => {
    const user = req.query.user;
    console.dir(user);
    const url = req.originalUrl;
    console.log(url);
    if (user === "loggedIn") {
        next();
    } else {
        res.render("campgrounds/logged_out", { url });
    };
};

// INDEX ROUTE
app.get("/", (req, res) => {
    res.render("index");
});

// ROUTE FOR ALL CAMPGROUNDS
app.get("/campgrounds", async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
});

// ROUTES TO CREATE A NEW CAMPGROUNDS
app.get("/campgrounds/new", verifyLogin, (req, res) => {
    res.render("campgrounds/new");
});
app.post("/campgrounds", async(req, res) => {
    const data = req.body;
    const campground = new Campground(data.cg);
    await campground.save();
    res.redirect(`/campgrounds/${campground.id}`);
});

// ROUTE TO VIEW AN EXISTING CAMPGROUND IN DETAIL
app.get("/campgrounds/:id", async(req, res) => {
    const id = req.params.id;
    const url = req.originalUrl;
    try {
        const campground = await Campground.findById(id).exec();
        res.render("campgrounds/show", { campground });
    } catch {
        res.render("campgrounds/not_found", { url });
    };
});

// ROUTES TO UPDATE AN EXISTING CAMPGROUND
app.get("/campgrounds/edit/:id", verifyLogin, async(req, res) => {
    const id = req.params.id;
    const url = req.originalUrl;
    try {
        const campground = await Campground.findById(id).exec();
        res.render("campgrounds/edit", { campground });
    } catch {
        res.render("campgrounds/not_found", { url });
    };
});

app.patch("/campgrounds/edit/:id", async(req, res) => {
    const id = req.params.id;
    const data = req.body;
    const url = req.originalUrl;
    try {
        await Campground.findByIdAndUpdate(id, data.cg, { useFindAndModify: false });
        res.redirect(`/campgrounds/${id}`);
    } catch {
        res.render("campgrounds/not_found", { url });
    };
});

// ROUTES TO DELETE AN EXISTING CAMPGROUND
app.get("/campgrounds/delete/:id", verifyLogin, async(req, res) => {
    const id = req.params.id;
    const url = req.originalUrl;
    try {
        const campground = await Campground.findById(id).exec();
        res.render("campgrounds/delete", { campground });
    } catch {
        res.render("campgrounds/not_found", { url });
    };
});
app.delete("/campgrounds/delete/:id", async(req, res) => {
    const id = req.params.id;
    const url = req.originalUrl;
    try {
        await Campground.findByIdAndDelete(id);
        res.redirect("/campgrounds");
    } catch {
        res.render("campgrounds/not_found", { url });
    };
});

// SET UP ERROR 404 ROUTE
app.use((req, res) => {
    const url = req.originalUrl;
    console.log(`Request for "${url}" returned no results`);
    res.render("campgrounds/not_found", { url });
});

// START THE SERVER
app.listen(3000, () => {
    console.log("Connected to Port 3000");
});