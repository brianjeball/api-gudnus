'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
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
      createdAt: {
        // allowNull: false,
        default: Sequelize.NOW,
        type: Sequelize.DATE
      },
      updatedAt: {
        // allowNull: false,
        default: Sequelize.NOW,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};