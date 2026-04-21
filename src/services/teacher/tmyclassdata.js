import request from '@/utils/request'

/**
 * 获取班级下拉列表
 * @returns {Promise} 班级列表数据
 */
export const getClassList = () => {
  return request({
    url: '/teacher-class-data/class-list',
    method: 'GET'
  })
}

/**
 * 获取班级任务完成对比图数据
 * @param {Number} classId - 班级ID
 * @returns {Promise} 任务完成对比图数据
 */
export const getTaskCompletionChart = (classId) => {
  return request({
    url: '/teacher-class-data/task-completion-chart',
    method: 'GET',
    params: { classId }
  })
}

/**
 * 获取学生学习活跃分析图数据
 * @param {Number} classId - 班级ID
 * @returns {Promise} 学生学习活跃分析图数据
 */
export const getStudentActivityChart = (classId) => {
  return request({
    url: '/teacher-class-data/student-activity-chart',
    method: 'GET',
    params: { classId }
  })
}

/**
 * 获取学生错题类型分析图数据
 * @param {Number} classId - 班级ID
 * @returns {Promise} 学生错题类型分析图数据
 */
export const getErrorTypeChart = (classId) => {
  return request({
    url: '/teacher-class-data/error-type-chart',
    method: 'GET',
    params: { classId }
  })
}
