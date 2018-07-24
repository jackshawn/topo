let project = require('../models/project');
const Op = require('sequelize').Op;
const checkUserState = require('../utils/check');

// 获取项目
let getProject = async (ctx, next) => {
  let res = await project.findAll({
    where: {
      user: ctx.session.user.username
    },
    order: [['id', 'ASC']]
  });
  console.log('get projects')

  ctx.response.body = JSON.stringify({
    result: 'success',
    projects: res
  });

};

// 操作项目
let postProject = async (ctx, next) => {
  let user = checkUserState(ctx);
  if(user) {
    let req = ctx.request.body;
    // 修改
    if(req.id){
      let res = await project.update({
        name: req.name,
        remark: req.remark
      }, {
        where: {
          id: req.id
        }
      });
      console.log(`update a project: ${JSON.stringify(req)}`)
      ctx.response.body = JSON.stringify({
        result: 'success',
        msg: ''
      });
    } else {
      // 新建
      let res = await project.create(Object.assign(req, {
        user: user
      }));
      console.log(`add a project: ${JSON.stringify(req)}`)
      ctx.response.body = JSON.stringify({
        result: 'success',
        msg: ''
      });
    }

  }

};

// 删除项目
let deleteProject = async (ctx, next) => {
  if(checkUserState(ctx)) {
    let id = ctx.params.id;
    let res = await project.destroy({
      where: {
        id: id
      }
    });
    console.log(`project: ${id} deleted`)
    ctx.response.body = JSON.stringify({
      result: 'success',
      msg: ''
    });
  }
};

// 获取项目名称
let getProjectName = async (ctx, next) => {
  let id = ctx.params.id;
  let res = await project.findAll({
    where: {
      id: id
    }
  });
  console.log('get project name')

  ctx.response.body = JSON.stringify({
    result: 'success',
    name: res.length > 0 ? res[0].name : ''
  });

};

module.exports = {
  'GET /project': getProject,
  'GET /projectName/:id': getProjectName,
  'POST /project': postProject,
  'DELETE /project/:id': deleteProject
};
