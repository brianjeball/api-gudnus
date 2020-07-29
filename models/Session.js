'use strict';
const { Sequelize, Dataypes } = require('sequelize');
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {};

// naming the table in DB
const tableName = 'session';

// the actual model
const Session = sequelize.define('Session', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING(300),
    },
    dateCreated: {
        type: Sequelize.DATE
    },
    meetingDate: {
        type: Sequelize.DATE
    },
    sessionDetails: {
        // Foriegn Key to Session Details
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            // This is a reference to another model
            model: 'Session',
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

Session.associate = function (models) {
    Session.belongsTo(models.Meeting, {foreignKey: "id"})
    Session.hasMany(models.SessionDetails , {foreignKey: "id", as: "sessionDeails"})
}

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
Session.prototype.toJSON = function () {
};

// IMPORTANT
// don't forget to export the Model
module.exports = Session;
