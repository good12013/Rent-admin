import { axios } from '@/utils/request'

// 获取测评列表
export function getMerchantList(params) {
  return axios({
    url: '/merchants',
    method: 'get',
    params: params
  })
}

// 获取测评详情
export function getMerchant(id) {
  return axios({
    url: `/merchants/${id}`,
    method: 'get'
  })
}

// 添加测评
export function addMerchant(params) {
  return axios({
    url: '/merchants',
    method: 'post',
    data: params
  })
}

// 修改测评
export function updateMerchant(id, params) {
  return axios({
    url: `/merchants/${id}`,
    method: 'put',
    data: params
  })
}

// 删除测评
export function deleteMerchant(id) {
  return axios({
    url: `/merchants/${id}`,
    method: 'delete'
  })
}
