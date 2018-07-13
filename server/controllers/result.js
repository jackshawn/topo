let result = require('../models/result');
const Op = require('sequelize').Op;
const fs= require('fs');
const path = require('path');
const send = require('koa-send');
let uploadFile = require('../utils/upload');
const checkUserState = require('../utils/check');

// 获取项目的扫描与攻击结果
let getResult = async (ctx, next) => {
  let id = ctx.params.projectID;
  let res = await result.findAll({
    where: {
      projectId: id
    },
    order: [['date', 'ASC']]
  });
  console.log('get results')

  ctx.response.body = JSON.stringify({
    result: 'success',
    data: res
  });
};

// 获取拓扑图
let getTopo = async (ctx, next) => {
  let id = ctx.params.ID;
  let res = await result.findAll({
    where: {
      id: id
    }
  });
  console.log('get result by id')

  ctx.response.body = JSON.stringify({
    result: 'success',
    data: res[0].content
  });
};

module.exports = {
  'GET /results/:projectID': getResult,
  'GET /result/:ID': getTopo,
};
