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
  userId: {
    allowNull: false,
    autoIncrement: true,
    type: Sequelize.INTEGER,
    primaryKey: true,
    // references: {
    //     // This is a reference to another model
    //     model: 'User',
  
    //     // This is the column name of the referenced model
    //     key: 'id',
    //   }
  },
  roleId: {
    type: Sequelize.INTEGER,
    unique: true,
    // references: {
    //   // This is a reference to another model
    //   model: 'Role',

    //   // This is the column name of the referenced model
    //   key: 'id',
    // }
  },
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
