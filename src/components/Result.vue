<template>
  <div class="config-wrap">
    <Name/>
    <BreadCrumb categary="result" :id="id"></BreadCrumb>
    <div class="result">
      <el-table
        :data="results"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          label="配置"
          prop="remark"
        >
        </el-table-column>
        <el-table-column
          label=""
          prop="type"
          width="80"
        >
        </el-table-column>
        <el-table-column
          label="时间"
          prop="date"
          width="180"
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
        <el-button v-show="showMultiple" @click="openTopo()" size="small">查看选中结果</el-button>
        <el-button @click="showScanImport = true" size="small">导入扫描结果</el-button>
        <el-button @click="showAttackImport = true" size="small">导入攻击结果</el-button>
      </p>


    </div>
    <el-dialog
      :visible.sync="showScanImport"
      width="600px">

      <div class="upload-panel">
        <el-upload
          :on-success="uploaded"
          drag
          multiple
          accept=".json"
          action="/uploadConfigJson"
          :data="{projectId: id, type: 'scan', remark: scanRemark}"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传.json文件</div>
        </el-upload>
        <el-input
          class="input-remark"
          placeholder="输入描述"
          type="textarea"
          :rows="2"
          size="small"
          clearable
          v-model="scanRemark">
        </el-input>
      </div>

    </el-dialog>
    <el-dialog
      :visible.sync="showAttackImport"
      width="600px">
      <div class="upload-panel">
        <el-upload
          :on-success="uploaded"
          class="upload-panel"
          drag
          multiple
          accept=".json"
          action="/uploadConfigJson"
          :data="{projectId: id, type: 'attack', remark: attackRemark}"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传.json文件</div>
        </el-upload>
        <el-input
          class="input-remark"
          placeholder="输入描述"
          type="textarea"
          :rows="2"
          size="small"
          clearable
          v-model="attackRemark">
        </el-input>
      </div>
    </el-dialog>
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
        showScanImport: false,
        showAttackImport: false,
        showMultiple: false,
        scanRemark: '',
        attackRemark: '',
        selectedID: ''
      }
    },

    methods: {
      getResults() {
        let _this = this;

        axios.get('/results/' + _this.id).then((res) => {
//        axios.get('http://localhost:3000/results/' + _this.id).then((res) => {
          if(res.data.result === 'success') {
            _this.results = res.data.data;
          } else {
            _this.$message(res.data.msg)
          }
        }).catch((error) => {
          console.log(error)
        });
      },
      openTopo(d) {
        let _this = this;
        let id = d || this.selectedID;
        this.$router.push(`/Topo?id=${id}&projectID=` + _this.id);
      },
      uploaded() {
//        let _this = this;
        this.$message('数据导入成功');
//        this.showScanImport = false;
//        this.showAttackImport = false;

        setTimeout(() => {
          location.reload()
        }, 400)
      },
      handleSelectionChange(val) {
        let _this = this;
        let arr = []

        this.showMultiple = val.length > 1;
        if(val.length > 1) {
          val.forEach(i => {
            arr.push(i.id)
          })
          _this.selectedID = arr.sort().toString()
        }
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
  .upload-panel {
    width: 360px;
    margin: 20px auto;
  }

  .input-remark {
    margin-top: 10px;
  }
</style>


