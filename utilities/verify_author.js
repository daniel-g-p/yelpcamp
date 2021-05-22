const Campground = require("./campground_model");

const verifyAuthor = async(req, res, next) => {
    const { id } = req.params;
    const { author } = await Campground.findById(id);
    const { userID } = req.session;
    if (userID == author) {
        return next();
    } else {
        console.log(author);
        console.log(userID);
        req.flash("error", "You don't have the permission to do that...");
        res.redirect(`/campgrounds/${id}`);
    }
};

module.exports = verifyAuthor;