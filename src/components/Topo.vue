<template>
  <div class="topo-wrap">
    <Name/>
    <BreadCrumb categary="topo" :id="projectID"></BreadCrumb>
    <div class="topo-container">
      <div v-if="!showUpload" class="topo" :style="{zoom: zoom, height: topo.length * 350 + 'px'}">
        <div v-for="(router, index) in topo" class="router-line"
             :style="{top: index * 350 + 150 + 'px', width: (router.devices.length + 1) * 100 + 'px'}">
          <Device @add="addConfig" v-for="(device, i) in router.devices" :info="device" :index="i"></Device>
          <div class="router-ip">{{router.ip}}</div>
        </div>
      </div>
      <el-upload
        :on-success="uploaded"
        class="upload-panel"
        v-show="showUpload"
        drag
        multiple
        accept=".json"
        action="/uploadConfigJson"
        :data="{projectId: projectID}"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传.json文件</div>
      </el-upload>
    </div>
    <div v-show="!showUpload" class="btn-wrap">
      <div class="btn-zoom">
        <el-button @click="zoomOut" size="small" :disabled="zoom < .7">-</el-button>
        <el-button @click="zoomIn" size="small" :disabled="zoom > 1.1">+</el-button>
      </div>
      <div class="btn-operate">
        <el-button @click="createAttackJson" size="small">生成攻击脚本</el-button>
        <el-button @click="clearTopo" size="small">导入攻击结果</el-button>
        <el-button @click="toggleConfig" size="small">{{showConfig ? '隐藏' : '显示'}}配置面板</el-button>
      </div>
    </div>

    <div class="topo-config" :style="{right: showConfig ? '10px' : '-450px'}">

      <el-table
        :data="attackConfig"
      >
        <el-table-column
          type="index"
          width="50">
        </el-table-column>
        <el-table-column
          label="IP"
          prop="ip"
        >
        </el-table-column>
        <el-table-column
          label="漏洞"
          prop="port"
        >
        </el-table-column>

        <el-table-column
          label="操作"
          width="80"
        >
          <template slot-scope="scope">
            <el-button @click="removeConfig(scope.row.ip, scope.row.port)" size="mini">移 除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <p class="btn-clear-wrap">
        <el-button @click="clearConfig" size="mini" type="danger">清空配置</el-button>
      </p>
    </div>


  </div>

</template>

<script>
  import Name from './Name.vue';
  import BreadCrumb from './BreadCrumb.vue';
  import Device from './Device.vue';
  import axios from 'axios';

  export default {
    name: 'topo',
    components: {
      BreadCrumb,
      Name,
      Device
    },
    props: {
      id: String,
      projectID: String
    },
    data () {
      return {
        zoom: 1,
        showConfig: false,
        attackConfig: [
/*          {
            ip: '123',
            port: '80'
          }*/
        ],
        topo: [
/*          {
            ip: '192.123.123.1',
            devices: [
              {
                ip: '123.123.123.123',
                port: ['1234', '234'],
                type: 'pc',
                os: 'winOld',
                version: '2003',
                attacked: true
              },
              {
                ip: '234.123.123.123',
                port: ['1234', '234'],
                type: 'pc',
                os: 'winOld',
                version: '2003',
                attacked: false
              },
              {
                ip: '234.123.123.123',
                port: ['1234', '234'],
                type: 'pc',
                os: 'winOld',
                version: '2003',
                attacked: false
              },
              {
                ip: '234.123.123.123',
                port: ['1234', '234', '234', '234', '234'],
                type: 'pc',
                os: 'winOld',
                version: '2003',
                attacked: false
              },
            ]
          },
          {
            ip: '192.123.234.1',
            devices: [
              {
                ip: '123.123.123.123',
                port: ['1234', '234'],
                type: 'pc',
                os: 'winOld',
                version: '2003',
                attacked: true
              },
              {
                ip: '123.123.123.123',
                port: ['1234', '234'],
                type: 'pc',
                os: 'winOld',
                version: '2003',
                attacked: true
              },
              {
                ip: '123.123.123.123',
                port: ['1234', '234'],
                type: 'pc',
                os: 'winOld',
                version: '2003',
                attacked: true
              },
              {
                ip: '123.123.123.123',
                port: ['1234', '234'],
                type: 'pc',
                os: 'winOld',
                version: '2003',
                attacked: true
              },
              {
                ip: '234.123.123.123',
                port: ['1234', '234'],
                type: 'server',
                os: 'winOld',
                version: '2003',
                attacked: false
              },
              {
                ip: '234.123.123.123',
                port: ['1234', '234'],
                type: 'pc',
                os: 'winOld',
                version: '2003',
                attacked: false
              },
              {
                ip: '234.123.123.123',
                port: ['1234', '234'],
                type: 'server',
                os: 'linux',
                version: '',
                attacked: false
              },
              {
                ip: '234.123.123.123',
                port: ['1234', '234'],
                type: 'pc',
                os: 'winNew',
                version: '10',
                attacked: false
              },
              {
                ip: '234.123.123.123',
                port: ['1234', '234'],
                type: 'pc',
                os: 'winOld',
                version: '2003',
                attacked: false
              },
            ]
          },*/
        ],
        uploadData: {
          projectId: this.projectID
        }
      }
    },
    methods: {
      zoomIn() {
        if(this.zoom < 1.1) {
          this.zoom += .025;
        }
      },
      zoomOut() {
        if(this.zoom > .7) {
          this.zoom -= .025;
        }
      },
      toggleConfig() {
        this.showConfig = !this.showConfig;
      },
      addConfig(ip, port) {
        let _this = this;
        let added;
        this.attackConfig.forEach(i => {
          if(i.ip === ip && i.port === port) {
            _this.$message(ip + ':' + port + '已经添加过了');
            added = true;
          }
        })
        if(!added) {
          this.attackConfig.push({
            ip: ip,
            port: port
          });
        }
        this.showConfig = true;
      },
      removeConfig(ip, port) {
        let arr = [];
        this.attackConfig.forEach(i => {
          if(i.ip === ip && i.port === port) {

          } else {
            arr.push({
              ip: i.ip,
              port: i.port
            })
          }
        })
        if(arr.length === 0) {
          this.showConfig = false;
        }
        this.attackConfig = arr;

      },
      clearConfig() {
        this.attackConfig = [];
        this.showConfig = false;
      },
      createAttackJson() {
        let _this = this;
        if(this.attackConfig.length > 0) {
          axios.post('/createAttackJson', _this.attackConfig).then((res) => {
            if(res.data.result === 'success') {
              window.open('/downloadAttackJson', '_self');
            } else {
              _this.$message(res.data.msg)
            }
          }).catch((error) => {
            console.log(error)
          });
        } else {
          this.$message('未添加配置')
        }

      },
      uploaded(response, file, fileList) {
        let _this = this;
        if(response.result === 'success') {
          axios.get('/getConfigData').then((res) => {
            if(res.data.result === 'success') {
              _this.topo = JSON.parse(res.data.topo);
            } else {
              _this.$message(res.data.msg)
            }
          }).catch((error) => {
            console.log(error)
          });
        }
      },
      clearTopo() {
        this.topo = []
      },
      getTopo() {
        let _this = this;
        axios.get('/result/' + _this.id).then((res) => {
//        axios.get('http://localhost:3000/result/7').then((res) => {
          if(res.data.result === 'success') {
            _this.topo = JSON.parse(res.data.data);
          } else {
            _this.$message(res.data.msg)
          }
        }).catch((error) => {
          console.log(error)
        });
      }
    },
    computed: {
      showUpload() {
        return this.topo.length === 0;
      }
    },
    mounted() {
      if(this.id){
        this.getTopo()
      }
    }
  }
</script>

<style scoped lang="scss">
  .topo-wrap {
    position: relative;
    overflow: hidden;

    .topo-container {
      height: 800px;
      border-bottom: 1px solid #ccc;

      border-radius: 5px;
      padding: 10px;
      overflow: auto;

      .topo {
        zoom: 1.2;

        width: 1200px;
        height: 700px;
        position: relative;

        border-left: 4px solid #409eff;

        .router-line {

          width: 1000px;
          height: 4px;
          background: #409eff;

          position: absolute;
          top: 150px;

          /*transition: width ease 1s;*/

          .router-ip {
            position: absolute;
            top: -16px;
            right: 0;

            height: 24px;
            padding: 5px 10px;

            font-size: 16px;
            line-height: 26px;
            font-weight: bold;
            color: #409eff;

            border: 2px dashed #409eff;
            border-radius: 4px;

            transform: translateX(102%);
          }
        }
      }

      .upload-panel {
        width: 360px;
        margin: 100px auto 0;
      }

    }

    .btn-wrap {
      margin: 20px auto;
      padding: 0 20px;

      display: flex;
      justify-content: space-between;
    }

    .topo-config {
      width: 400px;
      height: 760px;
      padding: 10px;

      box-shadow: 0 3px 10px #ccc;
      background: #fff;

      border-radius: 5px;
      /*border: 1px solid #ccc;*/

      position: absolute;
      top: 85px;
      right: -450px;

      transition: right ease 1s;

      overflow: auto;

      .btn-clear-wrap {
        text-align: right;
      }
    }
  }


</style>
