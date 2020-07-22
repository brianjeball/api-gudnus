'use strict';
const { Sequelize, Dataypes } = require('sequelize');
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {};

// naming the table in DB
const tableName = 'sessionFormDetails';

// the actual model
const SessionFormDetails = sequelize.define('SessionFormDetails', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    intervention: {
        type: Sequelize.TEXT,
    },
    response: {
        type: Sequelize.TEXT,
    },
    plan: {
        type: Sequelize.TEXT,
    },
}, { hooks, tableName });

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
SessionFormDetails.prototype.toJSON = function () {
};

// IMPORTANT
// don't forget to export the Model
module.exports = SessionForm;
