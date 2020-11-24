<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  data() {
    return {
      locale: zhCN
    }
  },
  mounted() {}
}
</script>
<style>
#app {
  height: 100%;
}
.tips:before {
  display: inline-block;
  margin-right: 4px;
  content: '*';
  font-family: SimSun;
  line-height: 1;
  font-size: 14px;
  color: #f5222d;
}
</style>
