'use strict';
const { Sequelize, DataTypes } = require('sequelize');

// the DB connection
const sequelize = require('../../config/database');

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
    description: {
        type: Sequelize.STRING,
    },
    isCanceled: {
        type: Sequelize.BOOLEAN
    },
    isRescheduled: {
        type: Sequelize.BOOLEAN
    },
    dateRescheduled: {
        type: Sequelize.DATE
    },
    sesssionId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            // This is a reference to another model
            model: 'Session',
            // This is the column name of the referenced model
            key: 'id',
        }
    }
}, { hooks, tableName });

Meeting.associate = function (models) {
    Meeting.hasMany(models.Session, { foreignKey: "session", as: 'sessionId' })
}

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
