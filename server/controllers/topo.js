const fs= require('fs');
const path = require('path');
const send = require('koa-send');
let uploadFile = require('../utils/upload');
const checkUserState = require('../utils/check');
let results = require('../models/result');
const Busboy = require('busboy');

let result = '';

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
        result += data.toString()
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
        content: result,
        type: obj.type === 'scan' ? '扫描结果' : '攻击结果',
        remark: obj.remark,
      });
    }
    result = '';
  });
  req.pipe(busboy);
  ctx.body = {result: 'success'}
};

// 更新ip备注
let updateIPRemark = async (ctx, next) => {
  let user = checkUserState(ctx);
  if(user) {
    let req = ctx.request.body;
    let id = req.id.split(',')
    for(let i = 0; i < id.length; i++) {
      let res = await results.findAll({
        where: {
          id: id[i]
        }
      });
      let topo = JSON.parse(res[0].content);
      topo.forEach(j => {
        j.devices.forEach(device => {
          if(device.ip === req.ip) {
            device.remark = req.remark;
          }
        })
      })
      await results.update({
        content: JSON.stringify(topo).replace(/\s+/g, '')
      }, {
        where: {
          id: id[i]
        }
      });
    }
    ctx.response.body = {
      result: 'success',
      msg: ''
    }
  }
};

module.exports = {
  'POST /createAttackJson': createAttackJson,
  'GET /downloadAttackJson': downloadAttackJson,
  'POST /uploadConfigJson': uploadConfigJson,
  'POST /updateIPRemark': updateIPRemark
};
