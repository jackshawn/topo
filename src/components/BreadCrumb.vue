<template>
  <el-breadcrumb separator="/" class="breadcrumb-wrap">
    <el-breadcrumb-item :to="{ path: '/Project' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/Project' }">项目管理</el-breadcrumb-item>
    <el-breadcrumb-item v-if="categary == 'config'">{{project}} - 配置</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: path }" v-if="categary == 'result' || categary == 'topo'">{{project}} - 结果</el-breadcrumb-item>
    <el-breadcrumb-item v-if="categary == 'topo'">拓扑图</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import Icon from './Icon.vue';
  import axios from 'axios';

  export default {
    name: 'breadcrumb',
    props: {
      categary: String,
      id: String
    },
    components: {
      Icon
    },
    data() {
      return {
        project: ''
      }
    },
    computed: {
      path() {
        return '/Result/' + this.id;
      }
    },
    mounted() {
      if(this.id) {
        let _this = this;
        axios.get('/projectName/' + _this.id).then((res) => {
          if(res.data.result === 'success') {
            _this.project = res.data.name;
          } else {
            _this.$message(res.data.msg)
          }
        }).catch((error) => {
          console.log(error)
        });
      }
    }
  }
</script>

<style scoped lang="scss">

  .breadcrumb-wrap {
    max-width: 1024px;
    margin: 20px auto 10px;
  }
</style>
