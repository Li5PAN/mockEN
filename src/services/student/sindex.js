/**
 * 学生端首页 API 服务
 * 
 * 基础路径: /api/student-home
 * 认证方式: Header 中携带 Authorization: Bearer <token>
 */

import request from '../../utils/request.js'

/**
 * 1. 获取学习概览数据
 * GET /api/student-home/overview
 * 
 * @returns {Promise} 返回学习概览数据
 * 
 * 响应数据:
 * - todayWordsLearned: 今日学习单词数
 * - totalWrongQuestions: 累计错题数
 * - classRank: 班级排名
 * - pendingTasks: 待完成任务数
 * - todayStudyMinutes: 今日学习时长(分钟)
 * - todayTasksCompleted: 今日完成任务数
 * - totalStudyMinutes: 累计学习时长(分钟)
 * - masteredWords: 已掌握单词数
 * - tasksCompleted: 累计完成任务数
 * - totalWordsSearched: 累计查词次数
 */
export const getStudentOverview = () => {
  return request({
    url: '/student-home/overview',
    method: 'GET'
  })
}

/**
 * 2. 获取打卡状态
 * GET /api/student-home/clock-in-status
 * 
 * @returns {Promise} 返回打卡状态数据
 * 
 * 响应数据:
 * - clockedIn: 今日是否已打卡
 * - clockInDate: 最后打卡日期
 * - consecutiveDays: 连续打卡天数
 * - totalDays: 累计打卡天数
 * - clockInDates: 打卡日期列表
 */
export const getClockInStatus = () => {
  return request({
    url: '/student-home/clock-in-status',
    method: 'GET'
  })
}

/**
 * 3. 打卡
 * POST /api/student-home/clock-in
 * 
 * @returns {Promise} 返回打卡结果
 * 
 * 响应数据:
 * - clockedIn: 打卡是否成功
 * - clockInDate: 打卡日期
 * - consecutiveDays: 连续打卡天数
 * - totalDays: 累计打卡天数
 */
export const clockIn = () => {
  return request({
    url: '/student-home/clock-in',
    method: 'POST'
  })
}

/**
 * 4. 获取近7天任务完成情况
 * GET /api/student-home/weekly-tasks
 * 
 * @returns {Promise} 返回近7天任务完成数据
 * 
 * 响应数据: Array<{ date: string, completedCount: number }>
 */
export const getWeeklyTasks = () => {
  return request({
    url: '/student-home/weekly-tasks',
    method: 'GET'
  })
}

/**
 * 5. 获取近7天单词学习趋势
 * GET /api/student-home/weekly-words
 * 
 * @returns {Promise} 返回近7天单词学习数据
 * 
 * 响应数据: Array<{ date: string, masteredCount: number }>
 */
export const getWeeklyWords = () => {
  return request({
    url: '/student-home/weekly-words',
    method: 'GET'
  })
}

/**
 * 6. 获取未完成任务列表
 * GET /api/student-home/pending-tasks
 * 
 * @returns {Promise} 返回未完成任务列表
 * 
 * 响应数据: Array<{
 *   id: number,
 *   title: string,
 *   deadline: string,
 *   questionCount: number,
 *   urgency: string
 * }>
 */
export const getPendingTasks = () => {
  return request({
    url: '/student-home/pending-tasks',
    method: 'GET'
  })
}

/**
 * 7. 获取班级任务完成进度
 * GET /api/student-home/class-progress
 * 
 * @returns {Promise} 返回班级任务完成进度
 * 
 * 响应数据:
 * - completed: 已完成任务数
 * - total: 总任务数
 * - rate: 完成率(%)
 * - ranking: 班级排名
 * - totalClasses: 班级总人数
 */
export const getClassProgress = () => {
  return request({
    url: '/student-home/class-progress',
    method: 'GET'
  })
}

export default {
  getStudentOverview,
  getClockInStatus,
  clockIn,
  getWeeklyTasks,
  getWeeklyWords,
  getPendingTasks,
  getClassProgress
}
