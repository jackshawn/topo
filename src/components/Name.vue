<template>
  <div class="header-wrap">
    <div class="header">
      <div class="categary">网络设备拓扑图展示系统</div>

      <div class="user">
        <Icon icon="user" class="user-icon"></Icon> <span class="username">{{user}}; </span> <span @click="logout" class="logout"> 退出</span>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios';
  import Icon from './Icon.vue';
  export default {
    name: 'name',
    components: {
      Icon
    },
    data() {
      return {
        user: ''
      }
    },
    methods: {
      logout() {
        let _this = this;
        axios.get('/logout')
          .then((res) => {
            if(res.data.result === 'success') {
              _this.$router.push('/Login')
            } else {
              _this.$message(res.data.msg)
            }
          }).catch((error) => {
          console.log(error)
        });
      }
    },
    mounted() {
      let _this = this;
      axios.get('/check')
        .then((res) => {
          if(res.data.result === 'success') {
            _this.user = res.data.user;
          } else {
            _this.$router.push('/Login')
          }
        }).catch((error) => {
        console.log(error)
      });
    }
  }
</script>

<style scoped lang="scss">
  .header-wrap {
    background: #fff;
    height: 60px;
    box-shadow: 0 0 10px #ccc;

    .header {
      max-width: 1024px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      font-weight: bold;

      .categary {
        font-size: 16px;
        line-height: 60px;
        height: 60px;
      }

      .user {
        line-height: 60px;

        .user-icon {
          width: 22px;
          fill: #666;
          vertical-align: sub;
        }
        .logout {
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }


</style>
