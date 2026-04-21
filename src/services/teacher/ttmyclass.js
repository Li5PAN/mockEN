/**
 * 教师班级管理服务
 * 提供班级概览、班级列表、创建班级、删除班级、发布任务等功能
 */
import request from '@/utils/request'

/**
 * 获取班级概览数据
 * @returns {Promise<Object>} - 包含 totalClasses, avgCompletionRate, pendingApplications
 */
export async function getClassOverview() {
  const res = await request({
    url: '/teacher-class/overview',
    method: 'get'
  })
  return res
}

/**
 * 获取班级列表（当前老师）
 * @param {Object} params - 查询参数
 * @param {string} params.classLevel - 班级等级 (A/B/C/D)
 * @param {number} params.pageNum - 页码，默认1
 * @param {number} params.pageSize - 每页数量，默认100
 * @returns {Promise<Object>} - 包含 rows 和 total
 */
export async function getTeacherClassList(params = {}) {
  const res = await request({
    url: '/teacher-class/list',
    method: 'get',
    params: {
      classLevel: params.classLevel || undefined,
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 100
    }
  })
  return res
}

/**
 * 获取所有班级列表（管理员用）
 * @param {Object} params - 查询参数
 * @param {string} params.classLevel - 班级等级 (A/B/C/D)
 * @param {string} params.teacherId - 老师ID
 * @param {number} params.pageNum - 页码，默认1
 * @param {number} params.pageSize - 每页数量，默认100
 * @returns {Promise<Object>} - 包含 rows 和 total
 */
export async function getAllTeacherClassList(params = {}) {
  const res = await request({
    url: '/teacher-class/all',
    method: 'get',
    params: {
      classLevel: params.classLevel || undefined,
      teacherId: params.teacherId || undefined,
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 100
    }
  })
  return res
}

/**
 * 创建班级
 * @param {Object} data - 班级信息
 * @param {string} data.className - 班级名称
 * @param {string} data.classLevel - 班级等级 (A/B/C/D)
 * @param {number} data.maxStudents - 最大学生数
 * @param {number} data.taskRequirement - 任务要求数（可选）
 * @returns {Promise<Object>} - 创建成功的班级信息
 */
export async function createClass(data) {
  const res = await request({
    url: '/teacher-class/create',
    method: 'post',
    data: {
      className: data.className,
      classLevel: data.classLevel,
      maxStudents: data.maxStudents,
      taskRequirement: data.taskRequirement
    }
  })
  return res
}

/**
 * 删除班级
 * @param {number} classId - 班级ID
 * @returns {Promise<Object>} - 删除结果
 */
export async function deleteClass(classId) {
  const res = await request({
    url: `/teacher-class/delete/${classId}`,
    method: 'delete'
  })
  return res
}

/**
 * 发布任务
 * @param {Object} data - 任务信息
 * @param {number} data.classId - 班级ID
 * @param {string} data.taskName - 任务名称
 * @param {string} data.taskType - 任务类型 (1:单词学习, 2:单词测试, 3:综合练习)
 * @param {string} data.startTime - 开始时间 (YYYY-MM-DD HH:mm:ss)
 * @param {string} data.deadline - 截止时间 (YYYY-MM-DD HH:mm:ss)
 * @param {Array} data.questions - 题目列表
 * @returns {Promise<Object>} - 发布结果，包含 taskId
 */
export async function publishTask(data) {
  const res = await request({
    url: '/teacher-class/publish-task',
    method: 'post',
    data: {
      classId: data.classId,
      taskName: data.taskName,
      taskType: data.taskType,
      startTime: data.startTime,
      deadline: data.deadline,
      questions: data.questions || []
    }
  })
  return res
}

/**
 * 发布任务（包含题目）
 * @param {Object} data - 任务信息
 * @param {number} data.classId - 班级ID
 * @param {string} data.taskName - 任务名称
 * @param {string} data.taskType - 任务类型 (1:单词学习, 2:单词测试, 3:综合练习)
 * @param {string} data.startTime - 开始时间 (YYYY-MM-DD HH:mm:ss)
 * @param {string} data.endTime - 截止时间 (YYYY-MM-DD HH:mm:ss)
 * @param {Array} data.questions - 题目列表
 * @returns {Promise<Object>} - 发布结果，包含 taskId
 */
export async function publishTaskWithQuestions(data) {
  return publishTask({
    classId: data.classId,
    taskName: data.taskName,
    taskType: data.taskType,
    startTime: data.startTime,
    deadline: data.endTime || data.deadline,
    questions: data.questions || []
  })
}

// 字段映射工具函数 - 将接口字段映射为页面使用的字段
export function mapApiClassToPage(apiClass) {
  return {
    id: apiClass.classId,
    name: apiClass.className,
    level: apiClass.classLevel,
    currentStudents: apiClass.currentStudents,
    maxStudents: apiClass.maxStudents,
    taskCount: apiClass.taskCount,
    createTime: formatDate(apiClass.createTime),
    pendingCount: apiClass.pendingApplicationCount,
    teacherId: apiClass.teacherId,
    teacherName: apiClass.teacherName
  }
}

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 导出默认对象
export default {
  getClassOverview,
  getTeacherClassList,
  getAllTeacherClassList,
  createClass,
  deleteClass,
  publishTask,
  publishTaskWithQuestions,
  mapApiClassToPage
}
