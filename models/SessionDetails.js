const Sequelize = require("sequelize");

const sequelize = require('../config/database');
const Session = require("./Session");

// hooks are functions that can run before or after a specific event
const hooks = {
  
};

const tableName = "session_details";

const SessionDetails = sequelize.define("Session_Details", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    notes: {
        type: Sequelize.STRING(300),
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
}, { hooks, tableName });

SessionDetails.belongsTo(Session);

module.exports = { SessionDetails }