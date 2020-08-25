'use strict';

const mongoose = require("mongoose");
const bycrpt = require('bcryptjs');
const { Timestamp } = require("mongodb");
const { Sequelize, DataTypes } = require("sequelize");

const Schema = mongoose.Schema;

// User Schema
const User = mongoose.model("User", new Schema({
    // _id: mongoose.Schema.ObjectId,
    firstName: { type: String, required: [true, "First Name can't be left blank."], trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, unique: true },
    roles: {
        admin: { type: Schema.Types.ObjectId, ref: 'Admin' },
        account: { type: Schema.Types.ObjectId, ref: 'Account' }
    },
    isActive: { type: String },
    emailAddress: { type: String, unique: true, lowercase: true, required: [true, "Email can't be left blank."], trim: true },
    password: { type: String, required: [true, "Must have Password"] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
}))

// https://github.com/jedireza/drywall/blob/master/schema/User.js
User.schema.methods.canPlayRoleOf = function (role) {
    if (role === "admin" && this.roles.admin) {
        return true;
    }

    if (role === "account" && this.roles.account) {
        return true;
    }

    return false;
}

User.schema.methods.defaultReturnUrl = function () {
    const returnUrl = '/';
    if (this.canPlayRoleOf('account')) {
        returnUrl = '/account/';
    }

    if (this.canPlayRoleOf('admin')) {
        returnUrl = '/admin/';
    }

    return returnUrl;
}

// User.schema.statics.encryptPassword = function (password, done) {
//     // salt
//     // hash
// };

// User.schema.statics.validatePassword = function (passowrd, hash, done) {
//     // bycrpt.compare
// }

// -------------------------------------------------------------------- //

const Admin = mongoose.model("Admin", new Schema({
    user: {
        id: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, default: '' }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
}));

// -------------------------------------------------------------------- //

const Session = mongoose.model("Session", new Schema({
    title: { type: String },
    description: { type: String },
    userCreated: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        time: { type: Date, default: Date.now }
    },
    sessionForm: { type: Schema.Types.ObjectId, ref: 'SessionForm' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
}));

// -------------------------------------------------------------------- //

const Account = mongoose.model("Account", new Schema({
    user: {
        id: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String }
    },
    name: {
        first: { type: String },
        last: { type: String },
        full: { type: String }
    },
    session: [[Session.schema]],
    isVerified: { type: String },
    userCreated: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        time: { type: Date, default: Date.now }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }


}));

// -------------------------------------------------------------------- //

const SessionForm = mongoose.model("SessionForm", new Schema({
    userCreated: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        time: { type: Date, default: Date.now }
    },
    member: {
        name: { type: String },
    },
    startTime: { type: String },
    endTime: { type: String },
    totalTime: { type: String },
    sessionDate: { type: Date },
    memberName: { type: String }, // replace with member name from props
    serviceProvided: { type: String },
    sessionLocation: { type: String },
    memberApperance: { type: String },
    environmentAppearance: { type: String },
    memberMood: { type: String },
    memberEyeContact: { type: String },
    memberJudgement: { type: String },
    memberCooperation: { type: String },
    intervention: { type: String },
    coachWill: { type: String },
    coachWillContinue: { type: String },
    memberProgress: { type: String },
}));

// -------------------------------------------------------------------- //

const Location = mongoose.model("Location", new Schema({
    name: { type: String},
    isAvailabe: { type: String },
    address: {
        city: { type: String },
        state: { type: String },
        country: { type: String },
        street1: { type: String },
        street2: { type: String },
        zipCode: { type: String },
    }
}));

module.exports = { Account, Admin, Location, Session, SessionForm, User };
