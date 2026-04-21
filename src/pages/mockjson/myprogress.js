/**
 * 学生学情统计相关模拟数据
 * 包含学情统计数据、近7天任务完成、单词学习趋势等数据
 */

// ==================== 学情统计数据（根据用户区分）====================

export const mockStudentStatsData = {
  student: {
    totalWordsSearched: 256,
    tasksCompleted: 8,
    wrongQuestions: 15,
    masteredWords: 128,
    totalStudyMinutes: 1850,
    // 额外统计数据
    totalQuestions: 520,
    correctRate: 82,
    learningStreak: 5,
    totalDays: 25
  },
  lisi: {
    totalWordsSearched: 320,
    tasksCompleted: 12,
    wrongQuestions: 8,
    masteredWords: 200,
    totalStudyMinutes: 2200,
    totalQuestions: 680,
    correctRate: 88,
    learningStreak: 12,
    totalDays: 45
  },
  zhangsan: {
    totalWordsSearched: 450,
    tasksCompleted: 18,
    wrongQuestions: 5,
    masteredWords: 320,
    totalStudyMinutes: 3500,
    totalQuestions: 920,
    correctRate: 94,
    learningStreak: 30,
    totalDays: 90
  }
}

// ==================== 近7天任务完成情况 ====================

export const mockWeeklyTasksData = {
  student: [
    { date: '2026-04-14', completedCount: 5, totalQuestions: 25, correctRate: 80 },
    { date: '2026-04-15', completedCount: 8, totalQuestions: 40, correctRate: 82 },
    { date: '2026-04-16', completedCount: 12, totalQuestions: 60, correctRate: 78 },
    { date: '2026-04-17', completedCount: 6, totalQuestions: 30, correctRate: 85 },
    { date: '2026-04-18', completedCount: 10, totalQuestions: 50, correctRate: 80 },
    { date: '2026-04-19', completedCount: 7, totalQuestions: 35, correctRate: 83 },
    { date: '2026-04-20', completedCount: 4, totalQuestions: 20, correctRate: 88 }
  ],
  lisi: [
    { date: '2026-04-14', completedCount: 10, totalQuestions: 50, correctRate: 85 },
    { date: '2026-04-15', completedCount: 15, totalQuestions: 75, correctRate: 87 },
    { date: '2026-04-16', completedCount: 18, totalQuestions: 90, correctRate: 86 },
    { date: '2026-04-17', completedCount: 12, totalQuestions: 60, correctRate: 88 },
    { date: '2026-04-18', completedCount: 20, totalQuestions: 100, correctRate: 85 },
    { date: '2026-04-19', completedCount: 14, totalQuestions: 70, correctRate: 90 },
    { date: '2026-04-20', completedCount: 8, totalQuestions: 40, correctRate: 92 }
  ],
  zhangsan: [
    { date: '2026-04-14', completedCount: 15, totalQuestions: 75, correctRate: 90 },
    { date: '2026-04-15', completedCount: 20, totalQuestions: 100, correctRate: 92 },
    { date: '2026-04-16', completedCount: 25, totalQuestions: 125, correctRate: 93 },
    { date: '2026-04-17', completedCount: 18, totalQuestions: 90, correctRate: 91 },
    { date: '2026-04-18', completedCount: 22, totalQuestions: 110, correctRate: 94 },
    { date: '2026-04-19', completedCount: 16, totalQuestions: 80, correctRate: 95 },
    { date: '2026-04-20', completedCount: 10, totalQuestions: 50, correctRate: 96 }
  ]
}

// ==================== 近7天单词学习情况 ====================

export const mockWeeklyWordsData = {
  student: [
    { date: '2026-04-14', masteredCount: 8, reviewedCount: 15 },
    { date: '2026-04-15', masteredCount: 12, reviewedCount: 22 },
    { date: '2026-04-16', masteredCount: 15, reviewedCount: 28 },
    { date: '2026-04-17', masteredCount: 10, reviewedCount: 20 },
    { date: '2026-04-18', masteredCount: 14, reviewedCount: 25 },
    { date: '2026-04-19', masteredCount: 11, reviewedCount: 18 },
    { date: '2026-04-20', masteredCount: 6, reviewedCount: 12 }
  ],
  lisi: [
    { date: '2026-04-14', masteredCount: 12, reviewedCount: 20 },
    { date: '2026-04-15', masteredCount: 18, reviewedCount: 30 },
    { date: '2026-04-16', masteredCount: 22, reviewedCount: 35 },
    { date: '2026-04-17', masteredCount: 15, reviewedCount: 25 },
    { date: '2026-04-18', masteredCount: 20, reviewedCount: 32 },
    { date: '2026-04-19', masteredCount: 16, reviewedCount: 28 },
    { date: '2026-04-20', masteredCount: 10, reviewedCount: 18 }
  ],
  zhangsan: [
    { date: '2026-04-14', masteredCount: 18, reviewedCount: 25 },
    { date: '2026-04-15', masteredCount: 25, reviewedCount: 35 },
    { date: '2026-04-16', masteredCount: 30, reviewedCount: 42 },
    { date: '2026-04-17', masteredCount: 22, reviewedCount: 32 },
    { date: '2026-04-18', masteredCount: 28, reviewedCount: 38 },
    { date: '2026-04-19', masteredCount: 20, reviewedCount: 30 },
    { date: '2026-04-20', masteredCount: 12, reviewedCount: 20 }
  ]
}

// ==================== 知识点掌握情况 ====================

export const mockKnowledgePointsData = {
  student: [
    { name: '基础词汇', mastered: 85, total: 100, rate: 85 },
    { name: '语法基础', mastered: 72, total: 100, rate: 72 },
    { name: '阅读理解', mastered: 65, total: 100, rate: 65 },
    { name: '完形填空', mastered: 58, total: 100, rate: 58 },
    { name: '写作能力', mastered: 45, total: 100, rate: 45 }
  ],
  lisi: [
    { name: '基础词汇', mastered: 92, total: 100, rate: 92 },
    { name: '语法基础', mastered: 85, total: 100, rate: 85 },
    { name: '阅读理解', mastered: 80, total: 100, rate: 80 },
    { name: '完形填空', mastered: 75, total: 100, rate: 75 },
    { name: '写作能力', mastered: 68, total: 100, rate: 68 }
  ],
  zhangsan: [
    { name: '基础词汇', mastered: 98, total: 100, rate: 98 },
    { name: '语法基础', mastered: 95, total: 100, rate: 95 },
    { name: '阅读理解', mastered: 92, total: 100, rate: 92 },
    { name: '完形填空', mastered: 88, total: 100, rate: 88 },
    { name: '写作能力', mastered: 85, total: 100, rate: 85 }
  ]
}

// ==================== 学习时间分布 ====================

export const mockStudyTimeData = {
  student: {
    morning: 25,    // 6-12点
    afternoon: 30,  // 12-18点
    evening: 40,    // 18-24点
    night: 5        // 0-6点
  },
  lisi: {
    morning: 35,
    afternoon: 25,
    evening: 35,
    night: 5
  },
  zhangsan: {
    morning: 40,
    afternoon: 20,
    evening: 35,
    night: 5
  }
}

// ==================== 任务类型完成统计 ====================

export const mockTaskTypeStatsData = {
  student: [
    { type: '单词测试', completed: 15, avgScore: 85 },
    { type: '阅读理解', completed: 10, avgScore: 78 },
    { type: '语法练习', completed: 12, avgScore: 82 },
    { type: '听力练习', completed: 8, avgScore: 75 },
    { type: '写作练习', completed: 5, avgScore: 70 }
  ],
  lisi: [
    { type: '单词测试', completed: 20, avgScore: 92 },
    { type: '阅读理解', completed: 15, avgScore: 88 },
    { type: '语法练习', completed: 18, avgScore: 90 },
    { type: '听力练习', completed: 10, avgScore: 85 },
    { type: '写作练习', completed: 8, avgScore: 82 }
  ],
  zhangsan: [
    { type: '单词测试', completed: 25, avgScore: 96 },
    { type: '阅读理解', completed: 20, avgScore: 94 },
    { type: '语法练习', completed: 22, avgScore: 95 },
    { type: '听力练习', completed: 15, avgScore: 90 },
    { type: '写作练习', completed: 12, avgScore: 88 }
  ]
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
 * 模拟获取学情统计数据
 */
export async function mockGetStudentStats() {
  await delay(300)
  const username = getCurrentUsername()
  const stats = mockStudentStatsData[username] || mockStudentStatsData.student
  
  return {
    code: 200,
    data: stats
  }
}

/**
 * 模拟获取近7天任务完成情况
 */
export async function mockGetWeeklyTasks() {
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
export async function mockGetWeeklyWords() {
  await delay(300)
  const username = getCurrentUsername()
  const data = mockWeeklyWordsData[username] || mockWeeklyWordsData.student
  
  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取知识点掌握情况
 */
export async function mockGetKnowledgePoints() {
  await delay(200)
  const username = getCurrentUsername()
  const data = mockKnowledgePointsData[username] || mockKnowledgePointsData.student
  
  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取学习时间分布
 */
export async function mockGetStudyTimeDistribution() {
  await delay(200)
  const username = getCurrentUsername()
  const data = mockStudyTimeData[username] || mockStudyTimeData.student
  
  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取任务类型完成统计
 */
export async function mockGetTaskTypeStats() {
  await delay(200)
  const username = getCurrentUsername()
  const data = mockTaskTypeStatsData[username] || mockTaskTypeStatsData.student
  
  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取综合学情报告
 */
export async function mockGetProgressReport() {
  await delay(400)
  const username = getCurrentUsername()
  
  const stats = mockStudentStatsData[username] || mockStudentStatsData.student
  const weeklyTasks = mockWeeklyTasksData[username] || mockWeeklyTasksData.student
  const weeklyWords = mockWeeklyWordsData[username] || mockWeeklyWordsData.student
  const knowledgePoints = mockKnowledgePointsData[username] || mockKnowledgePointsData.student
  
  // 计算周趋势
  const taskTrend = weeklyTasks.length >= 2 
    ? weeklyTasks[weeklyTasks.length - 1].completedCount - weeklyTasks[weeklyTasks.length - 2].completedCount
    : 0
  const wordTrend = weeklyWords.length >= 2
    ? weeklyWords[weeklyWords.length - 1].masteredCount - weeklyWords[weeklyWords.length - 2].masteredCount
    : 0
  
  return {
    code: 200,
    data: {
      stats,
      weeklyTasks,
      weeklyWords,
      knowledgePoints,
      trends: {
        taskTrend,
        wordTrend,
        taskTrendText: taskTrend >= 0 ? `较上周+${taskTrend}` : `较上周${taskTrend}`,
        wordTrendText: wordTrend >= 0 ? `较上周+${wordTrend}` : `较上周${wordTrend}`
      },
      summary: {
        level: username === 'zhangsan' ? '优秀' : username === 'lisi' ? '良好' : '中等',
        recommendation: username === 'zhangsan' 
          ? '继续保持，可以挑战更高难度的内容'
          : username === 'lisi'
          ? '建议加强写作和听力练习'
          : '建议加强语法基础和写作练习'
      }
    }
  }
}
