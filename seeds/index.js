const cities = require("./cities");
const helpers = require("./helpers");

const lorem = require("lorem-ipsum").LoremIpsum;

const fetch = require("node-fetch");
const { createApi } = require("unsplash-js");

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", function() {
    console.log("Connected to Mongo DB")
});
const Campground = require("./../models/campgrounds");

const unsplash = createApi({
    accessKey: "_GT7f6XrO9eA4DbJ0hLUvwZvdakQVfVJ2NzmSsBHH2k",
});

const fetchCollection = () => {
    const photos = unsplash.collections.getPhotos({ collectionId: '9046579' })
        .then(res => console.log(res.response));
    // fetch("https://api.unsplash.com/collections/9046579/photos", {
    //         accessKey: "_GT7f6XrO9eA4DbJ0hLUvwZvdakQVfVJ2NzmSsBHH2k",
    //         method: "GET"
    //     })
    //     .then(res => {
    //         const photos = res;
    //         console.log(photos);
    //         return photos;
    //     });
};

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
            price: Math.floor(Math.random() * 25) + 5,
            description: lorem(),
            location: city
        }
        seedData.push(newCampground);
        count++;
    }
    await Campground.insertMany(seedData);
    console.log(`Campground database seeded successfully with ${count} items`);
};