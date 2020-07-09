const Sequelize = require("sequelize");

const sequelize = require('../config/database');



const tableName = "track";

const Track = sequelize.define("Track", {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
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

}, { tableName });

module.exports = { Track }