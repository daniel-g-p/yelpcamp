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
    }
});

userSchema.pre("save", async function(next) {
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
});

userSchema.statics.checkLogin = async function(password) {
    const isValid = await bcrypt.compare(password);
    if (isValid) {
        return true;
    } else {
        return false;
    }
};

const User = mongoose.model("User", userSchema);

module.exports = User;