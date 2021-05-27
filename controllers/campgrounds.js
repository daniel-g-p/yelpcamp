const Campground = require("../utilities/campground_model");
const User = require("../utilities/user_model");
const isOwner = require("../utilities/isOwner");
const AppError = require("../utilities/app_error");
const { upload } = require("../utilities/s3");

module.exports.index = async(req, res, next) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds) {
        return next(new AppError("Couldn't retrieve the campground list from the database", 500, "/"));
    };
    res.render("home", { campgrounds });
};

module.exports.newCampground = (req, res, next) => {
    res.render("new");
};

module.exports.createCampground = async(req, res, next) => {
    const { files } = req;
    const uploads = upload(files);
    const images = await Promise.all(uploads)
        .then((result) => { return result });
    const data = req.body.cg;
    data.images = images.map(i => {
        return {
            path: i.Location,
            filename: i.Key
        }
    });
    console.log(data);
    const { userID } = req.session;
    const campground = new Campground(data);
    campground.author = await User.findById(userID);
    console.log(campground);
    await campground.save();
    req.flash("success", "Campground has been added to the list...");
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.getCampground = async(req, res, next) => {
    const id = req.params.id;
    const { userID } = req.session;
    const campground = await Campground.findById(id).populate({ path: "reviews", populate: { path: "author", select: { "username": 1 } } }).populate("author", "username");
    if (!campground) {
        req.flash("error", "Something went wrong...");
        return res.redirect("/campgrounds");
    }
    const owner = isOwner(req.session.userID, campground.author.id);
    res.render("show", { campground, owner, userID });
};

module.exports.editCampground = async(req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if (!campground) {
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    res.render("edit", { campground });
};

module.exports.updateCampground = async(req, res, next) => {
    const id = req.params.id;
    const data = req.body;
    const campground = await Campground.findByIdAndUpdate(id, data.cg, { useFindAndModify: false });
    if (!campground) {
        req.flash("error", "Something went wrong...");
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    req.flash("success", "Campground has been updated...");
    res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async(req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findById(id).populate("author", "username");
    if (!campground) {
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    res.render("delete", { campground });
};

module.exports.confirmDeleteCampground = async(req, res, next) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndDelete(id);
    if (!campground) {
        throw new AppError(`Couldn't find the campground with the ID of ${id}`, 404);
    }
    req.flash("success", "Campground was deleted from the Database...");
    res.redirect("/campgrounds");
};