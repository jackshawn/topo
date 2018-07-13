<template>
  <el-breadcrumb separator="/" class="breadcrumb-wrap">
    <el-breadcrumb-item :to="{ path: '/Project' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: '/Project' }">项目管理</el-breadcrumb-item>
    <el-breadcrumb-item v-if="categary == 'config'">配置</el-breadcrumb-item>
    <el-breadcrumb-item :to="{ path: path }" v-if="categary == 'result' || categary == 'topo'">结果</el-breadcrumb-item>
    <el-breadcrumb-item v-if="categary == 'topo'">拓扑图</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import Icon from './Icon.vue';
  export default {
    name: 'breadcrumb',
    props: {
      categary: String,
      id: String,
    },
    components: {
      Icon
    },
    data() {
      return {
      }
    },
    computed: {
      path() {
        return '/Result/' + this.id;
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
