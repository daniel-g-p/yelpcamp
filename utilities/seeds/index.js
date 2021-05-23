const cities = require("./cities");
const helpers = require("./helpers");

const fetch = require("node-fetch");
const { createApi } = require("unsplash-js");
const unsplash = createApi({
    accessKey: "_GT7f6XrO9eA4DbJ0hLUvwZvdakQVfVJ2NzmSsBHH2k",
});

const Chance = require("chance");
const chance = new Chance();

const LoremIpsum = require("lorem-ipsum").LoremIpsum;
const lorem = new LoremIpsum({
    sentencesPerParagraph: {
        max: 8,
        min: 4
    },
    wordsPerSentence: {
        max: 16,
        min: 4
    }
});

const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/yelpcamp", { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", function() {
    console.log("Connected to Mongo DB")
});

const Campground = require("./../campground_model");
const Review = require("./../review_model");
const User = require("./../user_model");

const fetchImages = async() => {
    return unsplash.collections.getPhotos({ collectionId: '9046579', perPage: 25 })
        .then(res => { return res.response.results })
        .catch(error => console.log(error));
};

const seedDatabase = async(n) => {
    await resetDatabase();
    const imageList = await fetchImages();
    const admin = await User.create({
        email: "admin@yelpcamp.com",
        username: "admin",
        password: "Yelpcamp2021"
    });
    const seedData = [];
    for (i = 0; i < n; i++) {
        const randomCity = chance.integer({ min: 0, max: cities.length - 1 });
        const randomDescriptor = chance.integer({ min: 0, max: helpers.descriptors.length - 1 });
        const randomPlace = chance.integer({ min: 0, max: helpers.places.length - 1 });
        const randomImage = chance.integer({ min: 0, max: imageList.length - 1 });
        const city = cities[randomCity].city;
        const name = helpers.descriptors[randomDescriptor] + " " + helpers.places[randomPlace];
        const imageLink = imageList[randomImage].urls.small;
        const reviews = [];
        for (x = 0; x < 3; x++) {
            const review = await Review.create({
                name: chance.first(),
                rating: chance.integer({ min: 1, max: 5 }),
                comment: lorem.generateSentences(1),
                author: admin
            });
            reviews.push(review);
        };
        const newCampground = {
            name: name,
            price: Math.floor(Math.random() * 40) + 10,
            description: lorem.generateSentences(1),
            location: city,
            image: imageLink,
            author: admin,
            reviews: reviews
        }
        seedData.push(newCampground);
    }
    await Campground.insertMany(seedData);
    console.log(`Database seeded successfully...`);
};

const resetDatabase = async() => {
    await Campground.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    console.log("Database reset successfully...");
};