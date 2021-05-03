const cities = require("./cities");
const helpers = require("./helpers");

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", function() {
    console.log("Connected to Mongo DB")
});
const Campground = require("./../models/campgrounds");

const seedDatabase = async(n) => {
    await Campground.deleteMany({});
    const seedData = [];
    let count = 0;
    for (i = 0; i < n; i++) {
        const randomCity = Math.floor(Math.random() * cities.length);
        const randomDescriptor = Math.floor(Math.random() * helpers.descriptors.length);
        const randomPlace = Math.floor(Math.random() * helpers.places.length);
        const city = cities[randomCity].city;
        const name = helpers.descriptors[randomDescriptor] + " " + helpers.places[randomPlace];
        const newCampground = {
            name: name,
            price: Math.floor(Math.random() * 180) + 21,
            description: name,
            location: city
        }
        seedData.push(newCampground);
        count++;
    }
    await Campground.insertMany(seedData);
    console.log(`Campground database seeded successfully with ${count} items`);
};