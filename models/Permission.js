const Sequelize = require("sequelize");

const sequelize = require('../config/database');

const tableName = 'permission';

const Permission = sequelize.define("Permission", {
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

module.exports = { Permission }