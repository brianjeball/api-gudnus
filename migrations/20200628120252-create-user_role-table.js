'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserRole', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
            // This is a reference to another model
            model: 'User',
      
            // This is the column name of the referenced model
            key: 'id',
          }
      },
      roleId: {
        type: Sequelize.INTEGER,
        unique: true,
        references: {
          // This is a reference to another model
          model: 'Role',
    
          // This is the column name of the referenced model
          key: 'id',
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserRole');
  }
};