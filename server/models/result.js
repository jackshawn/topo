const Sequelize = require('sequelize');
const db = require('../utils/db');

let result = db.define('result', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    projectId: Sequelize.STRING,
    content: Sequelize.TEXT,
    date: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = result;
