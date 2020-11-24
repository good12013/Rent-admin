// ie polyfill
import '@babel/polyfill'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/'
import { VueAxios } from './utils/request'
import 'element-ui/lib/theme-chalk/index.css';
import {DatePicker} from 'element-ui'

import bootstrap from './core/bootstrap'
// import VueUeditorWrap from 'vue-ueditor-wrap'
import './core/use'
// import './permission' // permission control
import './utils/filter' // global filter

Vue.config.productionTip = false

// Vue.component('vue-ueditor-wrap', VueUeditorWrap)

Vue.use(VueAxios)
new Vue({
  router,
  store,
  created() {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
