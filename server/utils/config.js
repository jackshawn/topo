const config = {
  // 数据库连接配置
  db: {
    database: 'topo',
    username: 'root',
    password: '123',
    host: 'localhost',
    port: 3306
  },
  // session 配置
  sessionConfig: {
    key: 'session-id',
    cookie: {
      domain: 'localhost',
      path: '/',
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      overwrite: false
    }
  }
}

module.exports = config;
