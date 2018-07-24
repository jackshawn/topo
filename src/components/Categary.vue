<template>
  <div class="header-wrap">
    <div class="header">
      <div class="categary">
        <div class="tab">网络设备拓扑图展示系统</div>
<!--        <template v-if="categary == 'project'">
          <div class="tab active">
            <router-link to="/Project" class="categary-name"><Icon icon="project" class="categary-icon"></Icon> 项目管理</router-link>
          </div>
          <div class="tab">
            <router-link to="/Topo/upload" class="categary-name"><Icon icon="topo" class="categary-icon" style="transform: rotate(-90deg)"></Icon> 展现台</router-link>
          </div>
        </template>
        <template v-else-if="categary == 'config'">
          <div class="tab">
            <router-link to="/Project" class="categary-name"><Icon icon="project" class="categary-icon"></Icon> 项目管理</router-link>
          </div>
          <div class="tab">
            <router-link to="/Topo/upload" class="categary-name"><Icon icon="topo" class="categary-icon" style="transform: rotate(-90deg)"></Icon> 展现台</router-link>
          </div>
          <div class="tab active">
            <a onclick="location.reload()" class="categary-name"><Icon icon="config" class="categary-icon"></Icon> 配 置 </a>
          </div>
        </template>
        <template v-else>
          <div class="tab">
            <router-link to="/Project" class="categary-name"><Icon icon="project" class="categary-icon"></Icon> 项目管理</router-link>
          </div>
          <div class="tab active">
            <router-link to="/Topo/upload" class="categary-name"><Icon icon="topo" class="categary-icon" style="transform: rotate(-90deg)"></Icon> 展现台</router-link>
          </div>
        </template>-->
      </div>

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
    name: 'catagary',
    props: {
      categary: String
    },
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
        line-height: 24px;

        .tab {
          float: left;
          height: 56px;
          line-height: 60px;

          margin-right: 20px;

          border-bottom: 4px solid transparent;
          cursor: pointer;

          &.active {
            border-bottom: 4px solid #409eff;

            a {
              color: #409eff;

              svg {fill: #409eff!important;}
            }
          }

          .categary-name {
            font-size: 16px;
            text-decoration: none;
            color: #666;

            .categary-icon {
              width: 20px;
              vertical-align: sub;
              fill: #666;
            }
          }
        }


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
