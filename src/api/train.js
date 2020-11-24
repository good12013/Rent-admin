import { axios } from '@/utils/request'

// 获取正念训练列表
export function getTrainList(params) {
  return axios({
    url: '/trains',
    method: 'get',
    params
  })
}

// 获取正念训练详情
export function getTrain(train_id) {
  return axios({
    url: `/trains/${train_id}`,
    method: 'get'
  })
}

// 添加正念训练
export function addTrain(params) {
  return axios({
    url: '/trains',
    method: 'post',
    data: params
  })
}

// 更新正念训练
export function updateTrain(train_id, params) {
  return axios({
    url: `/trains/${train_id}`,
    method: 'put',
    data: params
  })
}

// 删除正念训练
export function delTrain(train_id) {
  return axios({
    url: `/trains/${train_id}`,
    method: 'delete'
  })
}

// 分类统计
export function getCategoryList() {
  return axios({
    url: '/trains/categories',
    method: 'get'
  })
}
