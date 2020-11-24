import { axios } from '@/utils/request'

// 查询用户列表
export function getAdminUserList(params) {
  return axios({
    url: '/admin_users',
    method: 'get',
    params: params
  })
}

// 添加用户
export function addAdminUser(params) {
  return axios({
    url: '/admin_users',
    method: 'post',
    data: params
  })
}

// 查询用户信息
export function getAdminUser(user_id) {
  return axios({
    url: `/admin_users/${user_id}`,
    method: 'get'
  })
}

// 修改用户信息
export function updateAdminUser(user_id, params) {
  return axios({
    url: `/admin_users/${user_id}`,
    method: 'put',
    data: params
  })
}

// 删除用户
export function deleteAdminUser(user_id) {
  return axios({
    url: `/admin_users/${user_id}`,
    method: 'delete'
  })
}

// 修改密码
export function modifyPassword(params) {
  return axios({
    url: '/modify_password',
    method: 'put',
    data: params
  })
}
