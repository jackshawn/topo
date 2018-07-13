const Sequelize = require('sequelize');
const db = require('../utils/db');

let config = db.define('config', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    projectId: Sequelize.STRING,
    ipStart: Sequelize.STRING,
    ipEnd: Sequelize.STRING,
    port: Sequelize.STRING,
    thread: Sequelize.STRING,
    delay: Sequelize.STRING,
    way: Sequelize.STRING
}, {
    timestamps: false
});

module.exports = config;
