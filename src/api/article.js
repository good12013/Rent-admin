import { axios } from '@/utils/request'

// 获取文章列表
export function getArticleList(params) {
  return axios({
    url: '/articles',
    method: 'get',
    params: params
  })
}

// 获取文章详情
export function getArticle(article_id) {
  return axios({
    url: `/articles/${article_id}`,
    method: 'get'
  })
}

// 添加文章
export function addArticle(params) {
  return axios({
    url: '/articles',
    method: 'post',
    data: params
  })
}

// 修改文章
export function updateArticle(article_id, params) {
  return axios({
    url: `/articles/${article_id}`,
    method: 'put',
    data: params
  })
}

// 删除文章
export function deleteArticle(article_id) {
  return axios({
    url: `/articles/${article_id}`,
    method: 'delete'
  })
}
