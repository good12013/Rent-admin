import { axios } from '@/utils/request'

export function getToken(dir = 'images') {
  return axios({
    url: '/oss/token',
    method: 'get',
    params: { dir }
  })
}
