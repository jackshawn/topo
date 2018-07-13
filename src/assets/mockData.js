import Mock from 'mockjs'
import { Random } from 'mockjs'


Mock.setup({
  timeout: '200-600'
})

let defaultRes = {
  result: 'success',
  msg: Random.cword(5, 7)
}

let projects = {
  result: 'success',
  projects: new Array(6).fill(() => {
    return {
      id: 1,
      name: Random.cword(5, 7),
      remark: Random.cword(15, 27),
      date: Random.date('yy-MM-dd')
    }
  })
};

let configs = {
  result: 'success',
  configs: new Array(6).fill(() => {
    return {

      id: 1,
      ipStart: Random.ip(),
      ipEnd: Random.ip(),
      port: '80',
      thread: '80',
      delay: '100',
      way: '1'
    }
  })
};

let results = {
  result: 'success',
  data: new Array(6).fill(() => {
    return {
      id: 1,
      date: new Date().getTime()
    }
  })
};

let result = {
  result: 'success',
  data: [          {
    ip: '192.123.123.1',
    devices: [
      {
        ip: '123.123.123.123',
        port: ['1234', '234'],
        type: 'pc',
        os: 'winOld',
        version: '2003',
        attacked: true
      },
      {
        ip: '234.123.123.123',
        port: ['1234', '234'],
        type: 'pc',
        os: 'winOld',
        version: '2003',
        attacked: false
      },
      {
        ip: '234.123.123.123',
        port: ['1234', '234'],
        type: 'pc',
        os: 'winOld',
        version: '2003',
        attacked: false
      },
      {
        ip: '234.123.123.123',
        port: ['1234', '234', '234', '234', '234'],
        type: 'pc',
        os: 'winOld',
        version: '2003',
        attacked: false
      },
    ]
  },
    {
      ip: '192.123.234.1',
      devices: [
        {
          ip: '123.123.123.123',
          port: ['1234', '234'],
          type: 'pc',
          os: 'winOld',
          version: '2003',
          attacked: true
        },
        {
          ip: '123.123.123.123',
          port: ['1234', '234'],
          type: 'pc',
          os: 'winOld',
          version: '2003',
          attacked: true
        },
        {
          ip: '123.123.123.123',
          port: ['1234', '234'],
          type: 'pc',
          os: 'winOld',
          version: '2003',
          attacked: true
        },
        {
          ip: '123.123.123.123',
          port: ['1234', '234'],
          type: 'pc',
          os: 'winOld',
          version: '2003',
          attacked: true
        },
        {
          ip: '234.123.123.123',
          port: ['1234', '234'],
          type: 'server',
          os: 'winOld',
          version: '2003',
          attacked: false
        },
        {
          ip: '234.123.123.123',
          port: ['1234', '234'],
          type: 'pc',
          os: 'winOld',
          version: '2003',
          attacked: false
        },
        {
          ip: '234.123.123.123',
          port: ['1234', '234'],
          type: 'server',
          os: 'linux',
          version: '',
          attacked: false
        },
        {
          ip: '234.123.123.123',
          port: ['1234', '234'],
          type: 'pc',
          os: 'winNew',
          version: '10',
          attacked: false
        },
        {
          ip: '234.123.123.123',
          port: ['1234', '234'],
          type: 'pc',
          os: 'winOld',
          version: '2003',
          attacked: false
        },
      ]
    },]
};


// check
Mock.mock('/check', 'get', Object.assign(defaultRes, {user: 'Admin'}))

// login
Mock.mock('/login', defaultRes)

// regist
Mock.mock('/regist', defaultRes)

// get projects
Mock.mock('/project', projects)

// get projects
Mock.mock(/^\/config/, configs)

// get results by projectID
Mock.mock('/results/1', results)

// get result by id
Mock.mock('/result/1', result)



