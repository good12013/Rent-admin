import { axios } from '@/utils/request'

// 查询消息推送列表
export function getPushList(params) {
  return axios({
    url: '/pushes',
    method: 'get',
    params: params
  })
}

// 添加消息推送
export function addPush(params) {
  return axios({
    url: '/pushes',
    method: 'post',
    data: params
  })
}

export function updatePush(id, params) {
  return axios({
    url: `/pushes/${id}`,
    method: 'get',
    data: params
  })
}

export function deletePush(id) {
  return axios({
    url: `/pushes/${id}`,
    method: 'delete'
  })
}
