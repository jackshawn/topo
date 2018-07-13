let config = require('../models/config');
const Op = require('sequelize').Op;
const fs= require('fs');
const path = require('path');
const send = require('koa-send');
let uploadFile = require('../utils/upload');
const checkUserState = require('../utils/check');

// 获取配置
let getConfig = async (ctx, next) => {
  let id = ctx.params.projectID;
  let res = await config.findAll({
    where: {
      projectId: id
    },
    order: [['id', 'ASC']]
  });
  console.log('get configs')

  ctx.response.body = JSON.stringify({
    result: 'success',
    configs: res
  });
};

// 添加配置
let postConfig = async (ctx, next) => {
  if(checkUserState(ctx)) {
    let req = ctx.request.body;
    // 修改
    if(req.id){
      let res = await config.update({
        ipStart: req.ipStart,
        ipEnd: req.ipEnd,
        port: req.port,
        thread: req.thread,
        delay: req.delay,
        way: req.way,
      }, {
        where: {
          id: req.id
        }
      });
      console.log(`update a config: ${JSON.stringify(req)}`)
      ctx.response.body = JSON.stringify({
        result: 'success',
        msg: ''
      });
    } else {
      // 添加
      let res = await config.create(req);
      console.log(`add a config: ${JSON.stringify(req)}`)
      ctx.response.body = JSON.stringify({
        result: 'success',
        msg: ''
      });
    }
  }
};

// 删除配置
let deleteConfig = async (ctx, next) => {
  if(checkUserState(ctx)) {
    let id = ctx.params.id;
    let res = await config.destroy({
      where: {
        id: id
      }
    });
    console.log(`config: ${id} deleted`)
    ctx.response.body = JSON.stringify({
      result: 'success',
      msg: ''
    });
  }
};

// 生成扫描脚本
let createScanJson = async (ctx, next) => {
  let fileName = 'config.json';
  let id = ctx.params.projectID;
  let url = path.join(path.resolve(__dirname, '../view'), fileName);
  let res = await config.findAll({
    where: {
      projectId: id
    },
    order: [['id', 'ASC']]
  });
  let arr = [];
  res.forEach(i => {
    arr.push({
      ipStart: i.ipStart,
      ipEnd: i.ipEnd,
      port: i.port,
      thread: i.thread,
      delay: i.delay,
      way: i.way
    })
  })
  fs.writeFile(url, JSON.stringify(arr), function (err) {
    if (err) throw err;
    console.log('write json success');
  });
  ctx.response.body = JSON.stringify({
    result: 'success',
    msg: ''
  });
};

// 下载扫描脚本
let downloadScanJson = async (ctx, next) => {
  let fileName = 'config.json';
  ctx.attachment(fileName);
  await send(ctx, fileName, { root: path.resolve(__dirname, '../view')});
};

module.exports = {
  'GET /config/:projectID': getConfig,
  'POST /config': postConfig,
  'DELETE /config/:id': deleteConfig,
  'GET /createScanJson/:projectID': createScanJson,
  'GET /downloadScanJson': downloadScanJson,
};
