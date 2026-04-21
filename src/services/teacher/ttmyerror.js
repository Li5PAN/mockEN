import request from '@/utils/request'

const BASE_URL = '/teacher-home'

/**
 * 获取错题列表（支持搜索筛选）
 * @param {Object} params - 查询参数
 * @param {string} params.startDate - 开始日期（YYYY-MM-DD）
 * @param {string} params.endDate - 结束日期（YYYY-MM-DD）
 * @param {string} params.questionType - 题目类型（1—选择题 2—填空题 3—单词拼写）
 * @param {string} params.classLevel - 班级等级（A/B/C/D）
 * @param {number} params.pageNum - 页码，默认 1
 * @param {number} params.pageSize - 每页条数，默认 10
 * @returns {Promise} 包含错题列表和总数
 */
export function getErrorList(params) {
  return request({
    url: `${BASE_URL}/error/list`,
    method: 'GET',
    params
  })
}

/**
 * 获取错题详情
 * @param {number} questionId - 错题ID
 * @returns {Promise} 包含错题详情
 */
export function getErrorDetail(questionId) {
  return request({
    url: `${BASE_URL}/error/${questionId}`,
    method: 'GET'
  })
}

/**
 * 导入错题（Excel文件）
 * @param {FormData} formData - 包含Excel文件的FormData
 * @returns {Promise} 导入结果
 */
export function importError(formData) {
  return request({
    url: `${BASE_URL}/error/import`,
    method: 'POST',
    data: formData
    // 不设置 Content-Type，让 axios 自动设置（包含正确的 boundary）
  })
}

/**
 * 导出错题（Excel/PDF）
 * @param {Object} params - 导出参数
 * @param {string} params.format - 导出格式（excel/pdf）
 * @param {string} params.scope - 导出范围（all/filtered）
 * @param {string} params.questionIds - 导出的错题ID列表，逗号分隔
 * @param {string} params.startDate - 开始日期（筛选用）
 * @param {string} params.endDate - 结束日期（筛选用）
 * @param {string} params.questionType - 题目类型（筛选用）
 * @param {string} params.classLevel - 班级等级（筛选用）
 * @returns {Blob} 文件流
 */
export function exportError(params) {
  return request({
    url: `${BASE_URL}/error/export`,
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

/**
 * 删除单条错题
 * @param {number} questionId - 错题ID
 * @returns {Promise} 删除结果
 */
export function deleteError(questionId) {
  return request({
    url: `${BASE_URL}/error/${questionId}`,
    method: 'DELETE'
  })
}

/**
 * 批量删除错题
 * @param {Array<number>} questionIds - 错题ID数组
 * @returns {Promise} 删除结果
 */
export function batchDeleteErrors(questionIds) {
  return request({
    url: `${BASE_URL}/error/batch-delete`,
    method: 'POST',
    data: { questionIds }
  })
}

/**
 * 下载错题导入模板
 * @returns {Blob} 模板文件流
 */
export function downloadErrorTemplate() {
  return request({
    url: `${BASE_URL}/error/template`,
    method: 'GET',
    responseType: 'blob'
  })
}
