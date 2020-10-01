'use strict';

const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const validator = require('validator')
const jwt = require('jsonwebtoken')

// remove
const Schema = mongoose.Schema;

const sessionSchema = mongoose.Schema({
    title: { type: String, unique: true },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    members: [{
        member: { type: Schema.Types.ObjectId, ref: 'User' }
    }],
    inactive: { type: Boolean, default: false }
});

// User Schema
const userSchema = mongoose.Schema({
    username: { type: String, unique: true },
    account: { type: Schema.Types.ObjectId, ref: 'Account' },
    isActive: { type: String },
    profile: { type: Schema.Types.ObjectId, ref: 'Profile' },
    role: { type: String },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    emailAddress: {
        type: String, unique: true, lowercase: true, required: [true, "Email can't be left blank."], trim: true,
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({ error: 'Invalid Email address' })
            }
        }
    },
    password: { type: String, required: [true, "Must have Password"] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

userSchema.pre('save', async function (next) {
    // Hash the password before saving the user model
    try {
        const user = this
        if (user.isModified('password')) {
            user.password = await bcrypt.hash(user.password, 8)
        }
        next()
    } catch (error) {
        next(error)
    }
})

// https://github.com/jedireza/drywall/blob/master/schema/User.js
userSchema.methods.canPlayRoleOf = function (role) {
    if (role === "admin" && this.roles.admin) {
        return true;
    }

    if (role === "account" && this.roles.account) {
        return true;
    }

    return false;
}

userSchema.methods.defaultReturnUrl = function () {
    let returnUrl = '/';
    if (this.canPlayRoleOf('account')) {
        returnUrl = '/account/';
    }

    if (this.canPlayRoleOf('admin')) {
        returnUrl = '/admin/';
    }

    return returnUrl;
}

userSchema.methods.generateAuthToken = async function () {
    // Generate an auth token for the user
    try {
        const user = this
        const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY)
        user.tokens = user.tokens.concat({ token })
        await user.save()
        return token
    } catch (error) {
        return error
    }
}

userSchema.statics.findByCredentials = async (email, password) => {
    // Search for a user by email and password.
    try {
        const user = await User.findOne({ email })
        if (!user) {
            throw new Error({ error: 'Invalid login credentials' })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            throw new Error({ error: 'Invalid login credentials' })
        }
        return user
    } catch (error) {
        return error
    }
}

const profileSchema = mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: [true, "First Name can't be left blank."], trim: true },
    lastName: { type: String, required: true, trim: true },
    address: {
        street_1: { type: String },
        street_2: { type: String },
        city: { type: String },
        state: { type: String },
        zipcode: { type: String },
    },
    phoneNumber: { type: Number },
    birthday: {
        day: {},
        month: {},
        year: {},
    },
    gender: { type: String },
    userType: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

const adminSchema = mongoose.Schema({
    user: {
        id: { type: Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, default: '' }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date }
});

const accountSchema = mongoose.Schema({
    user: {
        id: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    sessions: [{
        session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session' },
        isComplete: { type: Boolean },
    }],
    isVerified: { type: String, default: false },
    userCreated: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        time: { type: Date, default: Date.now }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

sessionSchema.virtual('accountSessions', {
    ref: 'Account',
    localField: 'sessions.id',
    foreignField: '_id',
    justOne: false,
})

const sessionFormSchema = mongoose.Schema({
    userCreated: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String },
        time: { type: Date, default: Date.now }
    },

    // SessionForm is created on behalf of this member
    memberAccount: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    session: { type: mongoose.Schema.Types.ObjectId, ref: 'User.sessions' },
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
});

const locationSchema = mongoose.Schema({
    name: { type: String },
    isAvailabe: { type: String },
    address: {
        city: { type: String },
        state: { type: String },
        country: { type: String },
        street1: { type: String },
        street2: { type: String },
        zipCode: { type: String },
    }
});

const Profile = mongoose.model('Profile', profileSchema);
const User = mongoose.model('User', userSchema);
const Account = mongoose.model("Account", accountSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Session = mongoose.model("Session", sessionSchema);
const SessionForm = mongoose.model("SessionForm", sessionFormSchema);
const Location = mongoose.model("Location", locationSchema);

module.exports = { Account, Admin, Location, Session, SessionForm, User, Profile };
