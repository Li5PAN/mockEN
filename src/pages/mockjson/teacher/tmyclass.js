/**
 * 教师班级管理相关模拟数据
 * 包含班级概览、班级列表、创建班级、发布任务等功能
 */

// ==================== 班级概览数据 ====================

export const mockClassOverviewData = {
  teacher: {
    totalStudents: 156,
    totalClasses: 4,
    avgCompletionRate: 80,
    pendingApplications: 8
  }
}

// ==================== 班级列表数据 ====================

// 老师ID与名字映射
const teacherNameMap = {
  'teacher': '张老师',
  'teacherLi': '李老师',
  'teacherWang': '王老师'
}

// 获取老师名字
const getTeacherName = (teacherId) => {
  return teacherNameMap[teacherId] || teacherId || '未知教师'
}

export const mockTeacherClassListData = [
  {
    classId: 1,
    className: 'A级-英语精英班',
    classLevel: 'A',
    currentStudents: 25,
    maxStudents: 30,
    taskCount: 15,
    createTime: '2026-03-01',
    pendingApplicationCount: 2,
    teacherId: 'teacher',
    teacherName: '张老师'
  },
  {
    classId: 2,
    className: 'B级-英语进阶班',
    classLevel: 'B',
    currentStudents: 35,
    maxStudents: 40,
    taskCount: 12,
    createTime: '2026-03-05',
    pendingApplicationCount: 3,
    teacherId: 'teacher',
    teacherName: '张老师'
  },
  {
    classId: 3,
    className: 'C级-英语提高班',
    classLevel: 'C',
    currentStudents: 48,
    maxStudents: 50,
    taskCount: 10,
    createTime: '2026-02-20',
    pendingApplicationCount: 1,
    teacherId: 'teacherLi',
    teacherName: '李老师'
  },
  {
    classId: 4,
    className: 'D级-英语基础班',
    classLevel: 'D',
    currentStudents: 48,
    maxStudents: 50,
    taskCount: 8,
    createTime: '2026-02-15',
    pendingApplicationCount: 2,
    teacherId: 'teacherWang',
    teacherName: '王老师'
  }
]

// ==================== 发布任务相关数据 ====================

// 任务类型映射
export const taskTypeMap = {
  '1': '单词学习',
  '2': '单词测试',
  '3': '综合练习'
}

// ==================== 模拟API函数 ====================

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 获取当前用户名
const getCurrentUsername = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    return userInfo.username || 'teacher'
  }
  return 'teacher'
}

// 本地存储的班级列表（模拟数据库）
// 优先从 localStorage 读取，初始化时合并持久化数据
const STORAGE_KEY = 'teacher_class_list'

// 获取持久化的班级数据
const getStoredClassList = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('读取班级数据失败:', e)
  }
  return null
}

// 保存班级数据到 localStorage
const saveClassListToStorage = (list) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.error('保存班级数据失败:', e)
  }
}

// 初始化：合并 mock 数据和持久化数据
let _localClassList
const storedList = getStoredClassList()
if (storedList && storedList.length > 0) {
  // 合并逻辑：以持久化数据为主，避免重复
  const existingIds = new Set(storedList.map(c => c.classId))
  const newFromMock = mockTeacherClassListData.filter(c => !existingIds.has(c.classId))
  _localClassList = [...storedList, ...newFromMock]
} else {
  _localClassList = [...mockTeacherClassListData]
  saveClassListToStorage(_localClassList)
}

export { _localClassList }

/**
 * 模拟获取班级概览
 */
export async function mockGetClassOverview() {
  await delay(300)
  const username = getCurrentUsername()

  const teacherClassList = _localClassList.filter(c => c.teacherId === username)
  const totalPending = teacherClassList.reduce((sum, c) => sum + (c.pendingApplicationCount || 0), 0)

  return {
    code: 200,
    data: {
      totalClasses: teacherClassList.length,
      avgCompletionRate: 0,
      pendingApplications: totalPending
    }
  }
}

/**
 * 模拟获取班级列表
 */
export async function mockGetTeacherClassList(params = {}) {
  await delay(300)

  const username = getCurrentUsername()
  let filteredList = [..._localClassList].filter(c => c.teacherId === username)

  // 按等级筛选
  if (params.classLevel) {
    filteredList = filteredList.filter(c => c.classLevel === params.classLevel)
  }

  // 分页
  const pageNum = params.pageNum || 1
  const pageSize = params.pageSize || 100
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize

  return {
    code: 200,
    rows: filteredList.slice(start, end),
    total: filteredList.length
  }
}

/**
 * 模拟获取所有班级列表（不过滤当前老师，用于展示所有老师的班级）
 */
export async function mockGetAllTeacherClassList(params = {}) {
  await delay(300)

  let filteredList = [..._localClassList]

  // 按等级筛选
  if (params.classLevel) {
    filteredList = filteredList.filter(c => c.classLevel === params.classLevel)
  }

  // 按老师筛选
  if (params.teacherId) {
    filteredList = filteredList.filter(c => c.teacherId === params.teacherId)
  }

  // 分页
  const pageNum = params.pageNum || 1
  const pageSize = params.pageSize || 100
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize

  return {
    code: 200,
    rows: filteredList.slice(start, end),
    total: filteredList.length
  }
}

/**
 * 模拟创建班级
 */
export async function mockCreateClass(data) {
  await delay(300)

  const currentTeacherId = getCurrentUsername()

  const newClass = {
    classId: Date.now(),
    className: data.className,
    classLevel: data.classLevel,
    currentStudents: 0,
    maxStudents: data.maxStudents,
    taskCount: data.taskRequirement || 0,
    createTime: new Date().toISOString().split('T')[0],
    pendingApplicationCount: 0,
    teacherId: currentTeacherId,
    teacherName: getTeacherName(currentTeacherId)
  }

  _localClassList.push(newClass)

  // 持久化到 localStorage
  saveClassListToStorage(_localClassList)

  return {
    code: 200,
    msg: '班级创建成功',
    data: newClass
  }
}

/**
 * 模拟发布任务
 */
export async function mockPublishTask(data) {
  await delay(500)

  return {
    code: 200,
    msg: '任务发布成功'
  }
}

/**
 * 模拟发布任务（包含题目）
 */
export async function mockPublishTaskWithQuestions(data) {
  await delay(500)

  const taskId = Date.now()

  return {
    code: 200,
    msg: '任务发布成功',
    data: {
      taskId: taskId
    }
  }
}

/**
 * 模拟删除班级
 */
export async function mockDeleteClass(classId) {
  await delay(300)

  const index = _localClassList.findIndex(c => c.classId === classId)
  if (index > -1) {
    _localClassList.splice(index, 1)
    // 同步到 localStorage
    saveClassListToStorage(_localClassList)
  }

  return {
    code: 200,
    msg: '班级删除成功'
  }
}

/**
 * 清除本地存储的班级数据（用于重置测试）
 */
export const clearStoredClassList = () => {
  localStorage.removeItem(STORAGE_KEY)
  _localClassList = [...mockTeacherClassListData]
}
