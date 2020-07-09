const Sequelize = require("sequelize");

const sequelize = require('../config/database');

const tableName = 'profile';

const Profile = sequelize.define("Profile", {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  firstName: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING(255),
  },
  dateOfBirth: {
    type: Sequelize.DATE(),
  },
  // ENUM Available values
  gender: {
    type: Sequelize.STRING(50),
  },
  pronouns: {
    type: Sequelize.STRING(45),
  },
  isActive: {
    type: Sequelize.BOOLEAN,
  },
  profileName: {
    type: Sequelize.STRING(50)
  },
  track: {
    // Foriegn Key to Track Types
    type: Sequelize.INTEGER,
  },
  createdAt: {
    type: Sequelize.DATE,
  },
  updatedAt: {
    type: Sequelize.DATE,
  },
}, { tableName });

module.exports = { Profile };