/**
 * 学生入班/转班/退班数据管理
 * 记录学生当前班级、历史班级、首次入班状态、任务完成率等信息
 */

const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms))

// 获取当前用户名
const getCurrentUsername = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    return userInfo.username || 'student'
  }
  return 'student'
}

// 获取当前用户角色
const getCurrentRole = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    return userInfo.role || 'student'
  }
  return 'student'
}

// ==================== 老师班级数据 ====================
// 老师ID与班级的映射关系
export const teacherClasses = {
  teacher: [1, 2],      // teacher 老师有班级1和班级2
  teacherLi: [3],        // teacherLi 老师有班级3
  teacherWang: [4]       // teacherWang 老师有班级4
}

// 班级信息
export const classInfo = {
  1: { className: 'A级-英语精英班', teacherId: 'teacher' },
  2: { className: 'B级-英语进阶班', teacherId: 'teacher' },
  3: { className: 'C级-英语提高班', teacherId: 'teacherLi' },
  4: { className: 'D级-英语基础班', teacherId: 'teacherWang' }
}

// ==================== 学生入班记录（核心数据）====================
// 初始状态：所有学生都未入班
// 初始数据结构：
// studentEnrollmentData: {
//   [username]: {
//     currentClassId: null | classId,      // 当前所在班级ID
//     history: [                           // 历史入班记录
//       {
//         classId: classId,              // 班级ID
//         joinTime: timestamp,            // 加入时间
//         quitTime: timestamp | null,     // 退出时间
//         isFirstJoin: boolean,           // 是否首次加入该班级
//         transferFrom: classId | null,   // 从哪个班级转入（null表示首次入班）
//         taskStats: {                    // 任务统计
//           total: number,               // 总任务数
//           completed: number,           // 已完成任务数
//           completionRate: number       // 完成率百分比
//         }
//       }
//     ]
//   }
// }

// 本地存储的入班数据
let studentEnrollmentData = {}

// 从本地存储加载数据
const loadEnrollmentData = () => {
  const stored = localStorage.getItem('studentEnrollmentData')
  if (stored) {
    studentEnrollmentData = JSON.parse(stored)
  }
}

// 保存入班数据到本地存储
const saveEnrollmentData = () => {
  localStorage.setItem('studentEnrollmentData', JSON.stringify(studentEnrollmentData))
}

// 初始化学生入班记录
const initStudentEnrollment = (username) => {
  if (!studentEnrollmentData[username]) {
    studentEnrollmentData[username] = {
      currentClassId: null,
      history: []
    }
  }
  return studentEnrollmentData[username]
}

// ==================== 模拟API函数 ====================

/**
 * 获取学生在某个班级的任务完成率
 */
export async function mockGetStudentClassStats(username, classId) {
  await delay()
  loadEnrollmentData()
  const enrollment = studentEnrollmentData[username]
  
  if (!enrollment) {
    return { total: 0, completed: 0, completionRate: 0 }
  }
  
  const historyItem = enrollment.history.find(h => h.classId === classId)
  
  if (historyItem) {
    return historyItem.taskStats
  }
  
  return { total: 0, completed: 0, completionRate: 0 }
}

/**
 * 获取学生的当前班级信息
 */
export async function mockGetStudentCurrentClass(username) {
  await delay()
  loadEnrollmentData()
  const enrollment = initStudentEnrollment(username)
  
  if (!enrollment.currentClassId) {
    return {
      classId: null,
      className: null,
      teacherId: null,
      joinTime: null,
      isFirstJoin: true
    }
  }
  
  const classData = classInfo[enrollment.currentClassId]
  const historyItem = enrollment.history.find(h => h.classId === enrollment.currentClassId)
  
  return {
    classId: enrollment.currentClassId,
    className: classData?.className || '未知班级',
    teacherId: classData?.teacherId || null,
    joinTime: historyItem?.joinTime || null,
    isFirstJoin: historyItem?.isFirstJoin || false
  }
}

/**
 * 获取学生的班级历史记录
 */
export async function mockGetStudentClassHistory(username) {
  await delay()
  loadEnrollmentData()
  const enrollment = initStudentEnrollment(username)
  
  return enrollment.history.map(h => ({
    ...h,
    className: classInfo[h.classId]?.className || '未知班级'
  }))
}

/**
 * 学生申请加入班级
 */
export async function mockApplyJoinClass(username, classId) {
  await delay(200)
  loadEnrollmentData()
  const enrollment = initStudentEnrollment(username)
  
  // 检查是否已经在该班级
  if (enrollment.currentClassId === classId) {
    return {
      code: 400,
      msg: '您已经在该班级中'
    }
  }
  
  // 检查班级是否存在
  if (!classInfo[classId]) {
    return {
      code: 404,
      msg: '班级不存在'
    }
  }
  
  const classData = classInfo[classId]
  
  // 检查是否是首次加入该班级
  const existingHistory = enrollment.history.find(h => h.classId === classId)
  const isFirstJoin = !existingHistory
  
  // 如果从其他班级转入，记录原班级
  const transferFrom = enrollment.currentClassId
  
  // 创建历史记录
  const historyEntry = {
    classId: classId,
    joinTime: Date.now(),
    quitTime: null,
    isFirstJoin: isFirstJoin,
    transferFrom: transferFrom,
    taskStats: {
      total: 0,
      completed: 0,
      completionRate: 0
    }
  }
  
  // 更新历史记录
  if (existingHistory) {
    Object.assign(existingHistory, {
      joinTime: Date.now(),
      quitTime: null,
      isFirstJoin: isFirstJoin,
      transferFrom: transferFrom
    })
  } else {
    enrollment.history.push(historyEntry)
  }
  
  // 更新当前班级
  enrollment.currentClassId = classId
  
  saveEnrollmentData()
  
  return {
    code: 200,
    msg: '申请已提交，等待老师审核',
    data: {
      classId: classId,
      className: classData.className,
      teacherId: classData.teacherId,
      isFirstJoin: isFirstJoin
    }
  }
}

/**
 * 学生直接加入班级（无需审核，用于测试）
 */
export async function mockDirectJoinClass(username, classId) {
  await delay(100)
  loadEnrollmentData()
  const enrollment = initStudentEnrollment(username)
  
  // 检查班级是否存在
  if (!classInfo[classId]) {
    return {
      code: 404,
      msg: '班级不存在'
    }
  }
  
  const classData = classInfo[classId]
  
  // 检查是否是首次加入该班级
  const existingHistory = enrollment.history.find(h => h.classId === classId)
  const isFirstJoin = !existingHistory
  
  // 如果从其他班级转入，记录原班级
  const transferFrom = enrollment.currentClassId
  
  // 创建历史记录
  const historyEntry = {
    classId: classId,
    joinTime: Date.now(),
    quitTime: null,
    isFirstJoin: isFirstJoin,
    transferFrom: transferFrom,
    taskStats: {
      total: 0,
      completed: 0,
      completionRate: 0
    }
  }
  
  // 更新历史记录
  if (existingHistory) {
    Object.assign(existingHistory, {
      joinTime: Date.now(),
      quitTime: null,
      isFirstJoin: isFirstJoin,
      transferFrom: transferFrom
    })
  } else {
    enrollment.history.push(historyEntry)
  }
  
  // 更新当前班级
  enrollment.currentClassId = classId
  
  saveEnrollmentData()
  
  return {
    code: 200,
    msg: '成功加入班级',
    data: {
      classId: classId,
      className: classData.className,
      teacherId: classData.teacherId,
      isFirstJoin: isFirstJoin
    }
  }
}

/**
 * 学生申请退出班级
 */
export async function mockApplyQuitClass(username) {
  await delay(200)
  loadEnrollmentData()
  const enrollment = studentEnrollmentData[username]
  
  if (!enrollment || !enrollment.currentClassId) {
    return {
      code: 400,
      msg: '您当前不在任何班级中'
    }
  }
  
  const currentClassId = enrollment.currentClassId
  const historyItem = enrollment.history.find(h => h.classId === currentClassId)
  
  if (historyItem) {
    historyItem.quitTime = Date.now()
  }
  
  enrollment.currentClassId = null
  saveEnrollmentData()
  
  return {
    code: 200,
    msg: '已提交退班申请'
  }
}

/**
 * 学生直接退出班级（无需审核，用于测试）
 */
export async function mockDirectQuitClass(username) {
  await delay(100)
  loadEnrollmentData()
  const enrollment = studentEnrollmentData[username]
  
  if (!enrollment || !enrollment.currentClassId) {
    return {
      code: 400,
      msg: '您当前不在任何班级中'
    }
  }
  
  const currentClassId = enrollment.currentClassId
  const historyItem = enrollment.history.find(h => h.classId === currentClassId)
  
  if (historyItem) {
    historyItem.quitTime = Date.now()
  }
  
  enrollment.currentClassId = null
  saveEnrollmentData()
  
  return {
    code: 200,
    msg: '已退出班级'
  }
}

/**
 * 获取指定班级的学生列表
 */
export async function mockGetClassStudents(classId) {
  await delay(200)
  loadEnrollmentData()
  
  const students = []
  
  Object.keys(studentEnrollmentData).forEach(username => {
    const enrollment = studentEnrollmentData[username]
    if (enrollment.currentClassId === classId) {
      const historyItem = enrollment.history.find(h => h.classId === classId)
      students.push({
        username: username,
        joinTime: historyItem?.joinTime || null,
        taskStats: historyItem?.taskStats || { total: 0, completed: 0, completionRate: 0 }
      })
    }
  })
  
  return {
    code: 200,
    data: students
  }
}

/**
 * 获取某个老师所有班级的学生总数
 */
export async function mockGetTeacherStudentCount(teacherId) {
  await delay(100)
  loadEnrollmentData()
  
  const classIds = teacherClasses[teacherId] || []
  let totalCount = 0
  
  Object.keys(studentEnrollmentData).forEach(username => {
    const enrollment = studentEnrollmentData[username]
    if (classIds.includes(enrollment.currentClassId)) {
      totalCount++
    }
  })
  
  return {
    code: 200,
    data: {
      teacherId: teacherId,
      classIds: classIds,
      totalStudents: totalCount,
      classStudentCounts: classIds.map(classId => {
        let count = 0
        Object.keys(studentEnrollmentData).forEach(username => {
          if (studentEnrollmentData[username].currentClassId === classId) {
            count++
          }
        })
        return { classId, count }
      })
    }
  }
}

/**
 * 获取当前老师的所有学生数（根据登录用户）
 */
export async function mockGetCurrentTeacherStudentCount() {
  await delay(100)
  const teacherId = getCurrentUsername()
  
  // 确保是老师角色
  if (!teacherClasses[teacherId]) {
    return {
      code: 200,
      data: {
        teacherId: teacherId,
        totalStudents: 0,
        classStudentCounts: []
      }
    }
  }
  
  return mockGetTeacherStudentCount(teacherId)
}

/**
 * 更新学生的任务完成率
 */
export async function mockUpdateStudentTaskStats(username, classId, taskStats) {
  await delay(100)
  loadEnrollmentData()
  const enrollment = studentEnrollmentData[username]
  
  if (!enrollment) {
    return { code: 404, msg: '学生记录不存在' }
  }
  
  const historyItem = enrollment.history.find(h => h.classId === classId)
  
  if (historyItem) {
    historyItem.taskStats = {
      total: taskStats.total || 0,
      completed: taskStats.completed || 0,
      completionRate: taskStats.total > 0 
        ? Math.round((taskStats.completed / taskStats.total) * 100) 
        : 0
    }
    saveEnrollmentData()
  }
  
  return { code: 200, msg: '更新成功' }
}

/**
 * 获取班级学生的详细统计
 */
export async function mockGetClassStudentStats(classId) {
  await delay(200)
  loadEnrollmentData()
  
  const students = []
  let totalTasks = 0
  let totalCompleted = 0
  
  Object.keys(studentEnrollmentData).forEach(username => {
    const enrollment = studentEnrollmentData[username]
    if (enrollment.currentClassId === classId) {
      const historyItem = enrollment.history.find(h => h.classId === classId)
      const stats = historyItem?.taskStats || { total: 0, completed: 0, completionRate: 0 }
      totalTasks += stats.total
      totalCompleted += stats.completed
      students.push({
        username: username,
        joinTime: historyItem?.joinTime || null,
        ...stats
      })
    }
  })
  
  return {
    code: 200,
    data: {
      classId: classId,
      className: classInfo[classId]?.className || '未知班级',
      studentCount: students.length,
      totalTasks: totalTasks,
      totalCompleted: totalCompleted,
      avgCompletionRate: totalTasks > 0 
        ? Math.round((totalCompleted / totalTasks) * 100) 
        : 0,
      students: students
    }
  }
}

/**
 * 重置所有学生入班数据（用于测试）
 */
export async function mockResetEnrollmentData() {
  await delay(100)
  studentEnrollmentData = {}
  localStorage.removeItem('studentEnrollmentData')
  return { code: 200, msg: '数据已重置' }
}

/**
 * 初始化测试数据 - 将部分学生分配到班级
 */
export async function mockInitTestData() {
  await delay(200)
  loadEnrollmentData()
  
  // 为测试账户初始化一些入班记录
  const testData = [
    { username: 'student', classId: 1, taskStats: { total: 20, completed: 14, completionRate: 70 } },
    { username: 'lisi', classId: 1, taskStats: { total: 20, completed: 18, completionRate: 90 } },
    { username: 'zhangsan', classId: 2, taskStats: { total: 15, completed: 12, completionRate: 80 } }
  ]
  
  testData.forEach(data => {
    const enrollment = initStudentEnrollment(data.username)
    
    // 检查是否已有该班级的历史记录
    const existingHistory = enrollment.history.find(h => h.classId === data.classId)
    
    if (existingHistory) {
      existingHistory.joinTime = Date.now() - 7 * 24 * 60 * 60 * 1000 // 7天前加入
      existingHistory.taskStats = data.taskStats
    } else {
      enrollment.history.push({
        classId: data.classId,
        joinTime: Date.now() - 7 * 24 * 60 * 60 * 1000,
        quitTime: null,
        isFirstJoin: true,
        transferFrom: null,
        taskStats: data.taskStats
      })
    }
    
    enrollment.currentClassId = data.classId
  })
  
  saveEnrollmentData()
  
  return {
    code: 200,
    msg: '测试数据初始化成功',
    data: {
      'student': { classId: 1, className: classInfo[1].className },
      'lisi': { classId: 1, className: classInfo[1].className },
      'zhangsan': { classId: 2, className: classInfo[2].className }
    }
  }
}

// 导出数据用于调试
export const getEnrollmentData = () => {
  loadEnrollmentData()
  return studentEnrollmentData
}
