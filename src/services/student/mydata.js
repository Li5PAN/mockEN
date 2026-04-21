import request from '@/utils/request'

/**
 * 学生端 - 我的进度 API 服务
 *
 * 基础路径: /api/student-class-data
 * 认证方式: Header 中携带 Authorization: Bearer <token>
 */

/**
 * 获取顶部统计数据
 * @returns {Promise} 返回统计数据 { totalWords, completedTasks, totalErrors }
 */
export async function getStatistics() {
  return request({
    url: '/student-class-data/statistics',
    method: 'get'
  })
}

/**
 * 获取每日学习数据（近7天）
 * @returns {Promise} 返回每日学习数据 { dates, wordCounts, taskCounts, errorCounts, studyMinutes }
 */
export async function getDailyStudy() {
  return request({
    url: '/student-class-data/daily-study',
    method: 'get'
  })
}

/**
 * 获取班级 vs 个人完成率走势（近8周）
 * @returns {Promise} 返回完成率数据 { weeks, classRate, myRate }
 */
export async function getCompareRate() {
  return request({
    url: '/student-class-data/compare',
    method: 'get'
  })
}

/**
 * 获取班级排名
 * @param {string} type - 排名类型: time(按学习时长) / words(按掌握单词量)
 * @returns {Promise} 返回排名列表 { list, maxStudyTime, maxWords, total }
 */
export async function getRanking(type = 'time') {
  return request({
    url: '/student-class-data/ranking',
    method: 'get',
    params: { type }
  })
}
