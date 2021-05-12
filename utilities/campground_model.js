// Set up Mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define a Schema
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
    }
});

// Compile a Model from the Schema
const Campground = mongoose.model("Campground", CampgroundSchema);


// Export the Model to use it in other Files
module.exports = Campground;