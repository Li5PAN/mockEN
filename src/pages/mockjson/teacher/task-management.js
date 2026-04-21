/**
 * 教师任务管理相关模拟数据
 * 包含任务列表、任务详情、督促完成等功能
 */

// ==================== 任务列表数据 ====================

export const mockTaskListData = [
  {
    taskId: 1,
    taskName: '第一单元单词测试',
    classId: 1,
    className: 'A级-英语精英班',
    classLevel: 'A',
    questionCount: 50,
    startTime: '2026-04-10 08:00:00',
    endTime: '2026-04-17 23:59:59',
    completedCount: 22,
    totalStudents: 25,
    taskStatus: 1,
    publishTime: '2026-04-09 16:00:00'
  },
  {
    taskId: 2,
    taskName: '第二单元单词测试',
    classId: 1,
    className: 'A级-英语精英班',
    classLevel: 'A',
    questionCount: 45,
    startTime: '2026-04-15 08:00:00',
    endTime: '2026-04-22 23:59:59',
    completedCount: 18,
    totalStudents: 25,
    taskStatus: 1,
    publishTime: '2026-04-14 16:00:00'
  },
  {
    taskId: 3,
    taskName: '第三单元综合练习',
    classId: 2,
    className: 'B级-英语进阶班',
    classLevel: 'B',
    questionCount: 60,
    startTime: '2026-04-12 08:00:00',
    endTime: '2026-04-19 23:59:59',
    completedCount: 30,
    totalStudents: 35,
    taskStatus: 1,
    publishTime: '2026-04-11 16:00:00'
  },
  {
    taskId: 4,
    taskName: '第四单元单词学习',
    classId: 2,
    className: 'B级-英语进阶班',
    classLevel: 'B',
    questionCount: 40,
    startTime: '2026-04-18 08:00:00',
    endTime: '2026-04-25 23:59:59',
    completedCount: 12,
    totalStudents: 35,
    taskStatus: 1,
    publishTime: '2026-04-17 16:00:00'
  },
  {
    taskId: 5,
    taskName: '第一单元单词听写',
    classId: 3,
    className: 'C级-英语提高班',
    classLevel: 'C',
    questionCount: 30,
    startTime: '2026-04-08 08:00:00',
    endTime: '2026-04-15 23:59:59',
    completedCount: 45,
    totalStudents: 48,
    taskStatus: 2,
    publishTime: '2026-04-07 16:00:00'
  },
  {
    taskId: 6,
    taskName: '第二单元阅读练习',
    classId: 3,
    className: 'C级-英语提高班',
    classLevel: 'C',
    questionCount: 35,
    startTime: '2026-04-16 08:00:00',
    endTime: '2026-04-23 23:59:59',
    completedCount: 38,
    totalStudents: 48,
    taskStatus: 1,
    publishTime: '2026-04-15 16:00:00'
  },
  {
    taskId: 7,
    taskName: '基础单词练习（一）',
    classId: 4,
    className: 'D级-英语基础班',
    classLevel: 'D',
    questionCount: 25,
    startTime: '2026-04-05 08:00:00',
    endTime: '2026-04-12 23:59:59',
    completedCount: 46,
    totalStudents: 48,
    taskStatus: 2,
    publishTime: '2026-04-04 16:00:00'
  },
  {
    taskId: 8,
    taskName: '基础单词练习（二）',
    classId: 4,
    className: 'D级-英语基础班',
    classLevel: 'D',
    questionCount: 28,
    startTime: '2026-04-14 08:00:00',
    endTime: '2026-04-21 23:59:59',
    completedCount: 35,
    totalStudents: 48,
    taskStatus: 1,
    publishTime: '2026-04-13 16:00:00'
  }
]

// ==================== 任务详情数据（包含题目）====================

export const mockTaskDetailData = {
  1: {
    taskId: 1,
    taskName: '第一单元单词测试',
    classId: 1,
    className: 'A级-英语精英班',
    classLevel: 'A',
    questionCount: 50,
    startTime: '2026-04-10 08:00:00',
    endTime: '2026-04-17 23:59:59',
    completedCount: 22,
    totalStudents: 25,
    taskStatus: 1,
    publishTime: '2026-04-09 16:00:00',
    questions: [
      {
        questionId: 101,
        questionType: '1',
        questionContent: 'The word "ubiquitous" means:',
        options: JSON.stringify({
          'A': 'Rare or uncommon',
          'B': 'Existing or being everywhere',
          'C': 'Very important',
          'D': 'Extremely beautiful'
        }),
        correctAnswer: 'B'
      },
      {
        questionId: 102,
        questionType: '1',
        questionContent: '"Ephemeral" is closest in meaning to:',
        options: JSON.stringify({
          'A': 'Permanent',
          'B': 'Short-lived',
          'C': 'Beautiful',
          'D': 'Complex'
        }),
        correctAnswer: 'B'
      },
      {
        questionId: 103,
        questionType: '2',
        questionContent: 'The meaning of "paradigm" in this context is ________.',
        correctAnswer: 'a model or pattern'
      },
      {
        questionId: 104,
        questionType: '3',
        questionContent: 'Please spell the word: r-e-l-u-c-t-a-n-t',
        correctAnswer: 'reluctant'
      }
    ]
  },
  3: {
    taskId: 3,
    taskName: '第三单元综合练习',
    classId: 2,
    className: 'B级-英语进阶班',
    classLevel: 'B',
    questionCount: 60,
    startTime: '2026-04-12 08:00:00',
    endTime: '2026-04-19 23:59:59',
    completedCount: 30,
    totalStudents: 35,
    taskStatus: 1,
    publishTime: '2026-04-11 16:00:00',
    questions: [
      {
        questionId: 301,
        questionType: '1',
        questionContent: 'Which word means "to make something less severe"?',
        options: JSON.stringify({
          'A': 'Aggravate',
          'B': 'Mitigate',
          'C': 'Exacerbate',
          'D': 'Escalate'
        }),
        correctAnswer: 'B'
      },
      {
        questionId: 302,
        questionType: '2',
        questionContent: 'The antonym of "transparent" is ________.',
        correctAnswer: 'opaque'
      }
    ]
  }
}

// ==================== 模拟API函数 ====================

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 本地存储的任务列表（模拟数据库）
let localTaskList = [...mockTaskListData]

/**
 * 模拟获取任务列表
 */
export async function mockGetTaskList(params = {}) {
  await delay(300)

  let filteredList = [...localTaskList]

  // 按等级筛选
  if (params.classLevel) {
    filteredList = filteredList.filter(t => t.classLevel === params.classLevel)
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
 * 模拟获取任务详情
 */
export async function mockGetTaskDetail(taskId) {
  await delay(300)

  const task = localTaskList.find(t => t.taskId === taskId)
  if (!task) {
    return {
      code: 404,
      msg: '任务不存在'
    }
  }

  // 获取详情中的题目
  const detail = mockTaskDetailData[taskId] || { ...task, questions: [] }

  return {
    code: 200,
    data: detail
  }
}

/**
 * 模拟发送督促提醒
 */
export async function mockSendTaskReminder(params) {
  await delay(300)

  const task = localTaskList.find(t => t.taskId === params.taskId)
  if (!task) {
    return {
      code: 404,
      msg: '任务不存在'
    }
  }

  const uncompletedCount = task.totalStudents - task.completedCount

  return {
    code: 200,
    msg: `已向 ${uncompletedCount} 名未完成学生发送督促提示`
  }
}

/**
 * 模拟删除任务
 */
export async function mockDeleteTask(taskId) {
  await delay(300)

  const index = localTaskList.findIndex(t => t.taskId === taskId)
  if (index > -1) {
    localTaskList.splice(index, 1)
  }

  return {
    code: 200,
    msg: '任务删除成功'
  }
}
