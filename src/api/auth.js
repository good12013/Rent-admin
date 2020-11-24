import { axios } from '@/utils/request'

export function login(params) {
  return axios({
    url: '/admin/login',
    method: 'post',
    withCredentials:true,
    data: params
  })
}

export function getInfo() {
  return axios({
    url: '/auth/me',
    method: 'get'
  })
}

// 修改密码
export function modifyPassword(params) {
  return axios({
    url: '/auth/modify_password',
    method: 'put',
    data: params
  })
}

export function logout() {
  return axios({
    url: '/auth/logout',
    method: 'post'
  })
}
