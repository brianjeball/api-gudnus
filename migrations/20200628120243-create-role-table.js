'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Role', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
          type: Sequelize.STRING,
          unique: true,
      },
      description: {
          type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
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
    await queryInterface.dropTable('Role');
  }
};
