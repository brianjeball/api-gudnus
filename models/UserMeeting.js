'use strict';
const { Sequelize, DataTypes } = require('sequelize');

// the DB connection
const sequelize = require('../../config/database');
const User = require('./User');

// hooks are functions that can run before or after a specific event
const hooks = {};

// naming the table in DB
const tableName = 'User_Meeting';

// the actual model
const UserMeeting = sequelize.define('UserMeeting', {
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
    organizer: {
        references: {
            model: 'User',
            key: 'id',
          }
    },
    attendee: {
        references: {
            model: 'User',
            key: 'id',
          }
    },
    description: {
        type: Sequelize.STRING,
    },
}, { hooks, tableName });

UserMeeting.associate = function(models) {
    // create Member and Coach
    UserMeeting.hasMany(models.Member, {as: 'memberID'})
    UserMeeting.hasMany(models.Coach, {as: 'coachID'})
  }

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
UserMeeting.prototype.toJSON = function () {
};

// IMPORTANT
// don't forget to export the Model
module.exports = UserMeeting;
