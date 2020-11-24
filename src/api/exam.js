import { axios } from '@/utils/request'

// 设置车展流量
export function getStationList() {
    return axios({
        url: '/admin/station_list',
        method: 'get',
        withCredentials:true
    })
}

// 设置车展流量
export function setStationProportion(params) {
    return axios({
        url: '/admin/set_station_flow_proportion',
        method: 'post',
        data: params
    })
}

// 法用邮件通知商家
export function sendShopEmail(params) {
    return axios({
        url: '/admin/send_notice',
        method: 'post',
        data: params
    })
}

// 获取店铺周营收
export function getShopDetail(params) {
    return axios({
        url: '/admin/shop_turnover',
        method: 'get',
        params: params
    })
}
// 获取店铺营收列表
export function getShopList(params) {
    return axios({
        url: '/admin/shop_list',
        method: 'get',
        params: params
    })
}

// 获取测评列表
export function getExamList(params) {
  return axios({
    url: '/exams',
    method: 'get',
    params: params
  })
}

// 获取测评详情
export function getExam(id) {
  return axios({
    url: `/exams/${id}`,
    method: 'get'
  })
}

// 添加测评
export function addExam(params) {
  return axios({
    url: '/exams',
    method: 'post',
    data: params
  })
}

// 修改测评
export function updateExam(exam_id, params) {
  return axios({
    url: `/exams/${exam_id}`,
    method: 'put',
    data: params
  })
}

// 删除测评
export function deleteExam(exam_id) {
  return axios({
    url: `/exams/${exam_id}`,
    method: 'delete'
  })
}
