import { axios } from '@/utils/request'

// 查询用户列表
export function getUserList(params) {
  return axios({
    url: '/users',
    method: 'get',
    params: params
  })
}

// 查询用户信息
export function getUser(uid) {
  return axios({
    url: `/users/${uid}`,
    method: 'get'
  })
}

// 修改用户信息
export function updateUser(uid, params) {
  return axios({
    url: `/users/${uid}`,
    method: 'put',
    data: params
  })
}
