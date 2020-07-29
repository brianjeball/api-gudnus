const Sequelize = require("sequelize");

const sequelize = require('../config/database');

// hooks are functions that can run before or after a specific event
const hooks = {};

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
    references: {
      // This is a reference to another model
      model: 'User',
      // This is the column name of the referenced model
      key: 'id',
    }
  },
  firstName: {
    type: Sequelize.STRING(255),
    allowNull: false
  },
  lastName: {
    type: Sequelize.STRING(255),
  },
  dayOfBirth: {
    type: Sequelize.INTEGER(),
  },
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
}, { hooks, tableName });

Profile.associate = function (models) {
  Profile.hasMany(models.User, { foreignKey: "user", as: 'userId' })
}

Meeting.prototype.toJSON = function () {
};

module.exports = Profile;