// Set up Mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define a Schema
const CampgroundSchema = new Schema({
    name: String,
    price: Number,
    description: String,
    location: String,
    image: String
});

// Compile a Model from the Schema
const Campground = mongoose.model("Campground", CampgroundSchema);


// Export the Model to use it in other Files
module.exports = Campground;