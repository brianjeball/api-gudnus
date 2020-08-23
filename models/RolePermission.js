const Sequelize = require("sequelize");

const sequelize = require('../config/database');
const Role = require("./Role");
const Permission = require("./Permission");

const tableName = 'role_permission';

const RolePermission = sequelize.define("RolePermission", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    roleId: {
        references: {
            // This is a reference to another model
            model: 'Role',
            // This is the column name of the referenced model
            key: 'id',
          }
    },
    permissionId: {
        references: {
            // This is a reference to another model
            model: 'Permission',
            // This is the column name of the referenced model
            key: 'id',
          }
    },
    dateAssigned: {
      type: Sequelize.DATE,
    },
    createdAt: {
        type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
}, { tableName });

module.exports = { RolePermission }