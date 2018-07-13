let user = require('../models/user');
const Op = require('sequelize').Op;

// 登录
let login = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  let result;
  let res = await user.findAll({
    where: {
      username: username
    }
  });
  if(res.length === 0){
    result = {
      result: 'fail',
      msg: `user ${username} not exist`
    };
  } else if(res[0].password === password) {
    result = {
      result: 'success',
      msg: ''
    };
    ctx.session.user = {
      username,
      password
    }
  } else {
    result = {
      result: 'fail',
      msg: 'password error'
    }
  }
  console.log(`user ${username} login ${result.result}`)
  ctx.response.body = JSON.stringify(result);
};

// 退出
let logout = async (ctx, next) => {
  console.log('logout')
  ctx.session = null;
  ctx.response.body = JSON.stringify({
    result: 'success',
    msg: ''
  });
};

// 检测登录状态
let check = async (ctx, next) => {
  console.log('check state')
  console.log(ctx.session.user)
  ctx.response.body = JSON.stringify({
    result: ctx.session.user ? 'success' : 'fail',
    user: ctx.session.user ? ctx.session.user.username : '',
    msg: ''
  });
};

// 注册
let regist = async (ctx, next) => {
  const {username} = ctx.request.body;
  let existUser = await user.findAll({
    where: {
      username: username
    }
  });
  // 已存在用户名
  if(existUser.length > 0){
    ctx.response.body = JSON.stringify({
      result: 'fail',
      msg: `user ${username} exist`
    });
  } else {
    let req = ctx.request.body;
    let res = await user.create(req);
    console.log(`regist user: ${JSON.stringify(req)}`)
    ctx.response.body = JSON.stringify({
      result: 'success',
      msg: ''
    });
  }
};

module.exports = {
  'POST /regist': regist,
  'POST /login': login,
  'GET /logout': logout,
  'GET /check': check
};
