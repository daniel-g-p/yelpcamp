const express = require("express");
const app = express();

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");
const path = require("path");
const methodOverride = require("method-override");
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", function() {
    console.log("Connected to Mongo DB")
});

const sessionConfig = {
    secret: "thisshouldbesecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}

app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(session(sessionConfig));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.engine("ejs", ejsMate);
app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.use("/campgrounds", campgroundRoutes);

app.use("/campground/:id/review", reviewRoutes);

app.use("/users", userRoutes);

app.use((err, req, res, next) => {
    const { message = "An error occurred...", status = 500, url = "/campgrounds" } = err;
    if (status === 403) {
        res.render("logged_out", { message, status, url });
    }
    res.render("error", { message, status, url });
});

app.use((req, res) => {
    req.flash("error", "Couldn't find what you were looking for...");
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Connected to Port 3000");
});