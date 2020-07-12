'use strict';
const { Sequelize, DataTypes } = require('sequelize');

// the DB connection
const sequelize = require('../../config/database');
const User = require('./User');

// hooks are functions that can run before or after a specific event
const hooks = {};

// naming the table in DB
const tableName = 'Meeting';

// the actual model
const Meeting = sequelize.define('Meeting', {
    id: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    date: {
        type: Sequelize.STRING(100),
        unique: true,
    },
    coach: {
        type: Sequelize.INTEGER,
    },
    members: {
        reference: User,
    },
    description: {
        type: Sequelize.STRING,
    },
}, { hooks, tableName });

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
Meeting.prototype.toJSON = function () {
};

// IMPORTANT
// don't forget to export the Model
module.exports = Meeting;