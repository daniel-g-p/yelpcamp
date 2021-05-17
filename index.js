const express = require("express");
const app = express();

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");

const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const morgan = require("morgan");
app.use(morgan("tiny"));

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", function() {
    console.log("Connected to Mongo DB")
});

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.use("/campgrounds", campgroundRoutes);

app.use("/campground", reviewRoutes);

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