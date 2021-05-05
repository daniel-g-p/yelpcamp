const cities = require("./cities");
const helpers = require("./helpers");

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


const setFetchSettings = () => {
    return unsplash.collections.getPhotos({ collectionId: '9046579' })
        .then(res => {
            return res.response.total;
        })
        .catch(error => {
            console.log(error);
        });
}

let photos;
const fetchCollection = async() => {
    const totalImages = await setFetchSettings();
    return unsplash.collections.getPhotos({ collectionId: '9046579', perPage: totalImages, page: 1 })
        .then(res => {
            photos = res.response.results;
            return photos.length;
        });
};

const seedDatabase = async(n) => {
    await Campground.deleteMany({});
    const seedData = [];
    const images = await fetchCollection();
    let count = 0;
    for (i = 0; i < n; i++) {
        const randomCity = Math.floor(Math.random() * cities.length);
        const randomDescriptor = Math.floor(Math.random() * helpers.descriptors.length);
        const randomPlace = Math.floor(Math.random() * helpers.places.length);
        const randomImage = Math.floor(Math.random() * images)
        const city = cities[randomCity].city;
        const name = helpers.descriptors[randomDescriptor] + " " + helpers.places[randomPlace];
        const imageLink = photos[randomImage].urls.small;
        const newCampground = {
            name: name,
            price: Math.floor(Math.random() * 25) + 5,
            description: lorem.generateSentences(1),
            location: city,
            image: imageLink
        }
        seedData.push(newCampground);
        count++;
    }
    await Campground.insertMany(seedData);
    console.log(`Campground database seeded successfully with ${count} items`);
};