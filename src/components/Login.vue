<template>
  <div id="login">

    <p><Icon icon="user" class="login-user"></Icon></p>
    <el-input
      placeholder="请输入用户名"
      prefix-icon="el-icon-edit"
      v-model="username"
    >
    </el-input>
    <br>
    <br>
    <el-input
      placeholder="请输入密码"
      prefix-icon="el-icon-tickets"
      type="password"
      v-model="password"
      @keyup.enter="login"
    >
    </el-input>
    <br>
    <br>
    <el-button @click="login" type="primary" style="width: 100%;" size="medium">登录</el-button>

    <div class="login-btn">
      <el-button @click="regist.show = true" type="text" size="medium">注册</el-button>

    </div>
    <el-dialog
      title="注册用户"
      :visible.sync="regist.show"
      width="30%">
      <el-input
        placeholder="请输入用户名"
        prefix-icon="el-icon-edit"
        v-model="regist.username"
      >
      </el-input>
      <br>
      <br>
      <el-input
        placeholder="请输入密码"
        prefix-icon="el-icon-tickets"
        v-model="regist.password"
      >
      </el-input>
      <br>
      <br>
      <el-input
        placeholder="请再次输入密码"
        prefix-icon="el-icon-tickets"
        v-model="regist.passwordAgain"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="regist.show = false">取 消</el-button>
        <el-button type="primary" @click="registUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import axios from 'axios';
  import Icon from './Icon.vue';
  export default {
    name: 'Login',
    components: {Icon},
    data() {
      return {
        username: '',
        password: '',

        regist: {
          show: false,
          username: '',
          password: '',
          passwordAgain: '',
        }
      }
    },
    mounted() {
      this.check();
    },
    methods: {
      check() {
        let _this = this;
        axios.get('/check')
          .then((res) => {
            if(res.data.result === 'success') {
              _this.$router.push('/Project')
            }
          }).catch((error) => {
          console.log(error)
        });
      },
      login() {
        let _this = this;
        if(this.username && this.password) {
          axios.post('/login', {
            username: _this.username,
            password: _this.password
          })
            .then((res) => {
              if(res.data.result === 'success') {
                _this.$router.push('/Project')
              } else {
                _this.$message(res.data.msg)
              }
            }).catch((error) => {
            console.log(error)
          });
        } else {
          this.$message('内容不可为空');
        }

      },
      registUser() {
        let _this = this;
        if(this.regist.username && this.regist.password && this.regist.passwordAgain) {
            if(this.regist.password === this.regist.passwordAgain){
              axios.post('/regist', {
                username: _this.regist.username,
                password: _this.regist.password
              })
                .then((res) => {
                  if(res.data.result === 'success') {
                    _this.regist.show = false;
                    _this.$message('注册成功');
                  } else {
                    _this.$message(res.data.msg)
                  }
                }).catch((error) => {
                console.log(error)
              });
            } else {
              this.$message('两次输入密码不一致');
            }
        } else {
          this.$message('内容不可为空');
        }
      }
    }
  }
</script>

<style scoped>
  #login {
    width: 300px;
    height: 320px;

    position: absolute;
    top: 45%;
    left: 50%;

    margin-top: -160px;
    margin-left: -150px;
  }
  #login>p {text-align: center}

  .login-user {
    width: 80px;
    fill: #409eff;
  }

  .login-btn {
    margin-top: 10px;
    text-align: right;
  }
</style>
