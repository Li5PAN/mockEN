/**
 * 教师端任务管理接口服务
 * 基础路径: /api/teacher-home
 */
import request from '@/utils/request'

/**
 * 获取任务列表（支持等级筛选）
 * @param {Object} params - 请求参数
 * @param {String} params.classLevel - 班级等级 (A/B/C/D)
 * @param {Number} params.pageNum - 页码，默认 1
 * @param {Number} params.pageSize - 每页条数，默认 10
 * @returns {Promise} 任务列表数据
 */
export function getTaskList(params = {}) {
  return request({
    url: '/teacher-home/task/list',
    method: 'GET',
    params: {
      classLevel: params.classLevel || undefined,
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 100
    }
  })
}

/**
 * 获取任务详情（包含题目列表）
 * @param {Number} taskId - 任务ID
 * @returns {Promise} 任务详情数据
 */
export function getTaskDetail(taskId) {
  return request({
    url: `/teacher-home/task/${taskId}`,
    method: 'GET'
  })
}

/**
 * 督促学生完成任务
 * @param {Number} taskId - 任务ID
 * @returns {Promise} 督促结果
 */
export function sendTaskReminder(taskId) {
  return request({
    url: `/teacher-home/task/${taskId}/remind`,
    method: 'POST'
  })
}

export default {
  getTaskList,
  getTaskDetail,
  sendTaskReminder
}
