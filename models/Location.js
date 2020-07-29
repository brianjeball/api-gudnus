'use strict';
const { Sequelize, DataTypes } = require('sequelize');

// the DB connection
const sequelize = require('../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {};

// naming the table in DB
const tableName = 'location';

// the actual model
const Location = sequelize.define('Location', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
      type: Sequelize.CHAR(),
  },
  isAvailable: {
    type: Sequelize.BOOLEAN,
  },
  createdAt: {
    // allowNull: true,
    type: Sequelize.DATE,
  },
  updatedAt: {
    // allowNull: true,
    type: Sequelize.DATE,
  }
}, { hooks, tableName });

Location.associate = function(models) {
  Location.hasOne(models.Address, {foreignKey: "id", as: 'addressId'})
}

Location.prototype.toJSON = function () {
};

// IMPORTANT
// don't forget to export the Model
module.exports = Location;
