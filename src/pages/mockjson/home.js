/**
 * 学生首页相关模拟数据
 * 包含学习概览、打卡状态、近7天任务完成、单词学习趋势等数据
 */


// ==================== 学生学习概览数据（根据用户区分）====================

export const mockStudentOverviewData = {
  student: {
    todayWordsLearned: 15,
    totalWrongQuestions: 15,
    classRank: 5,
    pendingTasks: 3,
    todayStudyMinutes: 45,
    todayTasksCompleted: 2,
    totalStudyMinutes: 1850,
    masteredWords: 128,
    tasksCompleted: 8,
    totalWordsSearched: 256
  },
  lisi: {
    todayWordsLearned: 20,
    totalWrongQuestions: 8,
    classRank: 3,
    pendingTasks: 2,
    todayStudyMinutes: 60,
    todayTasksCompleted: 3,
    totalStudyMinutes: 2200,
    masteredWords: 200,
    tasksCompleted: 12,
    totalWordsSearched: 320
  },
  zhangsan: {
    todayWordsLearned: 25,
    totalWrongQuestions: 5,
    classRank: 2,
    pendingTasks: 1,
    todayStudyMinutes: 80,
    todayTasksCompleted: 4,
    totalStudyMinutes: 3500,
    masteredWords: 320,
    tasksCompleted: 18,
    totalWordsSearched: 450
  }
}

// ==================== 打卡状态数据 ====================

// 生成从3月到今天的打卡记录（连续5天，累计16天）
const generateClockInDates = () => {
  // 从3月到4月15日，随机打一些卡（累计16天 = 11天历史 + 5天连续）
  const historicalDates = [
    '2026-03-03', '2026-03-08', '2026-03-12', '2026-03-17', '2026-03-22',
    '2026-03-26', '2026-03-30', '2026-04-03', '2026-04-07', '2026-04-11',
    '2026-04-15'
  ]
  // 最近5天连续打卡（4月16日到4月20日）
  const recentConsecutive = [
    '2026-04-16', '2026-04-17', '2026-04-18', '2026-04-19', '2026-04-20'
  ]
  return [...historicalDates, ...recentConsecutive]  // 共16天
}

export const mockClockInData = {
  student: {
    clockedIn: true,
    clockInDate: '2026-04-20',
    consecutiveDays: 5,
    totalDays: 16,
    clockInDates: generateClockInDates()
  },
  lisi: {
    clockedIn: true,
    clockInDate: '2026-04-20',
    consecutiveDays: 12,
    totalDays: 45
  },
  zhangsan: {
    clockedIn: true,
    clockInDate: '2026-04-20',
    consecutiveDays: 30,
    totalDays: 90
  }
}

// ==================== 近7天任务完成情况 ====================

export const mockWeeklyTasksData = {
  student: [
    { date: '2026-04-14', completedCount: 5 },
    { date: '2026-04-15', completedCount: 8 },
    { date: '2026-04-16', completedCount: 12 },
    { date: '2026-04-17', completedCount: 6 },
    { date: '2026-04-18', completedCount: 10 },
    { date: '2026-04-19', completedCount: 7 },
    { date: '2026-04-20', completedCount: 4 }
  ],
  lisi: [
    { date: '2026-04-14', completedCount: 10 },
    { date: '2026-04-15', completedCount: 15 },
    { date: '2026-04-16', completedCount: 18 },
    { date: '2026-04-17', completedCount: 12 },
    { date: '2026-04-18', completedCount: 20 },
    { date: '2026-04-19', completedCount: 14 },
    { date: '2026-04-20', completedCount: 8 }
  ],
  zhangsan: [
    { date: '2026-04-14', completedCount: 15 },
    { date: '2026-04-15', completedCount: 20 },
    { date: '2026-04-16', completedCount: 25 },
    { date: '2026-04-17', completedCount: 18 },
    { date: '2026-04-18', completedCount: 22 },
    { date: '2026-04-19', completedCount: 16 },
    { date: '2026-04-20', completedCount: 10 }
  ]
}

// ==================== 近7天单词学习情况 ====================

export const mockWeeklyWordsData = {
  student: [
    { date: '2026-04-14', masteredCount: 8 },
    { date: '2026-04-15', masteredCount: 12 },
    { date: '2026-04-16', masteredCount: 15 },
    { date: '2026-04-17', masteredCount: 10 },
    { date: '2026-04-18', masteredCount: 14 },
    { date: '2026-04-19', masteredCount: 11 },
    { date: '2026-04-20', masteredCount: 6 }
  ],
  lisi: [
    { date: '2026-04-14', masteredCount: 12 },
    { date: '2026-04-15', masteredCount: 18 },
    { date: '2026-04-16', masteredCount: 22 },
    { date: '2026-04-17', masteredCount: 15 },
    { date: '2026-04-18', masteredCount: 20 },
    { date: '2026-04-19', masteredCount: 16 },
    { date: '2026-04-20', masteredCount: 10 }
  ],
  zhangsan: [
    { date: '2026-04-14', masteredCount: 18 },
    { date: '2026-04-15', masteredCount: 25 },
    { date: '2026-04-16', masteredCount: 30 },
    { date: '2026-04-17', masteredCount: 22 },
    { date: '2026-04-18', masteredCount: 28 },
    { date: '2026-04-19', masteredCount: 20 },
    { date: '2026-04-20', masteredCount: 12 }
  ]
}

// ==================== 未完成任务列表（首页展示）====================

export const mockHomePendingTasksData = {
  student: [
    { id: 1, title: '第三单元单词测试', deadline: '2026-04-25', questionCount: 50, urgency: 'normal' },
    { id: 2, title: '阅读理解练习', deadline: '2026-04-28', questionCount: 30, urgency: 'normal' },
    { id: 3, title: '单词听写', deadline: '2026-04-30', questionCount: 40, urgency: 'comfortable' }
  ],
  lisi: [
    { id: 4, title: '第五单元语法练习', deadline: '2026-04-22', questionCount: 45, urgency: 'urgent' },
    { id: 5, title: '完形填空练习', deadline: '2026-04-26', questionCount: 35, urgency: 'normal' }
  ],
  zhangsan: [
    { id: 6, title: '写作练习', deadline: '2026-04-23', questionCount: 20, urgency: 'urgent' }
  ]
}

// ==================== 班级任务完成进度 ====================

export const mockClassProgressData = {
  student: {
    completed: 12,
    total: 18,
    rate: 67,
    ranking: 3,
    totalClasses: 8
  },
  lisi: {
    completed: 15,
    total: 20,
    rate: 75,
    ranking: 2,
    totalClasses: 8
  },
  zhangsan: {
    completed: 18,
    total: 20,
    rate: 90,
    ranking: 1,
    totalClasses: 8
  }
}

// ==================== 模拟API函数 ====================

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 获取当前用户名
const getCurrentUsername = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    return userInfo.username || 'student'
  }
  return 'student'
}

/**
 * 模拟获取学生概览
 */
export async function mockGetStudentOverview() {
  await delay(300)
  const username = getCurrentUsername()
  const overview = mockStudentOverviewData[username] || mockStudentOverviewData.student
  
  return {
    code: 200,
    data: overview
  }
}

/**
 * 模拟打卡
 */
export async function mockClockIn() {
  await delay(300)
  const username = getCurrentUsername()
  const today = new Date().toISOString().split('T')[0]
  
  // 获取当前打卡数据
  const currentData = mockClockInData[username] || mockClockInData.student
  
  // 更新打卡记录
  if (!currentData.clockInDates) {
    currentData.clockInDates = []
  }
  if (!currentData.clockInDates.includes(today)) {
    currentData.clockInDates.push(today)
    currentData.totalDays++
    currentData.consecutiveDays++
  }
  currentData.clockedIn = true
  currentData.clockInDate = today
  
  return {
    code: 200,
    data: {
      clockedIn: true,
      clockInDate: today,
      consecutiveDays: currentData.consecutiveDays,
      totalDays: currentData.totalDays
    }
  }
}

/**
 * 模拟获取打卡状态
 */
export async function mockGetClockInStatus() {
  await delay(200)
  const username = getCurrentUsername()
  const clockIn = mockClockInData[username] || mockClockInData.student
  
  return {
    code: 200,
    data: clockIn
  }
}

/**
 * 模拟获取近7天任务完成情况
 */
export async function mockGetWeeklyQuestions() {
  await delay(300)
  const username = getCurrentUsername()
  const data = mockWeeklyTasksData[username] || mockWeeklyTasksData.student
  
  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取近7天单词学习情况
 */
export async function mockGetWeeklyWordsStudied() {
  await delay(300)
  const username = getCurrentUsername()
  const data = mockWeeklyWordsData[username] || mockWeeklyWordsData.student
  
  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取首页未完成任务列表
 */
export async function mockGetHomePendingTasks() {
  await delay(200)
  const username = getCurrentUsername()
  const data = mockHomePendingTasksData[username] || mockHomePendingTasksData.student
  
  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取班级任务完成进度
 */
export async function mockGetClassProgress() {
  await delay(200)
  const username = getCurrentUsername()
  const data = mockClassProgressData[username] || mockClassProgressData.student
  
  return {
    code: 200,
    data: data
  }
}
