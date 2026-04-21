/**
 * 学生端 - 我的任务 API 服务
 *
 * 基础路径: /api/student-tasks
 * 认证方式: Header 中携带 Authorization: Bearer <token>
 */

import request from '@/utils/request'

/**
 * 1. 获取我的任务列表
 * GET /api/student-tasks/list
 *
 * 功能说明：获取当前学生的任务列表，支持筛选已完成/未完成状态。
 *
 * @param {Object} params - 查询参数
 * @param {string} params.completed - 是否完成：true-已完成，false-未完成
 * @returns {Promise} 返回任务列表数据
 *
 * 响应数据:
 * - code: 200成功
 * - data: Array 任务列表
 *   - taskId: number 任务ID
 *   - taskName: string 任务名称
 *   - taskStatus: string 任务状态
 *   - taskType: string 任务类型
 *   - questionCount: number 题目数量
 *   - startTime: string 开始时间
 *   - endTime: string 截止时间
 *   - className: string 所属班级
 *   - teacherName: string 授课老师
 */
export const getMyTasks = (params = {}) => {
  return request({
    url: '/student-tasks/list',
    method: 'GET',
    params
  })
}

/**
 * 2. 获取任务题目
 * GET /api/student-tasks/:taskId/questions
 *
 * 功能说明：获取指定任务的题目详情，用于学生做题。
 *
 * @param {number} taskId - 任务ID
 * @returns {Promise} 返回任务题目数据
 *
 * 响应数据:
 * - code: 200成功
 * - data: {
 *     taskId: number 任务ID
 *     taskName: string 任务名称
 *     taskType: string 任务类型
 *     totalQuestions: number 题目总数
 *     questions: Array 题目列表
 *       - questionId: number 题目ID
 *       - questionName: string 题目名称
 *       - questionContent: string 题目内容
 *       - questionType: string 题目类型：1-单选题，2-多选题，3-填空题
 *       - options: object 选项（JSON格式，如 {"A": "选项1", "B": "选项2"}）
 *   }
 */
export const getTaskQuestions = (taskId) => {
  return request({
    url: `/student-tasks/${taskId}/questions`,
    method: 'GET'
  })
}

/**
 * 3. 获取任务详情（含答题结果）
 * GET /api/student-tasks/:taskId/detail
 *
 * 功能说明：获取已完成任务的详细内容和答题结果。
 *
 * @param {number} taskId - 任务ID
 * @returns {Promise} 返回任务详情数据
 *
 * 响应数据:
 * - code: 200成功
 * - data: {
 *     taskId: number 任务ID
 *     taskName: string 任务名称
 *     taskType: string 任务类型
 *     score: number 得分
 *     isPassed: boolean 是否通过
 *     submitTime: string 提交时间
 *     totalQuestions: number 题目总数
 *     correctCount: number 正确题数
 *     wrongCount: number 错误题数
 *     questions: Array 题目详情列表
 *       - questionId: number 题目ID
 *       - questionName: string 题目名称
 *       - questionContent: string 题目内容
 *       - questionType: string 题目类型
 *       - options: object 选项
 *       - correctAnswer: string 正确答案
 *       - userAnswer: string 用户答案
 *       - isCorrect: boolean 是否正确
 *       - explanation: string 题目解析
 *   }
 */
export const getTaskDetail = (taskId) => {
  return request({
    url: `/student-tasks/${taskId}/detail`,
    method: 'GET'
  })
}

/**
 * 4. 提交任务答案
 * POST /api/student-tasks/submit
 *
 * 功能说明：提交学生答题结果，系统自动判分。
 *
 * @param {Object} data - 提交数据
 * @param {number} data.taskId - 任务ID
 * @param {Array} data.answers - 答案列表
 *   - questionId: number 题目ID
 *   - answer: string 用户答案（多选题用逗号分隔，如 "A,C"）
 * @param {number} data.timeUsed - 用时（秒）
 * @returns {Promise} 返回提交结果
 *
 * 响应数据:
 * - code: 200成功
 * - data: {
 *     taskId: number 任务ID
 *     score: number 得分
 *     isPassed: boolean 是否通过
 *     correctCount: number 正确题数
 *     wrongCount: number 错误题数
 *     submitTime: string 提交时间
 *   }
 */
export const submitTaskAnswers = (data) => {
  return request({
    url: '/student-tasks/submit',
    method: 'POST',
    data
  })
}

export default {
  getMyTasks,
  getTaskQuestions,
  getTaskDetail,
  submitTaskAnswers
}
