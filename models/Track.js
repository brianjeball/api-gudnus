'use strict';
const Sequelize = require('sequelize').Sequelize;

// the DB connection
const sequelize = require('../../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {};

// naming the table in DB
const tableName = 'track';

// the actual model
const Track = sequelize.define('Track', {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'User',
      key: 'id'
    }
  },
  type: {
    type: Sequelize.STRING(300),
  },
  isComplete: {
    type: Sequelize.BOOLEAN,
  },
  hoursToComplete: {
    type: Sequelize.INTEGER,
  },
  approved: {
    type: Sequelize.STRING,
  },
  approvedDate: {
    type: Sequelize.DATE,
  },
  requestApproval: {
    type: Sequelize.STRING,
  },
  requestApprovalDate: {
    type: Sequelize.DATE,
  },
  createdAt: {
    type: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE,
  },
}, { hooks, tableName });

Track.associate = function (models) {
  // create Member and Coach
  Track.hasMany(models.User, { as: 'userId' })
}

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
Track.prototype.toJSON = function () {
};

// IMPORTANT
// don't forget to export the Model
module.exports = Track;
