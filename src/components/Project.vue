<template>
  <div class="project-wrap">
    <Name/>
    <BreadCrumb categary="project"></BreadCrumb>
    <div class="project">
      <el-table
        :data="projects"
      >
        <el-table-column
          label="项目名"
          prop="name"
          width="200"
        >
        </el-table-column>

        <el-table-column
          label="说明"
          prop="remark"
        >
          <template slot-scope="scope">
            <span class="project-remark">
              {{scope.row.remark }} <i class="el-icon-edit" @click="showEdit(scope.row)"></i>
            </span>

          </template>
        </el-table-column>
        <el-table-column
          label="时间"
          prop="date"
          width="160"
        >
          <template slot-scope="scope">
            {{(function() {
            let d = new Date(scope.row.date);
            return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
          })()}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="openProject(scope.row)">配置
            </el-button>
            <el-button
              size="mini"
              @click="openResult(scope.row.id)">结果
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="delProject(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <p>
        <el-button @click="add.show = true" size="small">新建项目</el-button>
      </p>
    </div>


    <el-dialog
      title="新建项目"
      :visible.sync="add.show"
      width="50%">
      <el-input
        placeholder="请输入项目名"
        v-model="add.name"
      >
      </el-input>
      <br>
      <br>
      <el-input
        placeholder="请输入项目说明"
        type="textarea"
        v-model="add.remark"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="add.show = false">取 消</el-button>
        <el-button type="primary" @click="addProject">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="修改项目"
      :visible.sync="edit.show"
      width="50%">
      <el-input v-model="edit.name" disabled></el-input>
      <br>
      <br>
      <el-input v-model="edit.remark" type="textarea"></el-input>
      <br>
      <br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit.show = false">取 消</el-button>
        <el-button type="primary" @click="editProject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Name from './Name.vue';
  import BreadCrumb from './BreadCrumb.vue';
  import axios from 'axios';
  export default {
    name: 'project',
    components: {
      Name,
      BreadCrumb
    },
    data() {
      return {
        projects: [
//          {
//            date: '2016-05-02',
//            name: 'test',
//            remark: 'test的一些说明'
//          },
        ],
        add: {
          show: false,
          name: '',
          remark: ''
        },
        edit: {
          show: false,
          id: '',
          name: '',
          remark: ''
        }
      }
    },
    methods: {
      getProjects() {
        let _this = this;
        axios.get('/project').then((res) => {
//        axios.get('http://localhost:3000/project').then((res) => {
            if(res.data.result === 'success') {
              _this.projects = res.data.projects;
            } else {
              _this.$message(res.data.msg)
            }
          }).catch((error) => {
          console.log(error)
        });
      },
      showEdit(row) {
        this.edit.show = true;
        this.edit.id = row.id;
        this.edit.name = row.name;
        this.edit.remark = row.remark;
      },
      editProject() {
        let _this = this;
        if(this.edit.name && this.edit.remark){
          axios.post('/project', {
            id: _this.edit.id,
            name: _this.edit.name,
            remark: _this.edit.remark
          })
            .then((res) => {
              if(res.data.result === 'success') {
                _this.$message('修改成功')
                _this.getProjects()
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
      addProject() {
        let _this = this;
        if(this.add.name && this.add.remark){
          axios.post('/project', {
            name: _this.add.name,
            remark: _this.add.remark
          })
            .then((res) => {
              if(res.data.result === 'success') {
                _this.$message('新建成功')
                _this.getProjects()
                _this.add.show = false;
                _this.add.name = '';
                _this.add.remark = '';
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
      delProject(id) {
        let _this = this;
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          axios.delete('/project/' + id)
            .then((res) => {
              if(res.data.result === 'success') {
                _this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                _this.getProjects();
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
      openProject(row) {
          window.project = row.name;
          this.$router.push('/Config/' + row.id);
      },
      openResult(id) {
          this.$router.push('/Result/' + id);
      }
    },
    mounted() {
      this.getProjects()
    }
  }
</script>

<style scoped lang="scss">
  .project {
    max-width: 1024px;
    margin: 20px auto;

    p {
      text-align: right;
    }
    .project-remark {
      cursor: default;
      &:hover>.el-icon-edit {display: inline-block;}
    }
    .el-icon-edit {
      cursor: pointer;
      display: none;
    }
  }
</style>
