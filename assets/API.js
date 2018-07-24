// 前后台交互接口

const API = [

  //--------------------登录--------------------------
  // 登录
  {
    url: '/login',
    type: 'POST',
    req: {
      username: '',
      password: ''
    },
    res: {
      result: 'success',
      msg: ''
    }
  },

  // 退出
  {
    url: '/logout',
    type: 'GET',
    res: {
      result: 'success',
      msg: ''
    }
  },

  // 状态检测
  {
    url: '/check',
    type: 'GET',
    res: {
      result: 'success',
      user: '',
      msg: ''
    }
  },

  // 注册
  {
    url: '/regist',
    type: 'POST',
    req: {
      username: '',
      password: ''
    },
    res: {
      result: 'success',
      msg: ''
    }
  },


  //--------------------项目--------------------------
  // 获取
  {
    url: '/project',
    type: 'GET',
    res: {
      result: 'success',
      projects: [
        {
          id: '',
          name: '',
          remark: '',
          user: '',
          date: ''
        },
      ]
    }
  },

  // 添加
  {
    url: '/project',
    type: 'POST',
    req: {
      name: '',
      remark: '',
      user: '',
      date: ''
    },
    res: {
      result: 'success',
      msg: ''
    }
  },

  // 修改
  {
    url: '/project',
    type: 'POST',
    req: {
      id: '',
      name: '',
      remark: '',
      user: '',
      date: ''
    },
    res: {
      result: 'success',
      msg: ''
    }
  },

  // 删除
  {
    url: '/project/ID',
    type: 'DELETE',
    res: {
      result: 'success',
      msg: ''
    }
  },

  // 获取项目名称
  {
    url: '/projectName',
    type: 'GET',
    req: 'id',
    res: {
      result: 'success',
      name: ''
    }
  },

  //--------------------配置--------------------------
  // 获取
  {
    url: '/config',
    type: 'GET',
    req: 'projectID',
    res: {
      result: 'success',
      configs: [
        {
          id: '',
          ipStart: '',
          ipEnd: '',
          port: '',
          thread: '',
          delay: '',
          way: ''
        },
      ]
    }
  },

  // 添加
  {
    url: '/config',
    type: 'POST',
    req: {
      projectId: '',
      ipStart: '',
      ipEnd: '',
      port: '',
      thread: '',
      delay: '',
      way: ''
    },
    res: {
      result: 'success',
      msg: ''
    }
  },

  // 修改
  {
    url: '/config',
    type: 'POST',
    req: {
      id: '',
      ipStart: '',
      ipEnd: '',
      port: '',
      thread: '',
      delay: '',
      way: ''
    },
    res: {
      result: 'success',
      msg: ''
    }
  },

  // 删除
  {
    url: '/config/ID',
    type: 'DELETE',
    res: {
      result: 'success',
      msg: ''
    }
  },

  // 生成脚本
  {
    url: '/createScanJson',
    type: 'GET',
    req: 'projectID',
    res: {
      result: 'success',
      msg: ''
    }
  },


  //--------------------扫描与攻击结果-------------------
  // 根据ID获取扫描与攻击结果
  {
    url: '/result/ID',
    type: 'GET',
    res: {
      result: 'success',
      data: []
    }
  },

  // 上传扫描与攻击结果
  {
    url: '/uploadConfigJson',
    type: 'POST',
    res: {
      result: 'success',
      msg: ''
    }
  },

  //--------------------拓扑图--------------------------
  // 生成攻击脚本
  {
    url: '/createAttackJson',
    type: 'POST',
    req: {},
    res: {
      result: 'success',
      msg: ''
    }
  },

  // 下载攻击脚本
  {
    url: '/downloadAttackJson',
    type: 'GET'
  },

  // ip添加备注信息
  {
    url: '/updateIPRemark',
    type: 'POST',
    req: {
      id: [],
      ip: '',
      remark: ''
    },
    res: {
      result: 'success',
      msg: ''
    }
  },
]

