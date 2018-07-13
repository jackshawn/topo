const Sequelize = require('sequelize');
const db = require('../utils/db');

let user = db.define('user', {
    username: Sequelize.STRING,
    password: Sequelize.STRING
}, {
    timestamps: false
});

module.exports = user;
