import Vue from 'vue'
import { login, getInfo, logout } from '@/api/auth'
import { updateAdminUser } from '@/api/admin_user'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo)
          .then(res => {
            Vue.ls.set(ACCESS_TOKEN, res.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', res.token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
        Vue.ls.set(ACCESS_TOKEN, '12345', 7 * 24 * 60 * 60 * 1000)
        commit('SET_TOKEN', '12345')
        resolve()
      })
    },

    // 获取用户信息
    GetInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo()
          .then(res => {
            const result = res.data

            if (result.role) {
              const role = result.role
              commit('SET_ROLES', role)
              commit('SET_INFO', result)
            } else {
              reject(new Error('getInfo: roles must be a non-null array !'))
            }
            commit('SET_NAME', { name: result.username, welcome: welcome() })
            commit('SET_AVATAR', '/avatar2.jpg')
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 登出
    Logout({ commit, state }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        Vue.ls.remove(ACCESS_TOKEN)

        logout(state.token)
          .then(() => {
            resolve()
          })
          .catch(() => {
            resolve()
          })
      })
    },

    // 更新用户信息
    UpdateInfo({ commit }, userInfo) {
      const params = {
        real_name: userInfo.real_name,
        phone_number: userInfo.phone_number
      }
      return new Promise((resolve, reject) => {
        updateAdminUser(userInfo.id, params)
          .then(res => {
            commit('SET_INFO', res.data)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user
