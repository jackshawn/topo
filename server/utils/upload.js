const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');

/**
 * 上传文件
 * @param  {object} ctx     koa上下文
 * @param  {object} options 文件上传参数 fileType文件类型， path文件存放路径
 * @return {promise}
 */

const uploadFile = (ctx, options) => {
  let {req, res} = ctx;
  let id = undefined;
  let busboy = new Busboy({headers: req.headers});

  return new Promise((resolve, reject) => {
    console.log('uploading...');


    // 解析表单中其他字段信息
    busboy.on('field', (fieldname, val) => {
      let obj = {}
      obj[fieldname] = val;
      id = obj.projectId;
    });

    // 解析结束事件
    busboy.on('finish', () => {
      resolve(id)
    })

    req.pipe(busboy)
  })

}

module.exports = uploadFile
