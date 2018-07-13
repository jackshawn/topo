const Sequelize = require('sequelize');
const { db } = require('./config');
let sequelize = new Sequelize(db.database, db.username, db.password, {
    host: db.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

module.exports = sequelize;
