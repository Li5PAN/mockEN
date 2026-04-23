import request from '../../utils/request.js'

/**
 * 学生端单词学习 API 服务
 * 基础路径: /api/student-words
 */

/**
 * 获取单词列表（分页+搜索）
 * @param {Object} params - 查询参数
 * @param {string} params.keyword - 搜索关键词（支持中英文）
 * @param {number} params.page - 页码，默认 1
 * @param {number} params.pageSize - 每页数量，默认 10
 * @returns {Promise} 包含单词列表的 Promise
 */
export const fetchWordList = (params = {}) => {
  const { keyword = '', page = 1, pageSize = 5000 } = params
  return request({
    url: '/student-words',
    method: 'GET',
    params: { keyword, page, pageSize }
  })
}

/**
 * 搜索单词（支持中英文）
 * @param {string} keyword - 搜索关键词
 * @returns {Promise} 包含搜索结果的 Promise
 */
export const searchWord = (keyword) => {
  return request({
    url: '/student-words/search',
    method: 'GET',
    params: { keyword }
  })
}

/**
 * 收藏单词
 * @param {number} wordId - 单词ID
 * @returns {Promise} 收藏结果
 */
export const collectWord = (wordId) => {
  return request({
    url: '/student-words/collect',
    method: 'POST',
    data: { wordId }
  })
}

/**
 * 取消收藏
 * @param {number} wordId - 单词ID
 * @returns {Promise} 取消收藏结果
 */
export const uncollectWord = (wordId) => {
  return request({
    url: '/student-words/uncollect',
    method: 'POST',
    data: { wordId }
  })
}

/**
 * 获取收藏列表（带搜索）
 * @param {string} keyword - 搜索关键词（可选）
 * @returns {Promise} 收藏列表
 */
export const getFavoriteList = (keyword = '') => {
  return request({
    url: '/student-words/favorites',
    method: 'GET',
    params: { keyword }
  })
}

/**
 * 删除收藏
 * @param {number} collectionId - 收藏记录ID
 * @returns {Promise} 删除结果
 */
export const deleteFavorite = (collectionId) => {
  return request({
    url: `/student-words/favorites/${collectionId}`,
    method: 'DELETE'
  })
}

/**
 * 看中文写英文核对
 * @param {Object} params - 参数
 * @param {number} params.wordId - 单词ID
 * @param {string} params.userAnswer - 用户拼写的答案
 * @returns {Promise} 核对结果
 */
export const checkSpelling = (params) => {
  const { wordId, userAnswer } = params
  return request({
    url: '/student-words/spell-check',
    method: 'POST',
    data: { wordId, userAnswer }
  })
}

/**
 * 填空题核对
 * @param {Object} params - 参数
 * @param {number} params.wordId - 单词ID
 * @param {string} params.userAnswer - 用户填写的答案
 * @returns {Promise} 核对结果
 */
export const checkFillBlank = (params) => {
  const { wordId, userAnswer } = params
  return request({
    url: '/student-words/fill-blank',
    method: 'POST',
    data: { wordId, userAnswer }
  })
}

/**
 * 获取单词详情
 * @param {number} wordId - 单词ID
 * @returns {Promise} 单词详情
 */
export const getWordDetail = (wordId) => {
  return request({
    url: `/student-words/${wordId}`,
    method: 'GET'
  })
}

// 统一导出
export default {
  fetchWordList,
  searchWord,
  collectWord,
  uncollectWord,
  getFavoriteList,
  deleteFavorite,
  checkSpelling,
  checkFillBlank,
  getWordDetail
}
