<template>
  <div :class="['device', info.attacked ? 'device-attacked' : '']">
    <div class="device-container">
      <div class="device-logo">
        <Icon class="device-type" :icon="info.type"></Icon>
        <Icon class="device-os" :icon="info.os"></Icon>
        <span class="device-version">{{info.version}}</span>

      </div>
      <div class="device-info">
        <div class="device-ip">IP:{{info.ip}}</div>
        <div class="device-port" v-show="info.port.length > 0">PORT:<span
          @click="add(info.ip, item)"
          v-for="(item, index) in info.port">{{item}}{{index == info.port.length - 1 ? '' : ','}}</span></div>
        <div class="device-remark">{{info.remark}} <i class="el-icon-edit" @click="toShowEdit(info)"></i></div>
      </div>

    </div>
  </div>
</template>

<script>
  import Icon from './Icon.vue';
  export default {
    name: 'device',
    props: {
      info: Object,
      index: Number
    },
    components: {
      Icon
    },
    data () {
      return {}
    },
    methods: {
      add(ip, port) {
        this.$emit('add', ip, port)
      },
      toShowEdit(info) {
        this.$emit('showEdit', info)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  $normal: #409eff;
  $attacked: #f56b6b;

  .device {
    .device-container {


      border: 1px solid $normal;
      border-radius: 4px;
      background: #fff;

      .device-logo {
        height: 50px;
        padding: 5px 15px;
        display: flex;
        justify-content: center;
        align-items: center;

        // device logo
        .device-type {
          height: 50px;
          cursor: pointer;
          fill: $normal;

          margin-right: 10px;
        }

        // os logo
        .device-os {
          width: 32px;
          height: 32px;

          fill: $normal
        }

        .device-version {
          display: inline-block;
          height: 22px;
          line-height: 26px;

          color: $normal;
        }
      }

      .device-info {

        background: $normal;
        color: #fff;
        font-size: 14px;
        line-height: 1.5em;
        padding: 5px 15px;

        .device-port span {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }

        .el-icon-edit {cursor: pointer}
      }

    }
  }

  .device-attacked {
    .device-container {
      border: 1px solid $attacked;

      .device-logo {
        .device-type {fill: $attacked}
        .device-os {fill: $attacked}
        .device-version {color: $attacked}
      }

      .device-info {
        background: $attacked;
      }
    }

  }
</style>
