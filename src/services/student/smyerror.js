/**
 * 学生端 - 我的错题 API 服务
 *
 * 基础路径: /api/student-errors
 * 认证方式: Header 中携带 Authorization: Bearer <token>
 */

import request from '@/utils/request'

/**
 * 1. 获取错题统计概览
 * GET /api/student-errors/overview
 *
 * 功能说明：获取当前学生的错题统计数据。
 *
 * @returns {Promise} 返回错题统计数据
 *
 * 响应数据:
 * - totalErrors: number 错题总数
 * - masteredCount: number 已掌握数量
 * - unmasteredCount: number 未掌握数量
 * - typeDistribution: array 类型分布统计
 * - recentTrend: array 近期错题趋势
 */
export const getErrorOverview = () => {
  return request({
    url: '/student-errors/overview',
    method: 'GET'
  })
}

/**
 * 2. 获取错题列表
 * GET /api/student-errors/list
 *
 * 功能说明：获取当前学生的错题列表，支持筛选和分页。
 *
 * @param {Object} params - 查询参数
 * @param {string} params.questionType - 题目类型：1-选择题，2-单词拼写，3-填空题
 * @param {string} params.startDate - 开始日期（YYYY-MM-DD）
 * @param {string} params.endDate - 结束日期（YYYY-MM-DD）
 * @param {number} params.pageNum - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise} 返回错题列表数据
 *
 * 响应数据:
 * - rows: Array 错题列表
 * - total: number 总数
 */
export const getErrorList = (params = {}) => {
  return request({
    url: '/student-errors/list',
    method: 'GET',
    params
  })
}

/**
 * 3. 获取错题详情
 * GET /api/student-errors/:wrongId
 *
 * 功能说明：获取指定错题的详细信息。
 *
 * @param {number} wrongId - 错题ID
 * @returns {Promise} 返回错题详情
 *
 * 响应数据:
 * - wrongId: number 错题ID
 * - questionContent: string 题目内容
 * - questionType: string 题目类型
 * - questionTypeName: string 题目类型名称
 * - correctAnswer: string 正确答案
 * - userAnswer: string 用户答案
 * - taskName: string 所属任务名称
 * - taskId: number 所属任务ID
 * - wrongDate: string 错误日期
 * - isMastered: string 是否已掌握
 * - explanation: string 题目解析
 */
export const getErrorDetail = (wrongId) => {
  return request({
    url: `/student-errors/${wrongId}`,
    method: 'GET'
  })
}

/**
 * 4. 手动添加错题
 * POST /api/student-errors/add
 *
 * 功能说明：学生手动添加错题记录。
 *
 * @param {Object} data - 错题数据
 * @param {string} data.questionContent - 题目内容
 * @param {string} data.questionType - 题目类型：1-选择题，2-单词拼写，3-填空题
 * @param {string} data.correctAnswer - 正确答案
 * @param {string} [data.userAnswer] - 用户答案
 * @param {string} [data.explanation] - 题目解析
 * @returns {Promise} 返回添加结果
 *
 * 响应数据:
 * - wrongId: number 新增错题ID
 * - questionContent: string 题目内容
 * - questionType: string 题目类型
 * - questionTypeName: string 题目类型名称
 * - correctAnswer: string 正确答案
 * - userAnswer: string 用户答案
 * - taskName: string 所属任务名称
 * - taskId: number|null 所属任务ID
 * - wrongDate: string 错误日期
 * - isMastered: string 是否已掌握
 * - explanation: string 题目解析
 */
export const addError = (data) => {
  return request({
    url: '/student-errors/add',
    method: 'POST',
    data
  })
}

/**
 * 5. 编辑错题
 * PUT /api/student-errors/:wrongId
 *
 * 功能说明：编辑指定错题的信息。
 *
 * @param {number} wrongId - 错题ID
 * @param {Object} data - 更新数据
 * @param {string} [data.questionContent] - 题目内容
 * @param {string} [data.questionType] - 题目类型
 * @param {string} [data.correctAnswer] - 正确答案
 * @param {string} [data.explanation] - 题目解析
 * @returns {Promise} 返回编辑结果
 *
 * 响应数据:
 * - wrongId: number 错题ID
 * - questionContent: string 题目内容
 * - questionType: string 题目类型
 * - questionTypeName: string 题目类型名称
 * - correctAnswer: string 正确答案
 * - userAnswer: string 用户答案
 * - taskName: string 所属任务名称
 * - taskId: number 所属任务ID
 * - wrongDate: string 错误日期
 * - isMastered: string 是否已掌握
 * - explanation: string 题目解析
 */
export const updateError = (wrongId, data) => {
  return request({
    url: `/student-errors/${wrongId}`,
    method: 'PUT',
    data
  })
}

/**
 * 6. 删除单条错题
 * DELETE /api/student-errors/:wrongId
 *
 * 功能说明：删除指定的错题记录。
 *
 * @param {number} wrongId - 错题ID
 * @returns {Promise} 返回删除结果
 *
 * 响应数据:
 * - code: 200成功, 404错题不存在
 * - msg: string 提示信息
 */
export const deleteError = (wrongId) => {
  return request({
    url: `/student-errors/${wrongId}`,
    method: 'DELETE'
  })
}

/**
 * 7. 批量删除错题
 * POST /api/student-errors/batch-delete
 *
 * 功能说明：批量删除多条错题记录。
 *
 * @param {number[]} wrongIds - 错题ID数组
 * @returns {Promise} 返回批量删除结果
 *
 * 请求数据:
 * - wrongIds: number[] 错题ID数组
 *
 * 响应数据:
 * - code: 200成功
 * - msg: string 提示信息
 * - data: { deletedCount: number } 删除数量
 */
export const batchDeleteErrors = (wrongIds) => {
  return request({
    url: '/student-errors/batch-delete',
    method: 'POST',
    data: { wrongIds }
  })
}

/**
 * 8. 导入错题
 * POST /api/student-errors/import
 *
 * 功能说明：通过Excel文件批量导入错题。
 *
 * @param {FormData} formData - 包含Excel文件的FormData对象
 * @returns {Promise} 返回导入结果
 *
 * 响应数据:
 * - code: 200成功
 * - msg: string 提示信息
 * - data: { importCount: number } 导入数量
 */
export const importErrors = (formData) => {
  return request({
    url: '/student-errors/import',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 9. 导出错题（直接下载文件流）
 * GET /api/student-errors/export
 *
 * 功能说明：导出错题为Excel或PDF格式，直接返回文件流。
 *
 * @param {string} format - 导出格式：excel（默认）/ pdf
 * @param {object} params - 其他筛选参数（可选）
 * @returns {Promise} 返回 axios response，response.data 是 blob
 *
 * 响应数据:
 * - 直接返回 Excel/PDF 文件流
 */
export const exportErrorsBlob = (format = 'excel', params = {}) => {
  return request({
    url: '/student-errors/export',
    method: 'GET',
    params: { format, ...params },
    responseType: 'blob'
  })
}

/**
 * 9. 导出错题（JSON 格式，兼容旧接口）
 * GET /api/student-errors/export
 *
 * @deprecated 使用 exportErrorsBlob 代替
 *
 * @param {string} format - 导出格式：excel（默认）/ pdf
 * @returns {Promise} 返回导出结果
 *
 * 响应数据:
 * - code: 200成功
 * - msg: string 提示信息
 * - data: {
 *     downloadUrl: string 下载地址
 *     exportCount: number 导出数量
 *   }
 */
export const exportErrors = (format = 'excel') => {
  return request({
    url: '/student-errors/export',
    method: 'GET',
    params: { format }
  })
}

/**
 * 10. 下载导入模板（直接下载文件流）
 * GET /api/student-errors/template
 *
 * 功能说明：下载错题导入模板文件，直接返回 Excel 文件流。
 *
 * @returns {Promise} 返回 axios response，response.data 是 blob
 *
 * 响应数据:
 * - 直接返回 Excel 文件流 (Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
 * - Content-Disposition: attachment; filename="student_error_template.xlsx"
 */
export const downloadTemplateBlob = () => {
  return request({
    url: '/student-errors/template',
    method: 'GET',
    responseType: 'blob'
  })
}

/**
 * 10. 下载导入模板（JSON 格式，兼容旧接口）
 * GET /api/student-errors/template
 *
 * @deprecated 使用 downloadTemplateBlob 代替
 *
 * @returns {Promise} 返回模板下载结果
 *
 * 响应数据:
 * - code: 200成功
 * - msg: string 提示信息
 * - data: {
 *     downloadUrl: string 下载地址
 *     templateName: string 模板名称
 *   }
 */
export const downloadTemplate = () => {
  return request({
    url: '/student-errors/template',
    method: 'GET'
  })
}

/**
 * 11. 标记已掌握/未掌握
 * PUT /api/student-errors/:wrongId/master
 *
 * 功能说明：标记错题为已掌握或未掌握状态。
 *
 * @param {number} wrongId - 错题ID
 * @param {boolean} isMastered - 是否已掌握
 * @returns {Promise} 返回标记结果
 *
 * 请求数据:
 * - isMastered: boolean 是否已掌握
 *
 * 响应数据:
 * - code: 200成功
 * - msg: string 提示信息
 * - data: { isMastered: string } 掌握状态
 */
export const markMastered = (wrongId, isMastered) => {
  return request({
    url: `/student-errors/${wrongId}/master`,
    method: 'PUT',
    data: { isMastered }
  })
}

/**
 * 12. 获取错题类型统计
 * GET /api/student-errors/type-stats
 *
 * 功能说明：获取各类型错题的数量统计。
 *
 * @returns {Promise} 返回类型统计
 *
 * 响应数据:
 * - data: Array<{
 *     type: string 类型名称
 *     count: number 数量
 *   }>
 */
export const getTypeStats = () => {
  return request({
    url: '/student-errors/type-stats',
    method: 'GET'
  })
}

export default {
  getErrorOverview,
  getErrorList,
  getErrorDetail,
  addError,
  updateError,
  deleteError,
  batchDeleteErrors,
  importErrors,
  exportErrors,
  exportErrorsBlob,
  downloadTemplate,
  downloadTemplateBlob,
  markMastered,
  getTypeStats
}
