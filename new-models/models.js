'use strict';

var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

// User Schema
var UserSchema = new Schema({
    // _id: mongoose.Schema.ObjectId,
    firstName: {
        type: String, 
        required: [true, "First Name can't be left blank."],
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    emailAddress: {
        type: String, 
        unique: true,
        lowercase: true, 
        required: [true, "Email can't be left blank."],
        trim: true
    },
    password: {
        type: String, 
        required: [true, "Must have Password"]
    }
})

UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

var User = mongoose.model("User", UserSchema)

module.exports.User = User;
