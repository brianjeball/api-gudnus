const Sequelize = require("sequelize");

const sequelize = require('../config/database');

const tableName = 'address';

const Address = sequelize.define("Address", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    city: {
        type: Sequelize.STRING(255),
    },
    state: {
        type: Sequelize.STRING(100),
    },
    country: {
        type: Sequelize.STRING(255),
    },
    street1: {
        type: Sequelize.STRING(255),
    },
    street2: {
        type: Sequelize.STRING(255),
    },
    zipCode: {
        // custom ui for input... maximum 
        type: Sequelize.INTEGER(10)
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
}, { tableName });

module.exports = { Address };