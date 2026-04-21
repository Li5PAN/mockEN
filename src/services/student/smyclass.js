/**
 * 学生端 - 我的班级 API 服务
 *
 * 基础路径: /api/student-class
 * 认证方式: Header 中携带 Authorization: Bearer <token>
 */

import request from '@/utils/request'

/**
 * 1. 获取班级状态
 * GET /api/student-class/status
 *
 * 功能说明：获取当前学生的班级状态，包括是否已入班、是否有待审核申请等。
 *
 * @returns {Promise} 返回班级状态数据
 *
 * 响应数据:
 * - status: number 状态：0-未入班，1-已入班，2-申请入班中，3-申请退班中，4-申请换班中
 * - isFirstJoin: boolean 是否首次入班
 * - currentClassId: number|null 当前班级ID（已入班时有值）
 * - currentClassName: string|null 当前班级名称
 * - pendingApplication: object|null 待审核申请信息
 * - lastClassLevel: string|null 上次班级等级（退出班级后记录，用于限制重新入班）
 */
export const getClassStatus = () => {
  return request({
    url: '/student-class/status',
    method: 'GET'
  })
}

/**
 * 2. 获取班级列表
 * GET /api/student-class/list
 *
 * 功能说明：获取所有可选班级列表，支持按等级筛选。
 *
 * @param {string} level - 班级等级：A/B/C/D（可选）
 * @returns {Promise} 返回班级列表数据
 *
 * 响应数据:
 * - rows: Array<{
 *     id: number,
 *     classId: number,
 *     level: string,
 *     name: string,
 *     teacher: string,
 *     teacherName: string,
 *     studentCount: number,
 *     memberCount: number,
 *     totalTasks: number,
 *     taskCount: number
 *   }>
 * - total: number
 */
export const getClassList = (level) => {
  return request({
    url: '/student-class/list',
    method: 'GET',
    params: { level }
  })
}

/**
 * 3. 获取我的班级信息
 * GET /api/student-class/my-class
 *
 * 功能说明：获取当前学生所在班级的详细信息。
 *
 * @returns {Promise} 返回我的班级信息
 *
 * 响应数据:
 * - classId: number 班级ID
 * - className: string 班级名称
 * - classLevel: string 班级等级
 * - teacherName: string 授课老师
 * - memberCount: number 班级总人数
 * - totalTasks: number 班级任务总数
 * - myRank: number 个人班级排名
 * - classTaskCompletionRate: number 班级任务平均完成率（%）
 * - myTaskCompletionRate: number 我的任务完成率（%）
 * - completedTasks: number 已完成任务数
 * - isFirstJoin: boolean 是否首次入班
 */
export const getMyClassInfo = () => {
  return request({
    url: '/student-class/my-class',
    method: 'GET'
  })
}

/**
 * 4. 获取班级排行榜
 * GET /api/student-class/ranking
 *
 * 功能说明：获取班级排行榜 Top 15。
 *
 * @returns {Promise} 返回班级排行榜数据
 *
 * 响应数据:
 * - data: Array<{
 *     rank: number,
 *     name: string,
 *     userId: number,
 *     taskCompletionRate: number,
 *     questionCount: number,
 *     isMe: boolean
 *   }>
 */
export const getClassRanking = () => {
  return request({
    url: '/student-class/ranking',
    method: 'GET'
  })
}

/**
 * 5. 获取班级学习趋势
 * GET /api/student-class/trend
 *
 * 功能说明：获取班级学习趋势数据（近8周），用于绘制趋势图。
 *
 * @returns {Promise} 返回学习趋势数据
 *
 * 响应数据:
 * - weeks: string[] 周次标签
 * - classAvg: number[] 班级平均答题数
 * - myData: number[] 我的答题数
 * - wrongCount: number[] 错题数量
 */
export const getClassTrend = () => {
  return request({
    url: '/student-class/trend',
    method: 'GET'
  })
}

/**
 * 6. 申请入班
 * POST /api/student-class/apply
 *
 * 功能说明：学生申请加入指定班级。
 *
 * @param {number} classId - 要加入的班级ID
 * @returns {Promise} 返回入班申请结果
 *
 * 请求数据:
 * - classId: number 班级ID
 *
 * 响应数据:
 * - code: 200成功, 400失败
 * - msg: string 提示信息
 * - data: { classId, className }
 */
export const applyJoinClass = (classId) => {
  return request({
    url: '/student-class/apply',
    method: 'POST',
    data: { classId }
  })
}

/**
 * 7. 退出班级
 * POST /api/student-class/quit
 *
 * 功能说明：学生退出当前班级。
 *
 * @returns {Promise} 返回退出班级结果
 *
 * 响应数据:
 * - code: 200成功, 400失败
 * - msg: string 提示信息
 */
export const quitClass = () => {
  return request({
    url: '/student-class/quit',
    method: 'POST'
  })
}

/**
 * 8. 申请换班
 * POST /api/student-class/change
 *
 * 功能说明：学生申请换到其他班级。
 *
 * @param {number} classId - 目标班级ID
 * @returns {Promise} 返回换班申请结果
 *
 * 请求数据:
 * - classId: number 目标班级ID
 *
 * 响应数据:
 * - code: 200成功, 400失败
 * - msg: string 提示信息
 * - data: { classId, className }
 */
export const applyChangeClass = (classId) => {
  return request({
    url: '/student-class/change',
    method: 'POST',
    data: { classId }
  })
}

/**
 * 9. 检查是否可以申请入班
 * GET /api/student-class/check-apply
 *
 * 功能说明：检查当前学生是否可以申请加入指定等级的班级。
 *
 * @param {string} level - 目标班级等级：A/B/C/D
 * @returns {Promise} 返回检查结果
 *
 * 响应数据:
 * - canApply: boolean 是否可以申请
 * - reason: string 不能申请的原因（canApply为false时有值）
 * - isFirstJoin: boolean 是否首次入班
 * - lastClassLevel: string 上次班级等级
 */
export const checkCanApply = (level) => {
  return request({
    url: '/student-class/check-apply',
    method: 'GET',
    params: { level }
  })
}

export default {
  getClassStatus,
  getClassList,
  getMyClassInfo,
  getClassRanking,
  getClassTrend,
  applyJoinClass,
  quitClass,
  applyChangeClass,
  checkCanApply
}
