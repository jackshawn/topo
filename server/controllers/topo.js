const fs= require('fs');
const path = require('path');
const send = require('koa-send');
let uploadFile = require('../utils/upload');
const checkUserState = require('../utils/check');
let results = require('../models/result');
const Busboy = require('busboy');

let result = undefined;

// 生成攻击脚本
let createAttackJson = async (ctx, next) => {
  let fileName = 'attack.json';
  let url = path.join(path.resolve(__dirname, '../view'), fileName);

  fs.writeFile(url, JSON.stringify(ctx.request.body), function (err) {
    if (err) throw err;
    console.log('write json success');
  });
  ctx.response.body = JSON.stringify({
    result: 'success',
    msg: ''
  });
};

// 下载攻击脚本
let downloadAttackJson = async (ctx, next) => {
  let fileName = 'attack.json';
  ctx.attachment(fileName);
  await send(ctx, fileName, { root: path.resolve(__dirname, '../view')});
};

// 上传扫描结果
let uploadConfigJson = async (ctx, next) => {
  let {req, res} = ctx;
  var busboy = new Busboy({ headers: req.headers });
  let obj = {}
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    file.on('data', function(data) {
      try {
        result = JSON.stringify(JSON.parse(data.toString().replace(/\s+/g, '')));
      } catch(e) {
        console.log(e)
      }
    });
  });
  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    obj[fieldname] = val;
  });
  busboy.on('finish', function() {
    if(result) {
      results.create({
        projectId: obj.projectId,
        content: result
      });
    }
  });
  req.pipe(busboy);
  ctx.body = {result: 'success'}
};

// 获取扫描结果
let getConfigData = async (ctx, next) => {
  if(result) {
    ctx.response.body = {
      result: 'success',
      topo: result
    }
    result = undefined;
  } else {
    ctx.response.body = {
      result: 'fail',
      msg: '上传文件格式有误'
    }
  }
};


module.exports = {
  'POST /createAttackJson': createAttackJson,
  'GET /downloadAttackJson': downloadAttackJson,
  'POST /uploadConfigJson': uploadConfigJson,
  'GET /getConfigData': getConfigData
};
