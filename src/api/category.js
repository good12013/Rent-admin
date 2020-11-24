import { axios } from '@/utils/request'

// 获取分类列表
export function getCategoryList(params) {
  return axios({
    url: '/categories',
    method: 'get',
    params
  })
}

// 添加分类
export function addCategory(params) {
  return axios({
    url: '/categories',
    method: 'post',
    data: params
  })
}

// 更新分类
export function updateCategory(id, params) {
  return axios({
    url: `/categories/${id}`,
    method: 'put',
    data: params
  })
}

// 删除分类
export function delCategory(id) {
  return axios({
    url: `/categories/${id}`,
    method: 'delete'
  })
}
