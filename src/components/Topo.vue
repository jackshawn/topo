<template>
  <div class="topo-wrap">
    <Name/>
    <BreadCrumb categary="topo" :id="projectID"></BreadCrumb>
    <div class="topo-container">
      <div id="tree">
        <el-input
          placeholder="输入关键字进行过滤"
          size="small"
          clearable
          v-model="filterText">
        </el-input>
        <br>
        <br>
        <el-tree
          node-key="id"
          :data="treeData"
          show-checkbox
          :default-expanded-keys="[1]"
          @check-change="handleCheck"
          :filter-node-method="filterNode"
          @node-click="handleClick"
          ref="tree"
        ></el-tree>
      </div>
      <div id="chart">

      </div>
      <div class="topo-config" :style="{right: showConfig ? '10px' : '-350px'}">
        <Device v-show="deviceInfo.ip" @add="addConfig"  @showEdit="showEdit" :info="deviceInfo"></Device>
        <div class="table-wrap">
          <el-table
            :data="attackConfig"
          >
            <el-table-column
              type="index"
              width="30">
            </el-table-column>
            <el-table-column
              label="IP"
              prop="ip"
            >
            </el-table-column>
            <el-table-column
              label="漏洞"
              prop="port"
              width="60"
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
        </div>
        <p class="btn-clear-wrap">
          <el-button @click="createAttackJson" size="small">生成攻击脚本</el-button>
          <el-button @click="clearConfig" size="mini" type="danger">清空配置</el-button>
        </p>
        <el-button class="btn-toggle" @click="toggleConfig" size="small">{{showConfig ? '>' : '<'}}</el-button>
      </div>

    </div>
    <el-dialog
      :title="edit.title"
      :visible.sync="edit.show"
      width="50%">
      备注:
      <el-input v-model="edit.remark" type="textarea"></el-input>
      <br>
      <br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit.show = false">取 消</el-button>
        <el-button type="primary" @click="updateIPRemark">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  import Name from './Name.vue';
  import BreadCrumb from './BreadCrumb.vue';
  import Device from './Device.vue';
  import axios from 'axios';
  import echarts from 'echarts';

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
        treeData: [],
        topoOption: {
          series: [
            {
              type: 'graph',
              layout: 'force',
              force: {
                edgeLength: 60,
                repulsion: 100,
              },
//              draggable: true,
              roam: true,
              label: {
                normal: {
                  show: false,
                  position: 'top',
                }
              },
              edgeLabel: {
                show: false
              },
              itemStyle: {
                color: '#409eff'
              },
              data: [],
              links: []
            }
          ]
        },
        myChart: undefined,
        filterText: '',
        showConfig: false,
        attackConfig: [],
        deviceInfo: {
          ip: '',
          port: [],
          type: '',
          os: '',
          version: '',
          attacked: true,
          remark: ''
        },
        edit: {
          show: false,
          title: '',
          remark: '',
          remarkOri: '',
          port: []
        }

      }
    },
    methods: {
      toggleConfig() {
        this.showConfig = !this.showConfig;
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
      getTopo() {
        let _this = this;
        axios.get('/result/' + _this.id).then((res) => {
//        axios.get('http://localhost:3000/result/49').then((res) => {
          if(res.data.result === 'success') {
            _this.init(res.data.data)
          } else {
            _this.$message(res.data.msg)
          }
        }).catch((error) => {
          console.log(error)
        });
      },
      filterNode(value, data) {

        if(!value) {
          return true
        } else {
          // 多个搜索
          if(value.indexOf(',') !== -1) {
            let arr = value.split(',');
            for(let i = 0; i < arr.length; i++) {
              if(data.label.indexOf(arr[i]) !== -1) {
                return true;
              }
            }
          } else {
            return data.label.indexOf(value) !== -1;
          }
        }

      },
      handleCheck(a, b, c) {
        let _this = this;

        let symbol = {
          server: 'path://M960 320H64c-35.346 0-64-28.654-64-64V128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m224 496H64c-35.346 0-64-28.654-64-64v-128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m224 496H64c-35.346 0-64-28.654-64-64v-128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z',
          pc: 'path://M0 802c0 49.626 40.374 90 90 90h844c49.626 0 90-40.374 90-90H0zM82 132h860v610H82z'
        }

        if(a.id.toString().indexOf('start') !== -1 && a.children) {
          if(b) {
            a.children.forEach(j => {
              let mark;
              if(_this.filterText.indexOf(',') !== -1) {
                let arr = _this.filterText.split(',');
                for(let i = 0; i < arr.length; i++) {
                  if(j.label.indexOf(arr[i]) !== -1) {
                    mark = true;
                  }
                }
              } else {
                mark = j.label.indexOf(_this.filterText) !== -1;
              }
              if(mark) {
                this.topoOption.series[0].data.push({
                  name: j.label,
                  symbol: symbol[j.type],
                  ip: j.ip,
                  port: j.port,
                  type: j.type,
                  os: j.os,
                  version: j.version,
                  remark: j.remark,
                  attacked: j.attacked,
                  itemStyle: {
                    color: j.attacked ? '#f56b6b' : '#409eff'
                  },
                  symbolSize: j.type === 'pc' ? [13, 9] : 10
                })
                this.topoOption.series[0].links.push({
                  source: a.label,
                  target: j.label
                })
              }

            })
          } else {
            this.topoOption.series[0].data = this.topoOption.series[0].data.filter(i => {
              let r = true;
              for(let k = 0; k < a.children.length; k++) {
                if(i.name === a.children[k].label) {
                  r = false;
                }
              }
              return r
            })
            this.topoOption.series[0].links = this.topoOption.series[0].links.filter(i => {
              return a.label !== i.source
            })
          }
          this.myChart.setOption(_this.topoOption);
        }

      },
      handleClick(a, b, c) {
        if(!a.children) {
          this.showInfo(a);
        }
      },
      showInfo(info) {
        this.showConfig = true;
        this.deviceInfo = {
          ip: info.ip,
          port: info.port,
          type: info.type,
          os: info.os,
          version: info.version,
          attacked: info.attacked,
          remark: info.remark
        }
      },
      init(data) {
        let _this = this;
        let symbol = {
          server: 'path://M960 320H64c-35.346 0-64-28.654-64-64V128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m224 496H64c-35.346 0-64-28.654-64-64v-128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m224 496H64c-35.346 0-64-28.654-64-64v-128c0-35.346 28.654-64 64-64h896c35.346 0 64 28.654 64 64v128c0 35.346-28.654 64-64 64z m-96-176c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z m-128 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48z',
          pc: 'path://M0 802c0 49.626 40.374 90 90 90h844c49.626 0 90-40.374 90-90H0zM82 132h860v610H82z'
        }
/*        let data = [
          {"ip":"192.168.1.1","devices":[{"ip":"192.168.1.2","port":[991],"type":"pc","os":"winNew","version":775,"remark":"qwe","attacked":false},{"ip":"192.168.1.3","port":[],"type":"server","os":"winOld","version":49,"remark":"qwe","attacked":false},{"ip":"192.168.1.4","port":[937],"type":"pc","os":"linux","version":673,"remark":"qwe","attacked":false},{"ip":"192.168.1.5","port":[501],"type":"pc","os":"winOld","version":111,"remark":"qwe","attacked":true},{"ip":"192.168.1.6","port":[446],"type":"pc","os":"linux","version":791,"remark":"qwe","attacked":false},{"ip":"192.168.1.7","port":[625],"type":"pc","os":"winOld","version":441,"remark":"qwe","attacked":true},{"ip":"192.168.1.8","port":[473],"type":"server","os":"winOld","version":869,"remark":"qwe","attacked":false},{"ip":"192.168.1.9","port":[657],"type":"pc","os":"winNew","version":417,"remark":"qwe","attacked":false},{"ip":"192.168.1.10","port":[],"type":"pc","os":"winOld","version":109,"remark":"qwe","attacked":false},{"ip":"192.168.1.11","port":[757],"type":"pc","os":"winOld","version":22,"remark":"qwe","attacked":false},{"ip":"192.168.1.12","port":[763],"type":"pc","os":"winNew","version":339,"remark":"qwe","attacked":false},{"ip":"192.168.1.13","port":[977],"type":"pc","os":"winOld","version":26,"remark":"qwe","attacked":false},{"ip":"192.168.1.14","port":[539],"type":"pc","os":"winNew","version":456,"remark":"qwe","attacked":false},{"ip":"192.168.1.15","port":[51],"type":"pc","os":"linux","version":304,"remark":"qwe","attacked":false},{"ip":"192.168.1.16","port":[23],"type":"server","os":"linux","version":737,"remark":"qwe","attacked":false},{"ip":"192.168.1.17","port":[274],"type":"pc","os":"winNew","version":164,"remark":"qwe","attacked":false},{"ip":"192.168.1.18","port":[522],"type":"server","os":"winNew","version":329,"remark":"qwe","attacked":false},{"ip":"192.168.1.19","port":[828],"type":"pc","os":"winNew","version":365,"remark":"qwe","attacked":false},{"ip":"192.168.1.20","port":[800],"type":"pc","os":"winOld","version":726,"remark":"qwe","attacked":false},{"ip":"192.168.1.21","port":[965],"type":"pc","os":"winNew","version":373,"remark":"qwe","attacked":false},{"ip":"192.168.1.22","port":[436],"type":"server","os":"winNew","version":750,"remark":"qwe","attacked":true},{"ip":"192.168.1.23","port":[184],"type":"server","os":"winOld","version":705,"remark":"qwe","attacked":false},{"ip":"192.168.1.24","port":[911],"type":"pc","os":"winOld","version":839,"remark":"qwe","attacked":false},{"ip":"192.168.1.25","port":[],"type":"server","os":"linux","version":797,"remark":"qwe","attacked":false},{"ip":"192.168.1.26","port":[379],"type":"pc","os":"winNew","version":552,"remark":"qwe","attacked":false},{"ip":"192.168.1.27","port":[937],"type":"pc","os":"winOld","version":132,"remark":"qwe","attacked":false},{"ip":"192.168.1.28","port":[881],"type":"server","os":"winNew","version":653,"remark":"qwe","attacked":false},{"ip":"192.168.1.29","port":[847],"type":"pc","os":"linux","version":457,"remark":"qwe","attacked":false},{"ip":"192.168.1.30","port":[],"type":"pc","os":"winNew","version":293,"remark":"qwe","attacked":false},{"ip":"192.168.1.31","port":[765],"type":"pc","os":"winNew","version":820,"remark":"qwe","attacked":true},{"ip":"192.168.1.32","port":[768],"type":"pc","os":"winOld","version":750,"remark":"qwe","attacked":false},{"ip":"192.168.1.33","port":[],"type":"pc","os":"winNew","version":167,"remark":"qwe","attacked":false},{"ip":"192.168.1.34","port":[730],"type":"server","os":"winNew","version":349,"remark":"qwe","attacked":false},{"ip":"192.168.1.35","port":[184],"type":"pc","os":"winNew","version":783,"remark":"qwe","attacked":false},{"ip":"192.168.1.36","port":[24],"type":"pc","os":"linux","version":924,"remark":"qwe","attacked":false},{"ip":"192.168.1.37","port":[95],"type":"pc","os":"winOld","version":750,"remark":"qwe","attacked":false},{"ip":"192.168.1.38","port":[786],"type":"pc","os":"linux","version":575,"remark":"qwe","attacked":false},{"ip":"192.168.1.39","port":[860],"type":"pc","os":"winNew","version":853,"remark":"qwe","attacked":false},{"ip":"192.168.1.40","port":[],"type":"server","os":"winOld","version":348,"remark":"qwe","attacked":false},{"ip":"192.168.1.41","port":[106],"type":"pc","os":"winOld","version":165,"remark":"qwe","attacked":false},{"ip":"192.168.1.42","port":[636],"type":"pc","os":"winNew","version":656,"remark":"qwe","attacked":false},{"ip":"192.168.1.43","port":[],"type":"pc","os":"winNew","version":773,"remark":"qwe","attacked":false},{"ip":"192.168.1.44","port":[865],"type":"pc","os":"winNew","version":687,"remark":"qwe","attacked":true},{"ip":"192.168.1.45","port":[],"type":"server","os":"winNew","version":210,"remark":"qwe","attacked":false},{"ip":"192.168.1.46","port":[591],"type":"server","os":"winNew","version":199,"remark":"qwe","attacked":false},{"ip":"192.168.1.47","port":[522],"type":"server","os":"winOld","version":333,"remark":"qwe","attacked":true},{"ip":"192.168.1.48","port":[113],"type":"pc","os":"winOld","version":270,"remark":"qwe","attacked":true},{"ip":"192.168.1.49","port":[496],"type":"pc","os":"winOld","version":731,"remark":"qwe","attacked":false}]},{"ip":"192.168.2.1","devices":[{"ip":"192.168.2.2","port":[623],"type":"server","os":"winNew","version":598,"remark":"qwe","attacked":false},{"ip":"192.168.2.3","port":[324],"type":"pc","os":"winOld","version":703,"remark":"qwe","attacked":false},{"ip":"192.168.2.4","port":[],"type":"server","os":"winNew","version":394,"remark":"qwe","attacked":true},{"ip":"192.168.2.5","port":[675],"type":"server","os":"winNew","version":238,"remark":"qwe","attacked":false},{"ip":"192.168.2.6","port":[479],"type":"pc","os":"winOld","version":966,"remark":"qwe","attacked":false},{"ip":"192.168.2.7","port":[193],"type":"server","os":"linux","version":894,"remark":"qwe","attacked":true},{"ip":"192.168.2.8","port":[500],"type":"pc","os":"winNew","version":455,"remark":"qwe","attacked":true},{"ip":"192.168.2.9","port":[410],"type":"pc","os":"winNew","version":227,"remark":"qwe","attacked":false},{"ip":"192.168.2.10","port":[136],"type":"server","os":"winOld","version":981,"remark":"qwe","attacked":false},{"ip":"192.168.2.11","port":[],"type":"pc","os":"winNew","version":647,"remark":"qwe","attacked":false},{"ip":"192.168.2.12","port":[722],"type":"server","os":"linux","version":427,"remark":"qwe","attacked":false},{"ip":"192.168.2.13","port":[248],"type":"pc","os":"linux","version":996,"remark":"qwe","attacked":true},{"ip":"192.168.2.14","port":[625],"type":"pc","os":"winOld","version":583,"remark":"qwe","attacked":false},{"ip":"192.168.2.15","port":[568],"type":"pc","os":"winOld","version":291,"remark":"qwe","attacked":true},{"ip":"192.168.2.16","port":[484],"type":"pc","os":"winNew","version":813,"remark":"qwe","attacked":false},{"ip":"192.168.2.17","port":[451],"type":"pc","os":"winOld","version":582,"remark":"qwe","attacked":false},{"ip":"192.168.2.18","port":[648],"type":"pc","os":"winOld","version":209,"remark":"qwe","attacked":false},{"ip":"192.168.2.19","port":[624],"type":"pc","os":"linux","version":687,"remark":"qwe","attacked":false},{"ip":"192.168.2.20","port":[826],"type":"pc","os":"winNew","version":630,"remark":"qwe","attacked":false},{"ip":"192.168.2.21","port":[872],"type":"server","os":"winOld","version":443,"remark":"qwe","attacked":true},{"ip":"192.168.2.22","port":[888],"type":"server","os":"linux","version":36,"remark":"qwe","attacked":false},{"ip":"192.168.2.23","port":[556],"type":"server","os":"linux","version":675,"remark":"qwe","attacked":false},{"ip":"192.168.2.24","port":[889],"type":"server","os":"linux","version":714,"remark":"qwe","attacked":false},{"ip":"192.168.2.25","port":[362],"type":"server","os":"winOld","version":737,"remark":"qwe","attacked":false},{"ip":"192.168.2.26","port":[794],"type":"pc","os":"winOld","version":588,"remark":"qwe","attacked":false},{"ip":"192.168.2.27","port":[],"type":"server","os":"winOld","version":357,"remark":"qwe","attacked":false},{"ip":"192.168.2.28","port":[624],"type":"server","os":"linux","version":173,"remark":"qwe","attacked":false},{"ip":"192.168.2.29","port":[431],"type":"server","os":"winNew","version":272,"remark":"qwe","attacked":false},{"ip":"192.168.2.30","port":[101],"type":"pc","os":"linux","version":206,"remark":"qwe","attacked":false},{"ip":"192.168.2.31","port":[462],"type":"server","os":"winNew","version":641,"remark":"qwe","attacked":false},{"ip":"192.168.2.32","port":[978],"type":"server","os":"winOld","version":441,"remark":"qwe","attacked":false},{"ip":"192.168.2.33","port":[454],"type":"pc","os":"linux","version":441,"remark":"qwe","attacked":false},{"ip":"192.168.2.34","port":[363],"type":"pc","os":"winNew","version":341,"remark":"qwe","attacked":false},{"ip":"192.168.2.35","port":[],"type":"server","os":"linux","version":592,"remark":"qwe","attacked":true},{"ip":"192.168.2.36","port":[],"type":"pc","os":"linux","version":998,"remark":"qwe","attacked":false},{"ip":"192.168.2.37","port":[384],"type":"server","os":"winNew","version":744,"remark":"qwe","attacked":false},{"ip":"192.168.2.38","port":[],"type":"pc","os":"winNew","version":787,"remark":"qwe","attacked":false},{"ip":"192.168.2.39","port":[],"type":"pc","os":"winOld","version":813,"remark":"qwe","attacked":false},{"ip":"192.168.2.40","port":[640],"type":"pc","os":"linux","version":10,"remark":"qwe","attacked":false},{"ip":"192.168.2.41","port":[820],"type":"pc","os":"winOld","version":162,"remark":"qwe","attacked":false},{"ip":"192.168.2.42","port":[969],"type":"server","os":"winOld","version":818,"remark":"qwe","attacked":false},{"ip":"192.168.2.43","port":[],"type":"pc","os":"winOld","version":716,"remark":"qwe","attacked":true},{"ip":"192.168.2.44","port":[],"type":"pc","os":"winNew","version":468,"remark":"qwe","attacked":false},{"ip":"192.168.2.45","port":[244],"type":"pc","os":"winOld","version":163,"remark":"qwe","attacked":true},{"ip":"192.168.2.46","port":[452],"type":"pc","os":"winOld","version":417,"remark":"qwe","attacked":false},{"ip":"192.168.2.47","port":[314],"type":"server","os":"winOld","version":121,"remark":"qwe","attacked":false},{"ip":"192.168.2.48","port":[384],"type":"server","os":"winOld","version":43,"remark":"qwe","attacked":false},{"ip":"192.168.2.49","port":[604],"type":"server","os":"linux","version":934,"remark":"qwe","attacked":true}]},{"ip":"192.168.3.1","devices":[{"ip":"192.168.3.2","port":[85],"type":"server","os":"winNew","version":403,"remark":"qwe","attacked":false},{"ip":"192.168.3.3","port":[],"type":"server","os":"linux","version":743,"remark":"qwe","attacked":false},{"ip":"192.168.3.4","port":[],"type":"server","os":"winNew","version":685,"remark":"qwe","attacked":false},{"ip":"192.168.3.5","port":[159],"type":"server","os":"winOld","version":384,"remark":"qwe","attacked":true},{"ip":"192.168.3.6","port":[31],"type":"server","os":"winNew","version":383,"remark":"qwe","attacked":false},{"ip":"192.168.3.7","port":[825],"type":"server","os":"linux","version":381,"remark":"qwe","attacked":false},{"ip":"192.168.3.8","port":[86],"type":"pc","os":"winOld","version":16,"remark":"qwe","attacked":false},{"ip":"192.168.3.9","port":[],"type":"pc","os":"winNew","version":796,"remark":"qwe","attacked":false},{"ip":"192.168.3.10","port":[],"type":"server","os":"winNew","version":310,"remark":"qwe","attacked":true},{"ip":"192.168.3.11","port":[938],"type":"pc","os":"linux","version":669,"remark":"qwe","attacked":true},{"ip":"192.168.3.12","port":[218],"type":"pc","os":"winOld","version":736,"remark":"qwe","attacked":false},{"ip":"192.168.3.13","port":[780],"type":"pc","os":"linux","version":608,"remark":"qwe","attacked":false},{"ip":"192.168.3.14","port":[282],"type":"pc","os":"linux","version":346,"remark":"qwe","attacked":false},{"ip":"192.168.3.15","port":[881],"type":"pc","os":"winNew","version":147,"remark":"qwe","attacked":false},{"ip":"192.168.3.16","port":[651],"type":"server","os":"winOld","version":169,"remark":"qwe","attacked":false},{"ip":"192.168.3.17","port":[195],"type":"pc","os":"winOld","version":443,"remark":"qwe","attacked":false},{"ip":"192.168.3.18","port":[613],"type":"pc","os":"linux","version":822,"remark":"qwe","attacked":false},{"ip":"192.168.3.19","port":[113],"type":"pc","os":"winNew","version":936,"remark":"qwe","attacked":true},{"ip":"192.168.3.20","port":[],"type":"server","os":"winOld","version":644,"remark":"qwe","attacked":false},{"ip":"192.168.3.21","port":[822],"type":"server","os":"winOld","version":531,"remark":"qwe","attacked":true},{"ip":"192.168.3.22","port":[437],"type":"server","os":"winOld","version":634,"remark":"qwe","attacked":false},{"ip":"192.168.3.23","port":[751],"type":"pc","os":"winNew","version":135,"remark":"qwe","attacked":false},{"ip":"192.168.3.24","port":[484],"type":"pc","os":"winNew","version":476,"remark":"qwe","attacked":true},{"ip":"192.168.3.25","port":[879],"type":"pc","os":"linux","version":593,"remark":"qwe","attacked":false},{"ip":"192.168.3.26","port":[986],"type":"server","os":"winOld","version":84,"remark":"qwe","attacked":false},{"ip":"192.168.3.27","port":[447],"type":"pc","os":"winOld","version":686,"remark":"qwe","attacked":false},{"ip":"192.168.3.28","port":[808],"type":"server","os":"winNew","version":529,"remark":"qwe","attacked":false},{"ip":"192.168.3.29","port":[936],"type":"server","os":"linux","version":434,"remark":"qwe","attacked":false},{"ip":"192.168.3.30","port":[754],"type":"pc","os":"linux","version":604,"remark":"qwe","attacked":true},{"ip":"192.168.3.31","port":[],"type":"server","os":"winOld","version":187,"remark":"qwe","attacked":true},{"ip":"192.168.3.32","port":[],"type":"server","os":"winNew","version":842,"remark":"qwe","attacked":false},{"ip":"192.168.3.33","port":[201],"type":"pc","os":"linux","version":29,"remark":"qwe","attacked":false},{"ip":"192.168.3.34","port":[697],"type":"server","os":"linux","version":818,"remark":"qwe","attacked":false},{"ip":"192.168.3.35","port":[938],"type":"pc","os":"winOld","version":466,"remark":"qwe","attacked":true},{"ip":"192.168.3.36","port":[311],"type":"server","os":"linux","version":397,"remark":"qwe","attacked":false},{"ip":"192.168.3.37","port":[355],"type":"server","os":"winNew","version":843,"remark":"qwe","attacked":true},{"ip":"192.168.3.38","port":[65],"type":"server","os":"winNew","version":918,"remark":"qwe","attacked":true},{"ip":"192.168.3.39","port":[647],"type":"server","os":"winOld","version":475,"remark":"qwe","attacked":false},{"ip":"192.168.3.40","port":[],"type":"pc","os":"linux","version":643,"remark":"qwe","attacked":false},{"ip":"192.168.3.41","port":[],"type":"server","os":"winNew","version":89,"remark":"qwe","attacked":false},{"ip":"192.168.3.42","port":[530],"type":"server","os":"linux","version":605,"remark":"qwe","attacked":false},{"ip":"192.168.3.43","port":[],"type":"pc","os":"linux","version":252,"remark":"qwe","attacked":false},{"ip":"192.168.3.44","port":[],"type":"pc","os":"winNew","version":872,"remark":"qwe","attacked":false},{"ip":"192.168.3.45","port":[919],"type":"pc","os":"winNew","version":668,"remark":"qwe","attacked":false},{"ip":"192.168.3.46","port":[270],"type":"server","os":"linux","version":942,"remark":"qwe","attacked":false},{"ip":"192.168.3.47","port":[47],"type":"server","os":"winOld","version":503,"remark":"qwe","attacked":true},{"ip":"192.168.3.48","port":[934],"type":"server","os":"winOld","version":237,"remark":"qwe","attacked":true},{"ip":"192.168.3.49","port":[],"type":"server","os":"linux","version":898,"remark":"qwe","attacked":false}]},{"ip":"192.168.4.1","devices":[{"ip":"192.168.4.2","port":[795],"type":"server","os":"linux","version":25,"remark":"qwe","attacked":false},{"ip":"192.168.4.3","port":[78],"type":"server","os":"linux","version":794,"remark":"qwe","attacked":true},{"ip":"192.168.4.4","port":[500],"type":"pc","os":"linux","version":778,"remark":"qwe","attacked":false},{"ip":"192.168.4.5","port":[453],"type":"pc","os":"winNew","version":581,"remark":"qwe","attacked":true},{"ip":"192.168.4.6","port":[525],"type":"server","os":"linux","version":477,"remark":"qwe","attacked":false},{"ip":"192.168.4.7","port":[281],"type":"pc","os":"linux","version":899,"remark":"qwe","attacked":false},{"ip":"192.168.4.8","port":[],"type":"pc","os":"winOld","version":149,"remark":"qwe","attacked":true},{"ip":"192.168.4.9","port":[971],"type":"server","os":"winNew","version":171,"remark":"qwe","attacked":true},{"ip":"192.168.4.10","port":[920],"type":"pc","os":"winNew","version":951,"remark":"qwe","attacked":false},{"ip":"192.168.4.11","port":[],"type":"server","os":"winNew","version":471,"remark":"qwe","attacked":false},{"ip":"192.168.4.12","port":[697],"type":"pc","os":"winOld","version":532,"remark":"qwe","attacked":true},{"ip":"192.168.4.13","port":[582],"type":"pc","os":"winOld","version":865,"remark":"qwe","attacked":true},{"ip":"192.168.4.14","port":[146],"type":"server","os":"winNew","version":980,"remark":"qwe","attacked":false},{"ip":"192.168.4.15","port":[730],"type":"server","os":"winNew","version":486,"remark":"qwe","attacked":true},{"ip":"192.168.4.16","port":[732],"type":"pc","os":"linux","version":881,"remark":"qwe","attacked":false},{"ip":"192.168.4.17","port":[310],"type":"server","os":"winNew","version":64,"remark":"qwe","attacked":true},{"ip":"192.168.4.18","port":[],"type":"server","os":"winNew","version":392,"remark":"qwe","attacked":false},{"ip":"192.168.4.19","port":[931],"type":"pc","os":"winOld","version":465,"remark":"qwe","attacked":true},{"ip":"192.168.4.20","port":[433],"type":"pc","os":"winNew","version":339,"remark":"qwe","attacked":false},{"ip":"192.168.4.21","port":[836],"type":"pc","os":"linux","version":61,"remark":"qwe","attacked":true},{"ip":"192.168.4.22","port":[186],"type":"pc","os":"winOld","version":596,"remark":"qwe","attacked":false},{"ip":"192.168.4.23","port":[949],"type":"pc","os":"winNew","version":316,"remark":"qwe","attacked":false},{"ip":"192.168.4.24","port":[],"type":"pc","os":"winNew","version":597,"remark":"qwe","attacked":true},{"ip":"192.168.4.25","port":[468],"type":"pc","os":"winOld","version":650,"remark":"qwe","attacked":false},{"ip":"192.168.4.26","port":[695],"type":"server","os":"linux","version":695,"remark":"qwe","attacked":true},{"ip":"192.168.4.27","port":[30],"type":"server","os":"winOld","version":273,"remark":"qwe","attacked":false},{"ip":"192.168.4.28","port":[847],"type":"pc","os":"winOld","version":101,"remark":"qwe","attacked":false},{"ip":"192.168.4.29","port":[849],"type":"pc","os":"winNew","version":961,"remark":"qwe","attacked":true},{"ip":"192.168.4.30","port":[625],"type":"server","os":"winNew","version":841,"remark":"qwe","attacked":false},{"ip":"192.168.4.31","port":[745],"type":"pc","os":"winOld","version":530,"remark":"qwe","attacked":false},{"ip":"192.168.4.32","port":[283],"type":"server","os":"linux","version":461,"remark":"qwe","attacked":false},{"ip":"192.168.4.33","port":[178],"type":"pc","os":"winNew","version":563,"remark":"qwe","attacked":false},{"ip":"192.168.4.34","port":[136],"type":"server","os":"winOld","version":17,"remark":"qwe","attacked":false},{"ip":"192.168.4.35","port":[120],"type":"pc","os":"linux","version":848,"remark":"qwe","attacked":false},{"ip":"192.168.4.36","port":[702],"type":"server","os":"winNew","version":440,"remark":"qwe","attacked":true},{"ip":"192.168.4.37","port":[975],"type":"pc","os":"winOld","version":77,"remark":"qwe","attacked":false},{"ip":"192.168.4.38","port":[358],"type":"pc","os":"winNew","version":430,"remark":"qwe","attacked":true},{"ip":"192.168.4.39","port":[826],"type":"server","os":"winNew","version":24,"remark":"qwe","attacked":false},{"ip":"192.168.4.40","port":[931],"type":"pc","os":"linux","version":270,"remark":"qwe","attacked":false},{"ip":"192.168.4.41","port":[158],"type":"server","os":"winOld","version":272,"remark":"qwe","attacked":false},{"ip":"192.168.4.42","port":[513],"type":"server","os":"winNew","version":716,"remark":"qwe","attacked":true},{"ip":"192.168.4.43","port":[],"type":"pc","os":"winNew","version":487,"remark":"qwe","attacked":false},{"ip":"192.168.4.44","port":[804],"type":"pc","os":"winOld","version":205,"remark":"qwe","attacked":false},{"ip":"192.168.4.45","port":[930],"type":"server","os":"winOld","version":55,"remark":"qwe","attacked":false},{"ip":"192.168.4.46","port":[],"type":"pc","os":"linux","version":888,"remark":"qwe","attacked":false},{"ip":"192.168.4.47","port":[910],"type":"server","os":"winNew","version":493,"remark":"qwe","attacked":false},{"ip":"192.168.4.48","port":[260],"type":"pc","os":"winNew","version":858,"remark":"qwe","attacked":true},{"ip":"192.168.4.49","port":[639],"type":"server","os":"winNew","version":627,"remark":"qwe","attacked":true}]},{"ip":"192.168.5.1","devices":[{"ip":"192.168.5.2","port":[952],"type":"pc","os":"linux","version":172,"remark":"qwe","attacked":false},{"ip":"192.168.5.3","port":[916],"type":"server","os":"winOld","version":154,"remark":"qwe","attacked":true},{"ip":"192.168.5.4","port":[257],"type":"pc","os":"winNew","version":62,"remark":"qwe","attacked":false},{"ip":"192.168.5.5","port":[891],"type":"server","os":"winNew","version":491,"remark":"qwe","attacked":false},{"ip":"192.168.5.6","port":[585],"type":"pc","os":"winOld","version":862,"remark":"qwe","attacked":false},{"ip":"192.168.5.7","port":[519],"type":"server","os":"winOld","version":802,"remark":"qwe","attacked":false},{"ip":"192.168.5.8","port":[154],"type":"pc","os":"winOld","version":137,"remark":"qwe","attacked":true},{"ip":"192.168.5.9","port":[838],"type":"pc","os":"linux","version":951,"remark":"qwe","attacked":false},{"ip":"192.168.5.10","port":[532],"type":"server","os":"winOld","version":237,"remark":"qwe","attacked":false},{"ip":"192.168.5.11","port":[473],"type":"pc","os":"winOld","version":665,"remark":"qwe","attacked":false},{"ip":"192.168.5.12","port":[173],"type":"pc","os":"winOld","version":579,"remark":"qwe","attacked":false},{"ip":"192.168.5.13","port":[168],"type":"pc","os":"winNew","version":469,"remark":"qwe","attacked":false},{"ip":"192.168.5.14","port":[147],"type":"server","os":"winNew","version":971,"remark":"qwe","attacked":false},{"ip":"192.168.5.15","port":[758],"type":"pc","os":"linux","version":896,"remark":"qwe","attacked":false},{"ip":"192.168.5.16","port":[575],"type":"pc","os":"linux","version":339,"remark":"qwe","attacked":false},{"ip":"192.168.5.17","port":[374],"type":"pc","os":"winNew","version":451,"remark":"qwe","attacked":false},{"ip":"192.168.5.18","port":[999],"type":"pc","os":"winNew","version":996,"remark":"qwe","attacked":true},{"ip":"192.168.5.19","port":[369],"type":"pc","os":"winNew","version":825,"remark":"qwe","attacked":false},{"ip":"192.168.5.20","port":[],"type":"pc","os":"linux","version":604,"remark":"qwe","attacked":false},{"ip":"192.168.5.21","port":[470],"type":"pc","os":"winOld","version":115,"remark":"qwe","attacked":true},{"ip":"192.168.5.22","port":[0],"type":"server","os":"winOld","version":537,"remark":"qwe","attacked":false},{"ip":"192.168.5.23","port":[689],"type":"pc","os":"linux","version":345,"remark":"qwe","attacked":false},{"ip":"192.168.5.24","port":[340],"type":"pc","os":"winOld","version":120,"remark":"qwe","attacked":false},{"ip":"192.168.5.25","port":[426],"type":"pc","os":"winNew","version":151,"remark":"qwe","attacked":false},{"ip":"192.168.5.26","port":[968],"type":"pc","os":"winOld","version":172,"remark":"qwe","attacked":false},{"ip":"192.168.5.27","port":[799],"type":"server","os":"linux","version":242,"remark":"qwe","attacked":false},{"ip":"192.168.5.28","port":[482],"type":"pc","os":"winOld","version":788,"remark":"qwe","attacked":false},{"ip":"192.168.5.29","port":[506],"type":"pc","os":"winOld","version":234,"remark":"qwe","attacked":false},{"ip":"192.168.5.30","port":[581],"type":"pc","os":"winOld","version":933,"remark":"qwe","attacked":false},{"ip":"192.168.5.31","port":[318],"type":"pc","os":"winNew","version":852,"remark":"qwe","attacked":false},{"ip":"192.168.5.32","port":[747],"type":"server","os":"winNew","version":772,"remark":"qwe","attacked":false},{"ip":"192.168.5.33","port":[623],"type":"server","os":"winOld","version":868,"remark":"qwe","attacked":false},{"ip":"192.168.5.34","port":[569],"type":"pc","os":"linux","version":858,"remark":"qwe","attacked":false},{"ip":"192.168.5.35","port":[846],"type":"server","os":"winNew","version":670,"remark":"qwe","attacked":true},{"ip":"192.168.5.36","port":[407],"type":"pc","os":"linux","version":641,"remark":"qwe","attacked":false},{"ip":"192.168.5.37","port":[343],"type":"pc","os":"winOld","version":291,"remark":"qwe","attacked":false},{"ip":"192.168.5.38","port":[65],"type":"server","os":"linux","version":891,"remark":"qwe","attacked":true},{"ip":"192.168.5.39","port":[558],"type":"pc","os":"winOld","version":160,"remark":"qwe","attacked":false},{"ip":"192.168.5.40","port":[546],"type":"server","os":"winNew","version":960,"remark":"qwe","attacked":false},{"ip":"192.168.5.41","port":[942],"type":"server","os":"winOld","version":212,"remark":"qwe","attacked":false},{"ip":"192.168.5.42","port":[884],"type":"server","os":"winOld","version":338,"remark":"qwe","attacked":true},{"ip":"192.168.5.43","port":[749],"type":"server","os":"winNew","version":636,"remark":"qwe","attacked":false},{"ip":"192.168.5.44","port":[],"type":"pc","os":"winNew","version":197,"remark":"qwe","attacked":false},{"ip":"192.168.5.45","port":[729],"type":"pc","os":"winOld","version":630,"remark":"qwe","attacked":false},{"ip":"192.168.5.46","port":[883],"type":"pc","os":"winOld","version":123,"remark":"qwe","attacked":false},{"ip":"192.168.5.47","port":[],"type":"pc","os":"winOld","version":61,"remark":"qwe","attacked":true},{"ip":"192.168.5.48","port":[882],"type":"server","os":"winOld","version":506,"remark":"qwe","attacked":false},{"ip":"192.168.5.49","port":[383],"type":"pc","os":"linux","version":393,"remark":"qwe","attacked":false}]},{"ip":"192.168.6.1","devices":[{"ip":"192.168.6.2","port":[360],"type":"pc","os":"winOld","version":999,"remark":"qwe","attacked":false},{"ip":"192.168.6.3","port":[358],"type":"pc","os":"linux","version":760,"remark":"qwe","attacked":false},{"ip":"192.168.6.4","port":[],"type":"server","os":"linux","version":300,"remark":"qwe","attacked":false},{"ip":"192.168.6.5","port":[791],"type":"server","os":"linux","version":677,"remark":"qwe","attacked":false},{"ip":"192.168.6.6","port":[492],"type":"pc","os":"linux","version":826,"remark":"qwe","attacked":false},{"ip":"192.168.6.7","port":[],"type":"server","os":"winNew","version":174,"remark":"qwe","attacked":false},{"ip":"192.168.6.8","port":[143],"type":"pc","os":"linux","version":505,"remark":"qwe","attacked":false},{"ip":"192.168.6.9","port":[412],"type":"server","os":"linux","version":501,"remark":"qwe","attacked":false},{"ip":"192.168.6.10","port":[780],"type":"server","os":"linux","version":480,"remark":"qwe","attacked":false},{"ip":"192.168.6.11","port":[294],"type":"pc","os":"linux","version":539,"remark":"qwe","attacked":false},{"ip":"192.168.6.12","port":[370],"type":"pc","os":"winOld","version":53,"remark":"qwe","attacked":false},{"ip":"192.168.6.13","port":[304],"type":"pc","os":"winNew","version":187,"remark":"qwe","attacked":true},{"ip":"192.168.6.14","port":[915],"type":"pc","os":"winNew","version":507,"remark":"qwe","attacked":true},{"ip":"192.168.6.15","port":[19],"type":"pc","os":"linux","version":904,"remark":"qwe","attacked":false},{"ip":"192.168.6.16","port":[],"type":"server","os":"winOld","version":520,"remark":"qwe","attacked":false},{"ip":"192.168.6.17","port":[32],"type":"server","os":"linux","version":472,"remark":"qwe","attacked":false},{"ip":"192.168.6.18","port":[],"type":"server","os":"winOld","version":306,"remark":"qwe","attacked":false},{"ip":"192.168.6.19","port":[49],"type":"server","os":"linux","version":818,"remark":"qwe","attacked":false},{"ip":"192.168.6.20","port":[720],"type":"server","os":"linux","version":995,"remark":"qwe","attacked":false},{"ip":"192.168.6.21","port":[306],"type":"server","os":"linux","version":168,"remark":"qwe","attacked":true},{"ip":"192.168.6.22","port":[988],"type":"pc","os":"winOld","version":789,"remark":"qwe","attacked":false},{"ip":"192.168.6.23","port":[643],"type":"server","os":"winNew","version":308,"remark":"qwe","attacked":false},{"ip":"192.168.6.24","port":[],"type":"pc","os":"winOld","version":832,"remark":"qwe","attacked":true},{"ip":"192.168.6.25","port":[7],"type":"server","os":"linux","version":978,"remark":"qwe","attacked":true},{"ip":"192.168.6.26","port":[533],"type":"server","os":"linux","version":318,"remark":"qwe","attacked":true},{"ip":"192.168.6.27","port":[731],"type":"server","os":"linux","version":421,"remark":"qwe","attacked":false},{"ip":"192.168.6.28","port":[224],"type":"server","os":"winNew","version":633,"remark":"qwe","attacked":false},{"ip":"192.168.6.29","port":[484],"type":"server","os":"winOld","version":333,"remark":"qwe","attacked":false},{"ip":"192.168.6.30","port":[],"type":"server","os":"winNew","version":222,"remark":"qwe","attacked":true},{"ip":"192.168.6.31","port":[55],"type":"server","os":"winNew","version":593,"remark":"qwe","attacked":true},{"ip":"192.168.6.32","port":[751],"type":"server","os":"winOld","version":678,"remark":"qwe","attacked":false},{"ip":"192.168.6.33","port":[548],"type":"server","os":"winOld","version":554,"remark":"qwe","attacked":false},{"ip":"192.168.6.34","port":[841],"type":"pc","os":"winNew","version":635,"remark":"qwe","attacked":false},{"ip":"192.168.6.35","port":[],"type":"pc","os":"winNew","version":549,"remark":"qwe","attacked":false},{"ip":"192.168.6.36","port":[308],"type":"pc","os":"linux","version":871,"remark":"qwe","attacked":false},{"ip":"192.168.6.37","port":[770],"type":"pc","os":"winOld","version":57,"remark":"qwe","attacked":false},{"ip":"192.168.6.38","port":[389],"type":"pc","os":"winOld","version":877,"remark":"qwe","attacked":false},{"ip":"192.168.6.39","port":[454],"type":"server","os":"winNew","version":360,"remark":"qwe","attacked":true},{"ip":"192.168.6.40","port":[775],"type":"server","os":"winNew","version":228,"remark":"qwe","attacked":false},{"ip":"192.168.6.41","port":[633],"type":"server","os":"linux","version":656,"remark":"qwe","attacked":false},{"ip":"192.168.6.42","port":[548],"type":"pc","os":"winOld","version":241,"remark":"qwe","attacked":false},{"ip":"192.168.6.43","port":[],"type":"pc","os":"winOld","version":336,"remark":"qwe","attacked":true},{"ip":"192.168.6.44","port":[346],"type":"server","os":"winOld","version":282,"remark":"qwe","attacked":false},{"ip":"192.168.6.45","port":[],"type":"pc","os":"linux","version":517,"remark":"qwe","attacked":false},{"ip":"192.168.6.46","port":[14],"type":"server","os":"winNew","version":895,"remark":"qwe","attacked":false},{"ip":"192.168.6.47","port":[529],"type":"pc","os":"linux","version":158,"remark":"qwe","attacked":false},{"ip":"192.168.6.48","port":[696],"type":"server","os":"winOld","version":784,"remark":"qwe","attacked":false},{"ip":"192.168.6.49","port":[857],"type":"server","os":"winNew","version":634,"remark":"qwe","attacked":true}]},{"ip":"192.168.7.1","devices":[{"ip":"192.168.7.2","port":[948],"type":"pc","os":"winNew","version":692,"remark":"qwe","attacked":true},{"ip":"192.168.7.3","port":[],"type":"server","os":"linux","version":528,"remark":"qwe","attacked":false},{"ip":"192.168.7.4","port":[473],"type":"pc","os":"linux","version":558,"remark":"qwe","attacked":false},{"ip":"192.168.7.5","port":[],"type":"server","os":"winNew","version":575,"remark":"qwe","attacked":false},{"ip":"192.168.7.6","port":[58],"type":"server","os":"linux","version":796,"remark":"qwe","attacked":false},{"ip":"192.168.7.7","port":[527],"type":"pc","os":"winNew","version":349,"remark":"qwe","attacked":false},{"ip":"192.168.7.8","port":[170],"type":"pc","os":"winNew","version":21,"remark":"qwe","attacked":true},{"ip":"192.168.7.9","port":[195],"type":"server","os":"winOld","version":54,"remark":"qwe","attacked":false},{"ip":"192.168.7.10","port":[573],"type":"pc","os":"winOld","version":15,"remark":"qwe","attacked":false},{"ip":"192.168.7.11","port":[775],"type":"pc","os":"winNew","version":70,"remark":"qwe","attacked":false},{"ip":"192.168.7.12","port":[],"type":"server","os":"winOld","version":191,"remark":"qwe","attacked":false},{"ip":"192.168.7.13","port":[632],"type":"server","os":"linux","version":867,"remark":"qwe","attacked":false},{"ip":"192.168.7.14","port":[],"type":"server","os":"winOld","version":887,"remark":"qwe","attacked":false},{"ip":"192.168.7.15","port":[],"type":"server","os":"winNew","version":679,"remark":"qwe","attacked":false},{"ip":"192.168.7.16","port":[870],"type":"server","os":"linux","version":14,"remark":"qwe","attacked":false},{"ip":"192.168.7.17","port":[267],"type":"pc","os":"linux","version":951,"remark":"qwe","attacked":false},{"ip":"192.168.7.18","port":[],"type":"pc","os":"winOld","version":219,"remark":"qwe","attacked":true},{"ip":"192.168.7.19","port":[495],"type":"pc","os":"winOld","version":798,"remark":"qwe","attacked":false},{"ip":"192.168.7.20","port":[293],"type":"pc","os":"winOld","version":637,"remark":"qwe","attacked":false},{"ip":"192.168.7.21","port":[282],"type":"pc","os":"winNew","version":879,"remark":"qwe","attacked":false},{"ip":"192.168.7.22","port":[],"type":"pc","os":"winNew","version":7,"remark":"qwe","attacked":false},{"ip":"192.168.7.23","port":[421],"type":"pc","os":"linux","version":394,"remark":"qwe","attacked":false},{"ip":"192.168.7.24","port":[415],"type":"server","os":"winOld","version":543,"remark":"qwe","attacked":false},{"ip":"192.168.7.25","port":[574],"type":"server","os":"winOld","version":536,"remark":"qwe","attacked":true},{"ip":"192.168.7.26","port":[524],"type":"server","os":"winNew","version":331,"remark":"qwe","attacked":false},{"ip":"192.168.7.27","port":[],"type":"pc","os":"winOld","version":358,"remark":"qwe","attacked":false},{"ip":"192.168.7.28","port":[645],"type":"pc","os":"winNew","version":656,"remark":"qwe","attacked":false},{"ip":"192.168.7.29","port":[770],"type":"pc","os":"linux","version":425,"remark":"qwe","attacked":false},{"ip":"192.168.7.30","port":[419],"type":"server","os":"winNew","version":731,"remark":"qwe","attacked":false},{"ip":"192.168.7.31","port":[890],"type":"pc","os":"winOld","version":449,"remark":"qwe","attacked":true},{"ip":"192.168.7.32","port":[719],"type":"server","os":"winOld","version":101,"remark":"qwe","attacked":false},{"ip":"192.168.7.33","port":[673],"type":"server","os":"winOld","version":268,"remark":"qwe","attacked":false},{"ip":"192.168.7.34","port":[945],"type":"server","os":"linux","version":847,"remark":"qwe","attacked":false},{"ip":"192.168.7.35","port":[965],"type":"pc","os":"linux","version":151,"remark":"qwe","attacked":false},{"ip":"192.168.7.36","port":[114],"type":"pc","os":"linux","version":742,"remark":"qwe","attacked":false},{"ip":"192.168.7.37","port":[204],"type":"pc","os":"winOld","version":53,"remark":"qwe","attacked":false},{"ip":"192.168.7.38","port":[],"type":"server","os":"winOld","version":421,"remark":"qwe","attacked":false},{"ip":"192.168.7.39","port":[],"type":"server","os":"winNew","version":350,"remark":"qwe","attacked":false},{"ip":"192.168.7.40","port":[],"type":"pc","os":"winOld","version":854,"remark":"qwe","attacked":true},{"ip":"192.168.7.41","port":[],"type":"server","os":"linux","version":798,"remark":"qwe","attacked":false},{"ip":"192.168.7.42","port":[163],"type":"server","os":"winOld","version":506,"remark":"qwe","attacked":true},{"ip":"192.168.7.43","port":[748],"type":"pc","os":"winNew","version":175,"remark":"qwe","attacked":false},{"ip":"192.168.7.44","port":[462],"type":"server","os":"linux","version":972,"remark":"qwe","attacked":false},{"ip":"192.168.7.45","port":[247],"type":"server","os":"winNew","version":934,"remark":"qwe","attacked":false},{"ip":"192.168.7.46","port":[466],"type":"server","os":"linux","version":438,"remark":"qwe","attacked":false},{"ip":"192.168.7.47","port":[411],"type":"server","os":"linux","version":267,"remark":"qwe","attacked":false},{"ip":"192.168.7.48","port":[924],"type":"server","os":"winOld","version":753,"remark":"qwe","attacked":false},{"ip":"192.168.7.49","port":[533],"type":"pc","os":"winOld","version":846,"remark":"qwe","attacked":false}]},{"ip":"192.168.8.1","devices":[{"ip":"192.168.8.2","port":[797],"type":"server","os":"winNew","version":339,"remark":"qwe","attacked":false},{"ip":"192.168.8.3","port":[645],"type":"server","os":"winNew","version":801,"remark":"qwe","attacked":false},{"ip":"192.168.8.4","port":[626],"type":"pc","os":"winNew","version":648,"remark":"qwe","attacked":false},{"ip":"192.168.8.5","port":[],"type":"pc","os":"linux","version":801,"remark":"qwe","attacked":true},{"ip":"192.168.8.6","port":[750],"type":"server","os":"winNew","version":934,"remark":"qwe","attacked":false},{"ip":"192.168.8.7","port":[751],"type":"pc","os":"linux","version":95,"remark":"qwe","attacked":false},{"ip":"192.168.8.8","port":[459],"type":"server","os":"linux","version":379,"remark":"qwe","attacked":false},{"ip":"192.168.8.9","port":[188],"type":"pc","os":"linux","version":352,"remark":"qwe","attacked":false},{"ip":"192.168.8.10","port":[414],"type":"server","os":"winNew","version":716,"remark":"qwe","attacked":false},{"ip":"192.168.8.11","port":[517],"type":"pc","os":"winNew","version":908,"remark":"qwe","attacked":false},{"ip":"192.168.8.12","port":[971],"type":"pc","os":"winOld","version":467,"remark":"qwe","attacked":false},{"ip":"192.168.8.13","port":[973],"type":"server","os":"linux","version":642,"remark":"qwe","attacked":false},{"ip":"192.168.8.14","port":[611],"type":"server","os":"winOld","version":726,"remark":"qwe","attacked":false},{"ip":"192.168.8.15","port":[725],"type":"pc","os":"winOld","version":786,"remark":"qwe","attacked":false},{"ip":"192.168.8.16","port":[],"type":"pc","os":"winNew","version":865,"remark":"qwe","attacked":false},{"ip":"192.168.8.17","port":[696],"type":"pc","os":"winNew","version":578,"remark":"qwe","attacked":false},{"ip":"192.168.8.18","port":[535],"type":"server","os":"winNew","version":617,"remark":"qwe","attacked":false},{"ip":"192.168.8.19","port":[996],"type":"pc","os":"winOld","version":879,"remark":"qwe","attacked":true},{"ip":"192.168.8.20","port":[677],"type":"pc","os":"linux","version":866,"remark":"qwe","attacked":false},{"ip":"192.168.8.21","port":[99],"type":"server","os":"linux","version":819,"remark":"qwe","attacked":true},{"ip":"192.168.8.22","port":[123],"type":"pc","os":"winNew","version":205,"remark":"qwe","attacked":false},{"ip":"192.168.8.23","port":[494],"type":"pc","os":"winOld","version":82,"remark":"qwe","attacked":true},{"ip":"192.168.8.24","port":[589],"type":"server","os":"winNew","version":227,"remark":"qwe","attacked":false},{"ip":"192.168.8.25","port":[691],"type":"server","os":"linux","version":529,"remark":"qwe","attacked":false},{"ip":"192.168.8.26","port":[706],"type":"server","os":"winNew","version":603,"remark":"qwe","attacked":false},{"ip":"192.168.8.27","port":[628],"type":"server","os":"linux","version":421,"remark":"qwe","attacked":false},{"ip":"192.168.8.28","port":[],"type":"server","os":"winOld","version":337,"remark":"qwe","attacked":false},{"ip":"192.168.8.29","port":[40],"type":"server","os":"linux","version":49,"remark":"qwe","attacked":false},{"ip":"192.168.8.30","port":[820],"type":"server","os":"winOld","version":41,"remark":"qwe","attacked":false},{"ip":"192.168.8.31","port":[329],"type":"server","os":"winOld","version":582,"remark":"qwe","attacked":false},{"ip":"192.168.8.32","port":[],"type":"pc","os":"winOld","version":802,"remark":"qwe","attacked":true},{"ip":"192.168.8.33","port":[653],"type":"pc","os":"winOld","version":453,"remark":"qwe","attacked":false},{"ip":"192.168.8.34","port":[823],"type":"server","os":"winNew","version":817,"remark":"qwe","attacked":true},{"ip":"192.168.8.35","port":[56],"type":"server","os":"linux","version":836,"remark":"qwe","attacked":false},{"ip":"192.168.8.36","port":[],"type":"pc","os":"winOld","version":711,"remark":"qwe","attacked":true},{"ip":"192.168.8.37","port":[],"type":"pc","os":"linux","version":428,"remark":"qwe","attacked":true},{"ip":"192.168.8.38","port":[622],"type":"server","os":"linux","version":769,"remark":"qwe","attacked":false},{"ip":"192.168.8.39","port":[],"type":"server","os":"winOld","version":120,"remark":"qwe","attacked":false},{"ip":"192.168.8.40","port":[394],"type":"server","os":"winOld","version":841,"remark":"qwe","attacked":false},{"ip":"192.168.8.41","port":[],"type":"server","os":"winOld","version":736,"remark":"qwe","attacked":false},{"ip":"192.168.8.42","port":[163],"type":"pc","os":"linux","version":868,"remark":"qwe","attacked":true},{"ip":"192.168.8.43","port":[66],"type":"server","os":"winOld","version":300,"remark":"qwe","attacked":false},{"ip":"192.168.8.44","port":[769],"type":"pc","os":"winOld","version":790,"remark":"qwe","attacked":false},{"ip":"192.168.8.45","port":[626],"type":"server","os":"winOld","version":506,"remark":"qwe","attacked":true},{"ip":"192.168.8.46","port":[655],"type":"server","os":"winOld","version":647,"remark":"qwe","attacked":false},{"ip":"192.168.8.47","port":[732],"type":"pc","os":"linux","version":138,"remark":"qwe","attacked":false},{"ip":"192.168.8.48","port":[975],"type":"server","os":"linux","version":45,"remark":"qwe","attacked":false},{"ip":"192.168.8.49","port":[778],"type":"pc","os":"linux","version":796,"remark":"qwe","attacked":false}]},{"ip":"192.168.9.1","devices":[{"ip":"192.168.9.2","port":[104],"type":"pc","os":"winOld","version":945,"remark":"qwe","attacked":false},{"ip":"192.168.9.3","port":[],"type":"pc","os":"winNew","version":469,"remark":"qwe","attacked":false},{"ip":"192.168.9.4","port":[951],"type":"server","os":"linux","version":76,"remark":"qwe","attacked":false},{"ip":"192.168.9.5","port":[],"type":"server","os":"winOld","version":540,"remark":"qwe","attacked":true},{"ip":"192.168.9.6","port":[378],"type":"server","os":"winNew","version":841,"remark":"qwe","attacked":false},{"ip":"192.168.9.7","port":[82],"type":"server","os":"winNew","version":341,"remark":"qwe","attacked":false},{"ip":"192.168.9.8","port":[157],"type":"server","os":"linux","version":191,"remark":"qwe","attacked":false},{"ip":"192.168.9.9","port":[936],"type":"pc","os":"linux","version":188,"remark":"qwe","attacked":false},{"ip":"192.168.9.10","port":[466],"type":"server","os":"linux","version":746,"remark":"qwe","attacked":false},{"ip":"192.168.9.11","port":[],"type":"server","os":"winOld","version":478,"remark":"qwe","attacked":false},{"ip":"192.168.9.12","port":[],"type":"pc","os":"winOld","version":371,"remark":"qwe","attacked":false},{"ip":"192.168.9.13","port":[],"type":"server","os":"linux","version":495,"remark":"qwe","attacked":false},{"ip":"192.168.9.14","port":[],"type":"pc","os":"linux","version":73,"remark":"qwe","attacked":false},{"ip":"192.168.9.15","port":[371],"type":"server","os":"winNew","version":882,"remark":"qwe","attacked":true},{"ip":"192.168.9.16","port":[173],"type":"server","os":"winOld","version":401,"remark":"qwe","attacked":false},{"ip":"192.168.9.17","port":[604],"type":"pc","os":"linux","version":112,"remark":"qwe","attacked":false},{"ip":"192.168.9.18","port":[804],"type":"server","os":"winNew","version":229,"remark":"qwe","attacked":false},{"ip":"192.168.9.19","port":[753],"type":"server","os":"winNew","version":448,"remark":"qwe","attacked":false},{"ip":"192.168.9.20","port":[341],"type":"pc","os":"winOld","version":821,"remark":"qwe","attacked":true},{"ip":"192.168.9.21","port":[70],"type":"server","os":"linux","version":311,"remark":"qwe","attacked":false},{"ip":"192.168.9.22","port":[614],"type":"server","os":"winNew","version":301,"remark":"qwe","attacked":true},{"ip":"192.168.9.23","port":[797],"type":"server","os":"linux","version":635,"remark":"qwe","attacked":true},{"ip":"192.168.9.24","port":[637],"type":"pc","os":"linux","version":480,"remark":"qwe","attacked":false},{"ip":"192.168.9.25","port":[256],"type":"server","os":"winOld","version":532,"remark":"qwe","attacked":false},{"ip":"192.168.9.26","port":[82],"type":"pc","os":"linux","version":366,"remark":"qwe","attacked":false},{"ip":"192.168.9.27","port":[224],"type":"pc","os":"linux","version":692,"remark":"qwe","attacked":true},{"ip":"192.168.9.28","port":[790],"type":"pc","os":"linux","version":804,"remark":"qwe","attacked":false},{"ip":"192.168.9.29","port":[357],"type":"pc","os":"linux","version":237,"remark":"qwe","attacked":false},{"ip":"192.168.9.30","port":[],"type":"server","os":"winNew","version":686,"remark":"qwe","attacked":false},{"ip":"192.168.9.31","port":[15],"type":"pc","os":"winNew","version":829,"remark":"qwe","attacked":true},{"ip":"192.168.9.32","port":[773],"type":"pc","os":"winNew","version":259,"remark":"qwe","attacked":false},{"ip":"192.168.9.33","port":[137],"type":"pc","os":"winOld","version":747,"remark":"qwe","attacked":false},{"ip":"192.168.9.34","port":[999],"type":"pc","os":"linux","version":981,"remark":"qwe","attacked":false},{"ip":"192.168.9.35","port":[],"type":"pc","os":"linux","version":371,"remark":"qwe","attacked":false},{"ip":"192.168.9.36","port":[],"type":"pc","os":"linux","version":101,"remark":"qwe","attacked":false},{"ip":"192.168.9.37","port":[303],"type":"server","os":"linux","version":644,"remark":"qwe","attacked":false},{"ip":"192.168.9.38","port":[],"type":"server","os":"winNew","version":374,"remark":"qwe","attacked":false},{"ip":"192.168.9.39","port":[],"type":"pc","os":"winOld","version":993,"remark":"qwe","attacked":false},{"ip":"192.168.9.40","port":[],"type":"pc","os":"winNew","version":853,"remark":"qwe","attacked":false},{"ip":"192.168.9.41","port":[119],"type":"pc","os":"linux","version":535,"remark":"qwe","attacked":false},{"ip":"192.168.9.42","port":[350],"type":"pc","os":"winOld","version":402,"remark":"qwe","attacked":false},{"ip":"192.168.9.43","port":[841],"type":"pc","os":"winOld","version":55,"remark":"qwe","attacked":true},{"ip":"192.168.9.44","port":[879],"type":"server","os":"linux","version":282,"remark":"qwe","attacked":false},{"ip":"192.168.9.45","port":[],"type":"server","os":"winNew","version":173,"remark":"qwe","attacked":false},{"ip":"192.168.9.46","port":[499],"type":"pc","os":"winNew","version":280,"remark":"qwe","attacked":false},{"ip":"192.168.9.47","port":[57],"type":"server","os":"linux","version":331,"remark":"qwe","attacked":false},{"ip":"192.168.9.48","port":[567],"type":"pc","os":"winOld","version":368,"remark":"qwe","attacked":false},{"ip":"192.168.9.49","port":[],"type":"pc","os":"linux","version":249,"remark":"qwe","attacked":false}]}]*/

        let nodes = (() => {
          let arr = [{
            name: ' ',
            symbolSize: 1,
            label: {
              show: false
            }
          }];
          data.forEach(i => {
            arr.push({
              name: i.ip,
              label: {
                show: true,
                fontWeight: 'bold'
              },
              symbolSize: 12,
              symbol: 'path://M878.942 556.1h-725.014c-43.586 0-79.328 35.742-79.328 79.328v161.614c0 43.586 35.742 79.328 79.328 79.328h725.014c43.586 0 79.328-35.742 79.328-79.328v-161.742c0-43.586-35.742-79.2-79.328-79.2zM239.3 758.342c-24.042 0-43.586-18.9-43.586-42.3s19.542-42.3 43.586-42.3 43.586 18.9 43.586 42.3c0.128 23.4-19.414 42.3-43.586 42.3zM380.214 758.342c-24.042 0-43.586-18.9-43.586-42.3s19.542-42.3 43.586-42.3 43.586 18.9 43.586 42.3-19.414 42.3-43.586 42.3zM823.142 341.258c1.286-2.828 1.928-5.914 1.928-9.258v-218.828c0-12.472-10.158-22.628-22.628-22.628s-22.628 10.158-22.628 22.628v211.5h-551.314l-114.428 194.658h813.858l-104.786-178.072z',
              itemStyle: {
                color: '#999'
              }
            })

          })
          return arr;
        })()
        let links = (() => {
          let arr = [];
          data.forEach((i, index) => {
            arr.push({
              source: ' ',
              target: i.ip,
              lineStyle: {
                width: 2
              },
            })
          })
          return arr;
        })()

        this.treeData = (() => {
          let arr = [{
            id: 1,
            label: 'root',
            children: []
          }];
          data.forEach((i, index1) => {
            arr[0].children.push({
              id: index1 + '-start',
              label: i.ip,
              children: (() => {
                let r = []
                i.devices.forEach((j, index2) => {
                  r.push({
                    id: index1 + '-' + index2,
                    ip: j.ip,
                    label: (() => {
                      let str = j.ip;
                      if(j.port.length > 0) {
                        str += ':'
                      }
                      j.port.forEach((port, index) => {
                        if(index === j.port.length - 1) {
                          str += port;
                        } else {
                          str += (port + ',')
                        }
                      })
                      return str;
                    })(),
                    type: j.type,
                    port: j.port,
                    os: j.os,
                    version: j.version,
                    remark: j.remark,
                    attacked: j.attacked
                  })
                })
                return r;
              })()
            })
          })
          return arr;
        })()
        this.topoOption.series[0].data = nodes;
        this.topoOption.series[0].links = links;
        this.myChart = echarts.init(document.getElementById('chart'));
        this.myChart.setOption(_this.topoOption);
        this.myChart.on('click', params => {
          if (params.componentType === 'series' && params.seriesType === 'graph' && params.dataType === 'node' && params.data.ip) {
            _this.showInfo(params.data)
          }
        })
      },
      showEdit(info) {
        this.edit.show = true;
        this.edit.title = info.ip;
        this.edit.port = info.port;
        this.edit.remark = info.remark;
        this.edit.remarkOri = info.remark;
      },
      updateIPRemark() {
        let _this = this;
        if(this.edit.remark !== this.edit.remarkOri) {
          axios.post('/updateIPRemark', {
//          axios.post('http://localhost:3000/updateIPRemark', {
            id: _this.id,
            ip: _this.edit.title,
            remark: _this.edit.remark
          }).then((res) => {
            if(res.data.result === 'success') {
              _this.$message('修改成功');
              _this.edit.show = false;
              _this.deviceInfo.remark = _this.edit.remark;

              // 修改目录树
              _this.treeData[0].children.forEach(j => {
                j.children.forEach(device => {
                  if(device.ip === _this.edit.title) {
                    device.remark = _this.edit.remark;
                  }
                })
              })

              // 修改节点
              _this.topoOption.series[0].data.forEach(j => {
                j.children.forEach(device => {
                  if(device.ip === _this.edit.title) {
                    device.remark = _this.edit.remark;
                  }
                })
              })
            } else {
              _this.$message(res.data.msg)
            }
          }).catch((error) => {
            console.log(error)
          });
        } else {
          this.edit.show = false;
        }

      }
    },
    computed: {
      showUpload() {
        return this.topo.length === 0;
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.setCheckedKeys([]);
        this.$refs.tree.filter(val);
      }
    },
    mounted() {
      if(this.id){
        this.getTopo()
      }
//      this.init()
    }
  }
</script>

<style scoped lang="scss">
  .topo-wrap {
    position: relative;
    overflow: hidden;

    .topo-container {
      position: relative;

      #tree {
        padding: 10px;
        height: 760px;

        box-shadow: 0 3px 10px #ccc;
        background: #fff;

        position: absolute;
        left: 10px;
        z-index: 2;

        overflow: auto;
      }

      #chart {
        width: 1300px;
        height: 800px;
        margin: 0 auto;
      }

      .topo-config {
        width: 320px;
        height: 760px;
        padding: 10px;

        box-shadow: 0 3px 10px #ccc;
        background: #fff;

        border-radius: 5px;
        /*border: 1px solid #ccc;*/

        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;

        transition: right ease 1s;

        .btn-clear-wrap {
          text-align: right;
        }

        .table-wrap {
          width: 320px;
          height: 575px;
          overflow: auto;
        }

        .btn-toggle {
          margin-top: -28px;

          position: absolute;
          top: 50%;
          left: -55px;

          line-height: 3em;
        }
      }
    }

    .btn-wrap {
      margin: 20px auto;
      padding: 0 20px;

      display: flex;
      justify-content: space-between;
    }


  }


</style>

<style>
  #tree > .el-tree > .el-tree-node > .el-tree-node__content > .el-checkbox {
    display: none
  }

  #tree .el-tree-node__children .el-tree-node__children .el-tree-node__content .el-checkbox {
    display: none
  }

  #tree .el-tree-node__children .el-tree-node__children .el-tree-node__content .el-tree-node__label {
    margin-left: 20px
  }
</style>
