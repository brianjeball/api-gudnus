'use strict';
const { Sequelize, Dataypes } = require('sequelize');
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {};

// naming the table in DB
const tableName = 'session_form';

// the actual model
const SessionForm = sequelize.define('SessionForm', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    sessionId: {
        references: {
            // This is a reference to another model
            model: 'session',
            // This is the column name of the referenced model
            key: 'id',
        }
    },
    startTime: {
        type: Sequelize.DATE, // time
    },
    endTime: {
        type: Sequelize.DATE, // time
    },
    serviceProvided: {
        // options?
    },
    attendingMember: {
        // possible change name
        references: {
            // This is a reference to another model
            model: 'user',
            // This is the column name of the referenced model
            key: 'id',
        }
    },
    sessionDate: { // if this works?
        references: {
            // This is a reference to another model
            model: 'session',
            // This is the column name of the referenced model
            key: 'date',
        }
    },
    location: {
        references: {
            // This is a reference to another model
            model: 'sessionLocation',
            // This is the column name of the referenced model
            key: 'id',
        }
    },
    enviroment: {
        type: Sequelize.CHAR,
    },
    mood: {
        type: Sequelize.CHAR, // options?
    },
    eyeContact: {
        type: Sequelize.BOOLEAN,
    },
    cooperative: {
        type: Sequelize.BOOLEAN,
    },
    memberJudgemnet: {
        type: Sequelize.CHAR,
    },
    sessionFormDetailsId: {
        references: {
            // This is a reference to another model
            model: 'sessionFormDetails',
            // This is the column name of the referenced model
            key: 'id',
        }
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
        type: Sequelize.DATE,
    },
}, { hooks, tableName });

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
SessionForm.prototype.toJSON = function () {
};

// IMPORTANT
// don't forget to export the Model
module.exports = SessionForm;
