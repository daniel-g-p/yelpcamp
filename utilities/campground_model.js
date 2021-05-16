const mongoose = require("mongoose");
const { Schema } = mongoose;

const Review = require("./review_model");

const CampgroundSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

CampgroundSchema.post("findOneAndDelete", async(campground) => {
    await Review.deleteMany({ _id: { $in: campground.reviews } });
});

const Campground = mongoose.model("Campground", CampgroundSchema);

module.exports = Campground;