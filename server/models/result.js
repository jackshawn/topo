const Sequelize = require('sequelize');
const db = require('../utils/db');

let result = db.define('result', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    projectId: Sequelize.STRING,
    content: Sequelize.TEXT('medium'),
    remark: Sequelize.STRING,
    type: Sequelize.STRING,
    date: Sequelize.DATE,
}, {
    timestamps: false
});

module.exports = result;
