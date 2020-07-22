'use strict';
const { Sequelize, Dataypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

// hooks are functions that can run before or after a specific event
const hooks = {};

// naming the table in DB
const tableName = 'UserRole';

// the actual model
const UserRole = sequelize.define('UserRole', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  roleId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      // This is a reference to another model
      model: 'Roles',
      // This is the column name of the referenced model
      key: 'id',
    }
  },
  dateAssigned: {
    type: Sequelize.DATE,
  },
  createdAt: {
    // allowNull: false,
    // default: Sequelize.NOW,
    type: Sequelize.DATE
  },
  updatedAt: {
    // allowNull: false,
    // default: Sequelize.NOW,
    type: Sequelize.DATE
  }
}, { hooks, tableName });

UserRole.belongsTo(User);

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
UserRole.prototype.toJSON = function () {
};

// IMPORTANT
// don't forget to export the Model
module.exports = UserRole;
