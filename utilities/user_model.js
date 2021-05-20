const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const saltRounds = 12;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    campgrounds: [{
        type: Schema.Types.ObjectId,
        ref: "Campground"
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
});

userSchema.pre("save", async function(next) {
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;