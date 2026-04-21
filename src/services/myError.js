/**
 * 学生端 - 我的错题页面接口
 */
import request from '../utils/request'

/**
 * 获取错题列表
 * @param {Object} params - 查询参数
 * @param {string} [params.questionType] - 题目类型(1选择题 2单词拼写 3填空题)
 * @param {string} [params.beginDate] - 开始时间 (YYYY-MM-DD)
 * @param {string} [params.endDate] - 结束时间 (YYYY-MM-DD)
 * @returns {Promise<Object>} - 返回错题列表数据
 */
export async function getWrongQuestions(params) {
  const res = await request({
    url: '/student/wrong/questions',
    method: 'GET',
    params
  })
  return res
}

/**
 * 删除错题（单个或批量）
 * @param {Array<number>|number} wrongIds - 错题ID，支持单个ID或ID数组
 * @returns {Promise<Object>} - 返回删除结果
 */
export async function deleteWrongQuestions(wrongIds) {
  const ids = Array.isArray(wrongIds) ? wrongIds.join(',') : wrongIds
  const res = await request({
    url: `/student/wrong/${ids}`,
    method: 'DELETE'
  })
  return res
}

/**
 * 获取错题详情
 * @param {number} wrongId - 错题ID
 * @returns {Promise<Object>} - 返回错题详情数据
 */
export async function getWrongQuestionDetail(wrongId) {
  const res = await request({
    url: '/student/wrong/detail',
    method: 'GET',
    params: { wrongId }
  })
  return res
}

/**
 * 下载导入错题模板
 * @returns {Promise<void>}
 */
export async function downloadWrongTemplate() {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const token = localStorage.getItem('token')

  // 构建下载链接
  const url = `${baseURL}/student/wrong/template`

  // 通过 fetch 获取文件并触发下载
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })

    if (!response.ok) {
      throw new Error('下载失败')
    }

    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = '错题导入模板.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('下载模板失败:', error)
    throw error
  }
}

/**
 * 导出错题
 * @param {Array<number>|number} wrongIds - 错题ID数组或单个ID
 * @param {string} [format='xls'] - 导出格式：xls 或 pdf
 * @returns {Promise<void>}
 */
export async function exportWrongQuestions(wrongIds, format = 'xls') {
  const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
  const token = localStorage.getItem('token')

  // 处理错题ID数组
  const ids = Array.isArray(wrongIds) ? wrongIds : [wrongIds]

  // 构建URL参数
  const params = new URLSearchParams()
  ids.forEach(id => params.append('wrongIds', id))
  params.append('format', format)

  const url = `${baseURL}/student/wrong/export?${params.toString()}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })

    if (!response.ok) {
      throw new Error('导出失败')
    }

    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl

    // 根据格式设置文件名
    const fileName = format === 'pdf' ? '错题导出.pdf' : '错题导出.xls'
    link.download = fileName

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('导出错题失败:', error)
    throw error
  }
}