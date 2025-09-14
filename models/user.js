const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config(); 

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
        index: true
    },
    lastName: {
        type: String,
        required: true,
        minlength: 2,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
    },
    totalIncome: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalExpense: {
        type: Number,
        default: 0,
        min: 0,
    },
}, { timestamps: true }); 

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    return await bcrypt.compare(passwordInputByUser, this.password);
};

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = jwt.sign({_id:user._id}, process.env.JWT_SECRET_KEY , {expiresIn : '1d'});
    return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;