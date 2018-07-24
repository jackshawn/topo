let result = require('../models/result');
const Op = require('sequelize').Op;
const fs= require('fs');
const path = require('path');
const send = require('koa-send');
let uploadFile = require('../utils/upload');
const checkUserState = require('../utils/check');
const arrConcat = require('../utils/arrConcat');

// 获取项目的扫描与攻击结果
let getResult = async (ctx, next) => {
  let id = ctx.params.projectID;
  let res = await result.findAll({
    attributes: ['id', 'projectId', 'date', 'type', 'remark'],
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

  // 处理多个id
  let arr = [];
  let id = ctx.params.ID.split(',');


  let res = await result.findAll({
    where: {
      id: {
        [Op.or]: id
      }
    }
  });
  arr = JSON.parse(res[0].content.toString())
  for(let i = 1; i < res.length; i++) {
    // 获取topo数组
    let topo = JSON.parse(res[i].content)
    arrConcat(arr, topo)
  }
  console.log('get result by id')

  ctx.response.body = {
    result: 'success',
    data: arr
  };
};

module.exports = {
  'GET /results/:projectID': getResult,
  'GET /result/:ID': getTopo,
};
