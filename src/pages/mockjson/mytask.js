/**
 * 学生任务相关模拟数据
 * 包含未完成任务、已完成任务、任务题目等数据
 */

// ==================== 未完成任务（根据用户区分）====================

export const mockPendingTasksData = {
  student: [
    {
      taskId: 1,
      taskName: '第三单元单词测试',
      taskType: '1',
      taskTypeText: '单词测试',
      questionCount: 50,
      startTime: '2026-04-10',
      endTime: '2026-04-25',
      className: 'D级-英语基础班',
      classLevel: 'D',
      teacherName: '李老师',
      taskStatus: '1',
      taskStatusText: '进行中'
    },
    {
      taskId: 2,
      taskName: '阅读理解练习',
      taskType: '2',
      taskTypeText: '阅读理解',
      questionCount: 30,
      startTime: '2026-04-12',
      endTime: '2026-04-28',
      className: 'D级-英语基础班',
      classLevel: 'D',
      teacherName: '李老师',
      taskStatus: '0',
      taskStatusText: '未开始'
    },
    {
      taskId: 3,
      taskName: '单词听写',
      taskType: '1',
      taskTypeText: '单词测试',
      questionCount: 40,
      startTime: '2026-04-15',
      endTime: '2026-04-30',
      className: 'D级-英语基础班',
      classLevel: 'D',
      teacherName: '李老师',
      taskStatus: '0',
      taskStatusText: '未开始'
    },
    {
      taskId: 4,
      taskName: '语法练习',
      taskType: '3',
      taskTypeText: '语法练习',
      questionCount: 25,
      startTime: '2026-04-18',
      endTime: '2026-05-05',
      className: 'D级-英语基础班',
      classLevel: 'D',
      teacherName: '李老师',
      taskStatus: '0',
      taskStatusText: '未开始'
    }
  ],
  lisi: [
    {
      taskId: 5,
      taskName: '第五单元语法练习',
      taskType: '3',
      taskTypeText: '语法练习',
      questionCount: 45,
      startTime: '2026-04-10',
      endTime: '2026-04-22',
      className: 'C级-英语提高班',
      classLevel: 'C',
      teacherName: '王老师',
      taskStatus: '1',
      taskStatusText: '进行中'
    },
    {
      taskId: 6,
      taskName: '完形填空练习',
      taskType: '2',
      taskTypeText: '阅读理解',
      questionCount: 35,
      startTime: '2026-04-12',
      endTime: '2026-04-26',
      className: 'C级-英语提高班',
      classLevel: 'C',
      teacherName: '王老师',
      taskStatus: '0',
      taskStatusText: '未开始'
    },
    {
      taskId: 7,
      taskName: '单词测试',
      taskType: '1',
      taskTypeText: '单词测试',
      questionCount: 50,
      startTime: '2026-04-15',
      endTime: '2026-04-29',
      className: 'C级-英语提高班',
      classLevel: 'C',
      teacherName: '王老师',
      taskStatus: '0',
      taskStatusText: '未开始'
    }
  ],
  zhangsan: [
    {
      taskId: 8,
      taskName: '写作练习',
      taskType: '5',
      taskTypeText: '写作练习',
      questionCount: 20,
      startTime: '2026-04-10',
      endTime: '2026-04-23',
      className: 'B级-英语进阶班',
      classLevel: 'B',
      teacherName: '张老师',
      taskStatus: '1',
      taskStatusText: '进行中'
    },
    {
      taskId: 9,
      taskName: '高级语法练习',
      taskType: '3',
      taskTypeText: '语法练习',
      questionCount: 40,
      startTime: '2026-04-15',
      endTime: '2026-04-30',
      className: 'B级-英语进阶班',
      classLevel: 'B',
      teacherName: '张老师',
      taskStatus: '0',
      taskStatusText: '未开始'
    }
  ]
}

// ==================== 已完成任务（根据用户区分）====================

export const mockCompletedTasksData = {
  student: [
    {
      taskId: 101,
      taskName: '第一单元单词测试',
      taskType: '1',
      taskTypeText: '单词测试',
      questionCount: 45,
      startTime: '2026-03-01',
      endTime: '2026-03-15',
      className: 'D级-英语基础班',
      classLevel: 'D',
      teacherName: '李老师',
      taskStatus: '2',
      taskStatusText: '已完成',
      score: 88,
      isPassed: true,
      submitTime: '2026-03-14 14:30'
    },
    {
      taskId: 102,
      taskName: '第二单元语法练习',
      taskType: '3',
      taskTypeText: '语法练习',
      questionCount: 35,
      startTime: '2026-03-16',
      endTime: '2026-03-31',
      className: 'D级-英语基础班',
      classLevel: 'D',
      teacherName: '李老师',
      taskStatus: '2',
      taskStatusText: '已完成',
      score: 92,
      isPassed: true,
      submitTime: '2026-03-30 16:20'
    },
    {
      taskId: 103,
      taskName: '听力练习',
      taskType: '4',
      taskTypeText: '听力练习',
      questionCount: 25,
      startTime: '2026-04-01',
      endTime: '2026-04-10',
      className: 'D级-英语基础班',
      classLevel: 'D',
      teacherName: '李老师',
      taskStatus: '2',
      taskStatusText: '已完成',
      score: 78,
      isPassed: true,
      submitTime: '2026-04-09 20:15'
    },
    {
      taskId: 104,
      taskName: '阅读理解练习',
      taskType: '2',
      taskTypeText: '阅读理解',
      questionCount: 30,
      startTime: '2026-04-05',
      endTime: '2026-04-15',
      className: 'D级-英语基础班',
      classLevel: 'D',
      teacherName: '李老师',
      taskStatus: '2',
      taskStatusText: '已完成',
      score: 85,
      isPassed: true,
      submitTime: '2026-04-14 18:45'
    }
  ],
  lisi: [
    {
      taskId: 201,
      taskName: '第一单元测试',
      taskType: '1',
      taskTypeText: '单词测试',
      questionCount: 50,
      startTime: '2026-03-01',
      endTime: '2026-03-15',
      className: 'C级-英语提高班',
      classLevel: 'C',
      teacherName: '王老师',
      taskStatus: '2',
      taskStatusText: '已完成',
      score: 95,
      isPassed: true,
      submitTime: '2026-03-14 15:20'
    },
    {
      taskId: 202,
      taskName: '第二单元语法练习',
      taskType: '3',
      taskTypeText: '语法练习',
      questionCount: 40,
      startTime: '2026-03-16',
      endTime: '2026-03-31',
      className: 'C级-英语提高班',
      classLevel: 'C',
      teacherName: '王老师',
      taskStatus: '2',
      taskStatusText: '已完成',
      score: 90,
      isPassed: true,
      submitTime: '2026-03-30 17:30'
    },
    {
      taskId: 203,
      taskName: '阅读理解练习',
      taskType: '2',
      taskTypeText: '阅读理解',
      questionCount: 35,
      startTime: '2026-04-01',
      endTime: '2026-04-12',
      className: 'C级-英语提高班',
      classLevel: 'C',
      teacherName: '王老师',
      taskStatus: '2',
      taskStatusText: '已完成',
      score: 88,
      isPassed: true,
      submitTime: '2026-04-11 19:00'
    }
  ],
  zhangsan: [
    {
      taskId: 301,
      taskName: '高级单词测试',
      taskType: '1',
      taskTypeText: '单词测试',
      questionCount: 60,
      startTime: '2026-03-01',
      endTime: '2026-03-15',
      className: 'B级-英语进阶班',
      classLevel: 'B',
      teacherName: '张老师',
      taskStatus: '2',
      taskStatusText: '已完成',
      score: 98,
      isPassed: true,
      submitTime: '2026-03-14 16:00'
    },
    {
      taskId: 302,
      taskName: '高级语法练习',
      taskType: '3',
      taskTypeText: '语法练习',
      questionCount: 45,
      startTime: '2026-03-16',
      endTime: '2026-03-31',
      className: 'B级-英语进阶班',
      classLevel: 'B',
      teacherName: '张老师',
      taskStatus: '2',
      taskStatusText: '已完成',
      score: 95,
      isPassed: true,
      submitTime: '2026-03-30 18:45'
    },
    {
      taskId: 303,
      taskName: '写作练习',
      taskType: '5',
      taskTypeText: '写作练习',
      questionCount: 20,
      startTime: '2026-04-01',
      endTime: '2026-04-10',
      className: 'B级-英语进阶班',
      classLevel: 'B',
      teacherName: '张老师',
      taskStatus: '2',
      taskStatusText: '已完成',
      score: 92,
      isPassed: true,
      submitTime: '2026-04-09 21:00'
    }
  ]
}

// ==================== 任务题目数据 ====================

export const mockTaskQuestions = {
  1: [
    {
      questionId: 1001,
      questionName: '单词选择题',
      questionContent: '单词 "hello" 的中文意思是？',
      questionType: '1',
      type: 'single',
      options: { 'A': '你好', 'B': '再见', 'C': '谢谢', 'D': '对不起' },
      correctAnswer: 'A',
      explanation: '"hello" 是英语中最常用的问候语，中文意思是"你好"。'
    },
    {
      questionId: 1002,
      questionName: '单词选择题',
      questionContent: '单词 "apple" 的中文意思是？',
      questionType: '1',
      type: 'single',
      options: { 'A': '香蕉', 'B': '苹果', 'C': '橙子', 'D': '葡萄' },
      correctAnswer: 'B',
      explanation: '"apple" 是一种常见的水果，中文意思是"苹果"。'
    },
    {
      questionId: 1003,
      questionName: '单词填空题',
      questionContent: '请填写单词：W___ld（世界）',
      questionType: '3',
      type: 'input',
      correctAnswer: 'World',
      explanation: 'world 表示"世界"的意思。'
    },
    {
      questionId: 1004,
      questionName: '单词选择题',
      questionContent: '单词 "study" 可以作为什么词性使用？',
      questionType: '1',
      type: 'single',
      options: { 'A': '只能做名词', 'B': '只能做动词', 'C': '名词和动词', 'D': '形容词' },
      correctAnswer: 'C',
      explanation: '"study" 既可以作名词表示"学习、研究"，也可以作动词表示"学习、研究"。'
    },
    {
      questionId: 1005,
      questionName: '单词选择题',
      questionContent: '请拼写单词：学_____（learn）',
      questionType: '2',
      type: 'input',
      correctAnswer: 'learn',
      explanation: 'learn 表示"学习"的意思。'
    }
  ],
  // 默认题目（用于其他任务）
  default: [
    {
      questionId: 2001,
      questionName: '选择题',
      questionContent: '请选择正确的答案',
      questionType: '1',
      type: 'single',
      options: { 'A': '选项A', 'B': '选项B', 'C': '选项C', 'D': '选项D' },
      correctAnswer: 'A',
      explanation: '正确答案是A。'
    },
    {
      questionId: 2002,
      questionName: '填空题',
      questionContent: '请填写正确答案',
      questionType: '2',
      type: 'input',
      correctAnswer: 'answer',
      explanation: '正确答案是answer。'
    }
  ]
}

// ==================== 任务类型映射 ====================

export const taskTypeMap = {
  '1': '单词测试',
  '2': '阅读理解',
  '3': '语法练习',
  '4': '听力练习',
  '5': '写作练习'
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
 * 模拟获取任务列表
 * @param {string} completed - 'true' 获取已完成任务，'false' 或其他获取未完成任务
 */
export async function mockGetMyTasks(completed) {
  await delay(300)
  const username = getCurrentUsername()
  
  if (completed === 'true') {
    const tasks = mockCompletedTasksData[username] || mockCompletedTasksData.student
    return {
      code: 200,
      data: tasks
    }
  } else {
    const tasks = mockPendingTasksData[username] || mockPendingTasksData.student
    return {
      code: 200,
      data: tasks
    }
  }
}

/**
 * 模拟获取任务题目
 */
export async function mockGetTaskQuestions(taskId) {
  await delay(300)
  const questions = mockTaskQuestions[taskId] || mockTaskQuestions[1]
  
  const username = getCurrentUsername()
  let pendingTasks = mockPendingTasksData[username] || mockPendingTasksData.student
  const task = pendingTasks.find(t => t.taskId === taskId)
  
  return {
    code: 200,
    data: {
      taskId,
      taskName: task?.taskName || '任务',
      taskType: task?.taskType || '1',
      taskTypeText: task?.taskTypeText || '单词测试',
      totalQuestions: questions.length,
      questions: questions
    }
  }
}

/**
 * 模拟获取任务详情
 */
export async function mockGetTaskDetail(taskId) {
  await delay(300)
  const username = getCurrentUsername()
  const completedTasks = mockCompletedTasksData[username] || mockCompletedTasksData.student
  const task = completedTasks.find(t => t.taskId === taskId)
  
  if (!task) {
    return {
      code: 404,
      msg: '任务不存在'
    }
  }
  
  const questions = mockTaskQuestions[1] || mockTaskQuestions.default
  return {
    code: 200,
    data: {
      ...task,
      questions: questions.map(q => ({
        ...q,
        userAnswer: q.correctAnswer,
        isCorrect: true
      }))
    }
  }
}

/**
 * 模拟提交任务答案
 */
export async function mockSubmitTaskAnswers(params) {
  await delay(500)
  return {
    code: 200,
    data: {
      correctCount: Math.floor(params.answers.length * 0.8),
      wrongCount: Math.floor(params.answers.length * 0.2),
      score: 85,
      success: true
    }
  }
}

/**
 * 模拟获取任务统计
 */
export async function mockGetTaskStats() {
  await delay(200)
  const username = getCurrentUsername()
  
  const pendingTasks = mockPendingTasksData[username] || mockPendingTasksData.student
  const completedTasks = mockCompletedTasksData[username] || mockCompletedTasksData.student
  
  return {
    code: 200,
    data: {
      pendingCount: pendingTasks.length,
      completedCount: completedTasks.length,
      totalScore: completedTasks.reduce((sum, t) => sum + (t.score || 0), 0),
      avgScore: completedTasks.length > 0 
        ? Math.round(completedTasks.reduce((sum, t) => sum + (t.score || 0), 0) / completedTasks.length)
        : 0
    }
  }
}
