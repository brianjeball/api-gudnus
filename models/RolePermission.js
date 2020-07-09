const Sequelize = require("sequelize");

const sequelize = require('../../config/database');

const tableName = 'role_permission';

const RolePermission = sequelize.define("RolePermission", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING(100),
        allowNull: false,
    },
    description: {
        type: Sequelize.STRING(300),
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
}, { tableName });

module.exports = { RolePermission }