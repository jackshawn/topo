/**
 * 操作数据时检测用户登录状态
 * @param  {object} ctx     koa上下文
 * @return {boolean}        用户登录状态
 */

let checkUserState = function(ctx) {
  if(ctx.session.user){
    return ctx.session.user.username;
  } else {
    ctx.response.body = JSON.stringify({
      result: 'fail',
      msg: 'login first'
    });
  }
}

module.exports =  checkUserState
