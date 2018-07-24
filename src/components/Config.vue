<template>
  <div class="config-wrap">
    <Name/>
    <BreadCrumb categary="config" :id="id"></BreadCrumb>
    <div class="config">
      <el-table
        :data="configs"
      >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          label="起始IP"
          prop="ipStart"
        >
        </el-table-column>
        <el-table-column
          label="终止IP"
          prop="ipEnd"
        >
        </el-table-column>

        <el-table-column
          label="端口"
          prop="port"
        >
        </el-table-column>
        <el-table-column
          label="线程"
          prop="thread"
        >
        </el-table-column>
        <el-table-column
          label="时延"
          prop="delay"
        >
        </el-table-column>
        <el-table-column
          label="策略"
          prop="way"
        >
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showEdit(scope.row)">修改
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="delConfig(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <p>
        <el-button @click="createScanJson" size="small">生成扫描脚本</el-button>
        <el-button @click="add.show = true" size="small">添加配置</el-button>
      </p>
    </div>

    <el-dialog
      title="添加配置"
      :visible.sync="add.show"
      width="600px">
      <span class="input-label">起始IP:</span>
      <el-input
        placeholder="xx.xx.xx.xx"
        v-model="add.ipStart"
        :suffix-icon="add.ipStart ? checkIP(add.ipStart) ? 'el-icon-check' : 'el-icon-close' : ''"
      >
      </el-input>
      <br>
      <br>
      <span class="input-label">终止IP:</span>
      <el-input
        placeholder="xx.xx.xx.xx"
        v-model="add.ipEnd"
        :suffix-icon="add.ipEnd ? checkIP(add.ipEnd) ? 'el-icon-check' : 'el-icon-close' : ''"
      >
      </el-input>
      <br>
      <br>
      <span class="input-label">端 口:</span>
      <el-input
        placeholder="英文逗号分隔,「-」表示范围。例:443,8080,500-3000"
        v-model="add.port"
      >
      </el-input>
      <br>
      <br>
      <span class="input-label">线 程:</span>
      <el-input v-model="add.thread"></el-input>
      <br>
      <br>
      <span class="input-label">时 延:</span>
      <el-input v-model="add.delay"></el-input>
      <br>
      <br>
      <el-radio v-model="add.way" label="1">策略1</el-radio>
      <el-radio v-model="add.way" label="2">策略2</el-radio>
      <br>
      <br>

      <span slot="footer" class="dialog-footer">
        <el-button @click="add.show = false">取 消</el-button>
        <el-button type="primary" @click="addConfig">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加配置"
      :visible.sync="edit.show"
      width="600px">
      <span class="input-label">起始IP:</span>
      <el-input
        placeholder="xx.xx.xx.xx"
        v-model="edit.ipStart"
        :suffix-icon="edit.ipStart ? checkIP(edit.ipStart) ? 'el-icon-check' : 'el-icon-close' : ''"
      >
      </el-input>
      <br>
      <br>
      <span class="input-label">终止IP:</span>
      <el-input
        placeholder="xx.xx.xx.xx"
        v-model="edit.ipEnd"
        :suffix-icon="edit.ipEnd ? checkIP(edit.ipEnd) ? 'el-icon-check' : 'el-icon-close' : ''"
      >
      </el-input>
      <br>
      <br>
      <span class="input-label">端 口:</span>
      <el-input
        placeholder="英文逗号分隔,「-」表示范围。例:443,8080,500-3000"
        v-model="edit.port"
      >
      </el-input>
      <br>
      <br>
      <span class="input-label">线 程:</span>
      <el-input v-model="add.thread"></el-input>
      <br>
      <br>
      <span class="input-label">时 延:</span>
      <el-input v-model="edit.delay"></el-input>
      <br>
      <br>
      <el-radio v-model="edit.way" label="1">策略1</el-radio>
      <el-radio v-model="edit.way" label="2">策略2</el-radio>
      <br>
      <br>

      <span slot="footer" class="dialog-footer">
        <el-button @click="edit.show = false">取 消</el-button>
        <el-button type="primary" @click="editConfig">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import Name from './Name.vue';
  import BreadCrumb from './BreadCrumb.vue';
  import axios from 'axios';

  export default {
    name: 'config',
    props: {
      id: String
    },
    components: {
      BreadCrumb,
      Name
    },
    data() {
      return {
        configs: [
//          {
//            ipStart: '192.168.123.2',
//            ipEnd: '192.168.123.3',
//            port: '80',
//            thread: '80',
//            delay: '100',
//            way: '1'
//          },
        ],
        add: {
          show: false,
          ipStart: '',
          ipEnd: '',
          port: '',
          thread: '4',
          delay: '600',
          way: '1'
        },
        edit: {
          show: false,
          id: '',
          ipStart: '',
          ipEnd: '',
          port: '',
          thread: '',
          delay: '',
          way: ''
        }
      }
    },
    methods: {
      getConfigs() {
        let _this = this;
        axios.get('/config/' + _this.id).then((res) => {
//        axios.get('http://localhost:3000/config/' + _this.id).then((res) => {
          if(res.data.result === 'success') {
            _this.configs = res.data.configs;
          } else {
            _this.$message(res.data.msg)
          }
        }).catch((error) => {
          console.log(error)
        });
      },
      addConfig() {
        let _this = this;
        if(this.add.ipStart && this.add.ipEnd && this.add.port && this.add.thread && this.add.delay && this.add.way) {
          axios.post('/config', {
            projectId: _this.id,
            ipStart: _this.add.ipStart,
            ipEnd: _this.add.ipEnd,
            port: _this.add.port,
            thread: _this.add.thread,
            delay: _this.add.delay,
            way: _this.add.way,
          })
            .then((res) => {
              if(res.data.result === 'success') {
                _this.$message('新建成功')
                _this.getConfigs()
                _this.add.show = false;
                _this.add.ipStart = '';
                _this.add.ipEnd = '';
                _this.add.port = '';
                _this.add.thread = '4';
                _this.add.delay = '600';
                _this.add.way = '1';
              } else {
                _this.$message(res.data.msg)
              }
            }).catch((error) => {
            console.log(error)
          });
        } else {
          this.$message('输入不能为空')
        }
      },
      showEdit(row) {
        this.edit.show = true;
        this.edit.id = row.id;
        this.edit.ipStart = row.ipStart;
        this.edit.ipEnd = row.ipEnd;
        this.edit.port = row.port;
        this.edit.thread = row.thread;
        this.edit.delay = row.delay;
        this.edit.way = row.way;
      },
      editConfig() {
        let _this = this;
        if(this.edit.ipStart && this.edit.ipEnd && this.edit.port && this.edit.thread && this.edit.delay && this.edit.way) {
          axios.post('/config', {
            id: _this.edit.id,
            ipStart: _this.edit.ipStart,
            ipEnd: _this.edit.ipEnd,
            port: _this.edit.port,
            thread: _this.edit.thread,
            delay: _this.edit.delay,
            way: _this.edit.way,
          })
            .then((res) => {
              if(res.data.result === 'success') {
                _this.$message('修改成功')
                _this.getConfigs()
                _this.edit.show = false;
              } else {
                _this.$message(res.data.msg)
              }
            }).catch((error) => {
            console.log(error)
          });
        } else {
          this.$message('输入不能为空')
        }
      },
      delConfig(id) {
        let _this = this;
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/config/' + id)
            .then((res) => {
              if(res.data.result === 'success') {
                _this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                _this.getConfigs();
              } else {
                _this.$message(res.data.msg)
              }
            }).catch((error) => {
            console.log(error)
          });

        }).catch(() => {
          _this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      createScanJson() {
        let _this = this;
        axios.get('/createScanJson/' + _this.id).then((res) => {
          if(res.data.result === 'success') {
            window.open('/downloadScanJson', '_self');
          } else {
            _this.$message(res.data.msg)
          }
        }).catch((error) => {
          console.log(error)
        });
      },
      checkIP(ip) {
        return /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(ip)
      }
    },
    mounted() {
      this.getConfigs();
    }
  }
</script>

<style scoped lang="scss">
  .config {
    max-width: 1024px;
    margin: 20px auto;

    p {
      text-align: right
    }
  }
  .input-label {
    display: inline-block;
    width: 50px;
  }
  .el-input {
    width: 480px;
  }
</style>
