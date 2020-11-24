import { axios } from '@/utils/request'

export function getCompanyList(params) {
  return axios({
    url: '/companies',
    method: 'get',
    params: params
  })
}

export function addCompany(params) {
  return axios({
    url: '/companies',
    method: 'post',
    data: params
  })
}

export function updateCompany(id, params) {
  return axios({
    url: `/companies/${id}`,
    method: 'put',
    data: params
  })
}

export function addExams(id, params) {
  return axios({
    url: `/companies/${id}/exams`,
    method: 'post',
    data: { ids: params }
  })
}

export function addCourses(id, params) {
  return axios({
    url: `/companies/${id}/courses`,
    method: 'post',
    data: { ids: params }
  })
}

export function getExamList() {
  return axios({
    url: '/companies/exams',
    method: 'get'
  })
}

export function getCourseList() {
  return axios({
    url: '/companies/courses',
    method: 'get'
  })
}
