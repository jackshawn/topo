<template>
  <div class="config-wrap">
    <Name/>
    <BreadCrumb categary="result"></BreadCrumb>
    <div class="result">
      <el-table
        :data="results"
      >
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          label="时间"
          prop="date"

        >
          <template slot-scope="scope">
            {{(function() {
            let d = new Date(scope.row.date);
            return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
          })()}}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="openTopo(scope.row.id)">查看
            </el-button>
<!--            <el-button
              size="mini"
              type="danger"
              @click="delConfig(scope.row.id)">删除
            </el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <p>
        <el-button @click="toUpload" size="small">导入结果</el-button>
      </p>
    </div>
  </div>
</template>

<script>

  import Name from './Name.vue';
  import BreadCrumb from './BreadCrumb.vue';
  import axios from 'axios';

  export default {
    name: 'result',
    props: {
      id: String
    },
    components: {
      BreadCrumb,
      Name
    },
    data() {
      return {
        results: [
//          {
//            ipStart: '192.168.123.2',
//            ipEnd: '192.168.123.3',
//            port: '80',
//            thread: '80',
//            delay: '100',
//            way: '1'
//          },
        ],
      }
    },
    methods: {
      getResults() {
        let _this = this;

        axios.get('/results/' + _this.id).then((res) => {
          if(res.data.result === 'success') {
            if(res.data.data.length === 0) {
              this.$router.push('/Topo?projectID=' + _this.id);
            } else {
              _this.results = res.data.data;
            }
          } else {
            _this.$message(res.data.msg)
          }
        }).catch((error) => {
          console.log(error)
        });
      },
      openTopo(id) {
        let _this = this;
        this.$router.push(`/Topo?id=${id}&projectID=` + _this.id);
      },
      toUpload() {
        let _this = this;
        this.$router.push('/Topo?projectID=' + _this.id);
      }
    },
    mounted() {
      this.getResults();
    }
  }
</script>

<style scoped lang="scss">
  .result {
    max-width: 1024px;
    margin: 20px auto;

    p {
      text-align: right
    }
  }
</style>
