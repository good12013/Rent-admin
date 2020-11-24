import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import { VueAxios } from './axios'
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'
axios.defaults.withCredentials=true
// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', // api base_url
  timeout: 50000, // 请求超时时间
    withCredentials:true
})

const err = error => {
  if (error.response) {
    if (error.status === 403) {
      notification.error({ message: '拒绝访问', description: '无权限，拒绝访问' })
    }
    if (error.status === 401) {
      notification.error({ message: '未授权', description: '授权验证失败' })
      store.dispatch('Logout').then(() => {
        location.reload()
      })
    }
  }
  return Promise.reject(error.response)
}

// request 拦截器
service.interceptors.request.use(config => {
  const token = Vue.ls.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}` // 让每个请求携带自定义 token 请根据实际情况自行修改
  }
  return config
}, err)

// response 拦截器
service.interceptors.response.use(res => {
  // if (res.data.code != 0) {
  //   notification.error({
  //     message: '错误',
  //     description: res.data.message
  //   })
  //   return Promise.reject(res.data)
  // }
  return res.data
}, err)

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, service)
  }
}

export { installer as VueAxios, service as axios }
