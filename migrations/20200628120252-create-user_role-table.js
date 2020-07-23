'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserRole', {
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
          model: 'User',
          key: 'id'
        }
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          // This is a reference to another model
          model: 'Role',
          // This is the column name of the referenced model
          key: 'id',
        }
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
    await queryInterface.dropTable('UserRole');
  }
};