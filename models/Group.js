'use strict';
const { Sequelize, Dataypes } = require('sequelize');
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {};

// naming the table in DB
const tableName = 'Group';

// the actual model
const Group = sequelize.define('Group', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    isActive: {
        type: Sequelize.BOOLEAN,
    },
    members: {
        type: Sequelize.INTEGER,
    },
    coaches: {
        type: Sequelize.INTEGER,
    },
    groupName: {
        type: Sequelize.STRING(255),
    },
    description: {
        type: Sequelize.STRING(255),
    },
    managedBy: {
        allowNull: false,
        references: {
            // This is a reference to another model
            model: 'User',
      
            // This is the column name of the referenced model
            key: 'id',
          },
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
Group.prototype.toJSON = function () {
};

// IMPORTANT
// don't forget to export the Model
module.exports = Group;
