import { axios } from '@/utils/request'

export function getCourseList(params) {
  return axios({
    url: '/courses',
    method: 'get',
    params: params
  })
}

// 获取网课详情
export function getCourse(course_id) {
  return axios({
    url: `/courses/${course_id}`,
    method: 'get'
  })
}

// 添加网课
export function addCourse(params) {
  return axios({
    url: '/courses',
    method: 'post',
    data: params
  })
}

// 修改网课
export function updateCourse(course_id, params) {
  return axios({
    url: `/courses/${course_id}`,
    method: 'put',
    data: params
  })
}

// 删除网课
export function deleteCourse(course_id) {
  return axios({
    url: `/courses/${course_id}`,
    method: 'delete'
  })
}
