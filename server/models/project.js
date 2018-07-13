const Sequelize = require('sequelize');
const db = require('../utils/db');

let project = db.define('project', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  date: Sequelize.DATE,
  name: Sequelize.STRING,
  user: Sequelize.STRING,
  remark: Sequelize.STRING
}, {
  timestamps: false
});

module.exports = project;
