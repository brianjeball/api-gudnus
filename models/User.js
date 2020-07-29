'use strict';
const { Sequelize, DataTypes } = require('sequelize');

// for encrypting our passwords
const bcryptSevice = require('../services/bcrypt.service');

// the DB connection
const sequelize = require('../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {
  beforeCreate(user) {
    user.password = bcryptSevice().password(user);
  },
};

// naming the table in DB
const tableName = 'user';

// the actual model
const User = sequelize.define('User', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  username: {
    type: Sequelize.CHAR,
    unique: true,
  },
  password: {
    type: Sequelize.CHAR,
    allowNull: false,
  },
  // role: {
  //   type: Sequelize.ENUM,
  //   default: 'basic',
  //   enum: ['basic', 'super', 'admin']
  // },
  accessToken: {
    type: Sequelize.STRING(),
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

User.associate = function (models) {
  User.belongsTo(models.UserRole, { foreignKey: 'id' })
  User.belongsTo(models.Track, { foreignKey: 'id' })
  User.belongsTo(models.Profile, { foreignKey: "id" })
}

// instead of using instanceMethod
// in sequelize > 4 we are writing the function
// to the prototype object of our model.
// as we do not want to share sensitive data, the password
// field gets ommited before sending
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};

// IMPORTANT
// don't forget to export the Model
module.exports = User;
