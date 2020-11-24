import { axios } from '@/utils/request'

export function getBannerList(params) {
  return axios({
    url: '/banners',
    method: 'get',
    params: params
  })
}

export function addBanner(params) {
  return axios({
    url: '/banners',
    method: 'post',
    data: params
  })
}

// 修改Banner
export function updateBanner(banner_id, params) {
  return axios({
    url: `/banners/${banner_id}`,
    method: 'put',
    data: params
  })
}

// 删除Banner
export function deleteBanner(banner_id) {
  return axios({
    url: `/banners/${banner_id}`,
    method: 'delete'
  })
}
