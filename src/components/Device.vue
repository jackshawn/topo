<template>
  <div :class="['device', index % 2 == 1 ? 'device-bottom' : '', info.attacked ? 'device-attacked' : '']" :style="{left: (index + 1) * 100 + 'px'}">
    <div class="device-container">
      <div class="device-logo">
        <Icon class="device-type" :icon="info.type"></Icon>
        <Icon class="device-os" :icon="info.os"></Icon>
        <span class="device-version">{{info.version}}</span>

      </div>
      <div class="device-info">
        <div class="device-ip">IP:{{info.ip}}</div>
        <div class="device-port">PORT:<span
          @click="add(info.ip, item)"
          v-for="(item, index) in info.port">{{item}}{{index == info.port.length - 1 ? '' : ','}}</span></div>
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
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  $normal: #409eff;
  $attacked: #f56b6b;

  .device {
    width: 2px;
    height: 40px;
    background: $normal;

    position: absolute;
    top: -40px;
    left: 100px;

    .device-container {

      position: absolute;
      top: -110px;
      transform: translateX(-50%);
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
          width: 22px;
          height: 22px;

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
        font-size: 12px;
        line-height: 1.5em;
        padding: 5px 15px;

        .device-ip {
        }

        .device-port span {
          cursor: pointer;
          &:hover {
            text-decoration: underline;
          }
        }
      }

    }
  }

  .device-bottom {
    top: 0;

    .device-container {top: 42px;}
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
