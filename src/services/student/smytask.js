/**
 * 学生端 - 我的任务 API 服务
 *
 * 基础路径: /api/student-tasks
 * 认证方式: Header 中携带 Authorization: Bearer <token>
 *
 * 业务规则:
 * - 未完成任务: 只显示当前班级的未完成任务（可做）
 * - 已完成任务: 可以查看当前班级 + 历史班级的所有已完成任务
 * - 做题权限: 只能做当前班级的任务，历史班级任务只能查看结果
 * - 过期处理: 任务过期后不能再做
 */

import request from '@/utils/request'

/**
 * 1. 获取任务列表
 * GET /api/student-tasks/list
 *
 * 功能说明: 获取当前学生的任务列表，支持状态筛选和分页。
 * - status=pending: 只显示当前班级未完成的任务
 * - status=completed: 显示当前班级和历史班级的已完成任务
 *
 * @param {Object} params - 请求参数
 * @param {string} params.status - 任务状态: pending-未完成, completed-已完成
 * @param {number} params.pageNum - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise}
 *
 * 响应数据:
 * - rows: Array 任务列表
 * - total: number 总数
 */
export const getTaskList = (params) => {
  return request({
    url: '/student-tasks/list',
    method: 'GET',
    params: {
      status: 'pending',
      pageNum: 1,
      pageSize: 10,
      ...params
    }
  })
}

/**
 * 2. 获取任务详情（做题）
 * GET /api/student-tasks/:taskId
 *
 * 功能说明: 获取任务详情，包含题目列表，用于做题。
 * 只能获取当前班级的任务。
 *
 * @param {number} taskId - 任务ID（路径参数）
 * @returns {Promise}
 *
 * 响应数据:
 * - taskId: number 任务ID
 * - taskName: string 任务名称
 * - taskType: string 任务类型
 * - taskTypeText: string 任务类型名称
 * - totalQuestions: number 题目总数
 * - startTime: string 开始时间
 * - endTime: string 截止时间
 * - className: string 班级名称
 * - classLevel: number 班级等级
 * - canDo: boolean 是否可以做题
 * - questions: array 题目列表
 *
 * 错误码:
 * - 403: 该任务属于历史班级，只能查看结果
 * - 400: 任务已过期，无法再做 / 任务已完成，无法重复做
 */
export const getTaskDetail = (taskId) => {
  return request({
    url: `/student-tasks/${taskId}`,
    method: 'GET'
  })
}

/**
 * 3. 提交任务答案
 * POST /api/student-tasks/:taskId/submit
 *
 * 功能说明: 提交任务答案，自动批改并记录成绩。
 * 只能提交当前班级的任务。
 *
 * @param {number} taskId - 任务ID（路径参数）
 * @param {Object} data - 请求数据
 * @param {Object} data.answers - 答案对象，key为questionId，value为用户答案
 * @returns {Promise}
 *
 * 请求数据示例:
 * {
 *   "answers": {
 *     "1001": "A",
 *     "1002": ["A", "C"],
 *     "1003": "apple"
 *   }
 * }
 *
 * 响应数据:
 * - correctCount: number 正确题数
 * - wrongCount: number 错误题数
 * - totalQuestions: number 总题数
 * - score: number 得分
 * - isPassed: boolean 是否通过（60%及格）
 *
 * 错误码:
 * - 403: 只能提交当前班级的任务
 * - 400: 任务已过期，无法提交
 */
export const submitTask = (taskId, answers) => {
  return request({
    url: `/student-tasks/${taskId}/submit`,
    method: 'POST',
    data: { answers }
  })
}

/**
 * 4. 获取任务结果详情
 * GET /api/student-tasks/:taskId/detail
 *
 * 功能说明: 获取已完成任务的详细结果，包括每道题的正确答案和用户答案。
 * 可以查看所有已完成的任务（包括历史班级）。
 *
 * @param {number} taskId - 任务ID（路径参数）
 * @returns {Promise}
 *
 * 响应数据:
 * - taskId: number 任务ID
 * - taskName: string 任务名称
 * - taskType: string 任务类型
 * - taskTypeText: string 任务类型名称
 * - totalQuestions: number 题目总数
 * - score: number 得分
 * - isPassed: boolean 是否通过
 * - submitTime: string 提交时间
 * - className: string 班级名称
 * - classLevel: number 班级等级
 * - teacherName: string 授课老师
 * - questions: array 题目列表
 * - correctCount: number 正确题数
 * - wrongCount: number 错误题数
 *
 * 错误码:
 * - 400: 任务未完成，无法查看详情
 */
export const getTaskResult = (taskId) => {
  return request({
    url: `/student-tasks/${taskId}/detail`,
    method: 'GET'
  })
}

export default {
  getTaskList,
  getTaskDetail,
  submitTask,
  getTaskResult
}
