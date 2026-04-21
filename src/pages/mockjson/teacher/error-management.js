/**
 * 错题管理相关模拟数据
 * 包含错题列表、错题详情、导入导出、批量删除等功能
 */

// ==================== 错题列表数据 ====================

export const mockErrorQuestionListData = [
  {
    questionId: 1,
    questionType: '1',
    questionContent: 'The word "ubiquitous" means:',
    options: JSON.stringify({
      'A': 'Rare or uncommon',
      'B': 'Existing or being everywhere',
      'C': 'Very important',
      'D': 'Extremely beautiful'
    }),
    correctAnswer: 'B',
    wrongCount: 45,
    taskName: '第一单元单词测试',
    classLevel: 'A',
    createTime: '2026-04-15 14:30:00'
  },
  {
    questionId: 2,
    questionType: '1',
    questionContent: '"Ephemeral" is closest in meaning to:',
    options: JSON.stringify({
      'A': 'Permanent',
      'B': 'Short-lived',
      'C': 'Beautiful',
      'D': 'Complex'
    }),
    correctAnswer: 'B',
    wrongCount: 38,
    taskName: '第一单元单词测试',
    classLevel: 'A',
    createTime: '2026-04-15 14:30:00'
  },
  {
    questionId: 3,
    questionType: '2',
    questionTypeName: '填空题',
    questionContent: 'The meaning of "paradigm" in this context is ________.',
    correctAnswer: 'a model or pattern',
    wrongCount: 32,
    taskName: '第二单元综合练习',
    classLevel: 'A',
    createTime: '2026-04-18 09:20:00'
  },
  {
    questionId: 4,
    questionType: '1',
    questionContent: 'Which word means "to make something less severe"?',
    options: JSON.stringify({
      'A': 'Aggravate',
      'B': 'Mitigate',
      'C': 'Exacerbate',
      'D': 'Escalate'
    }),
    correctAnswer: 'B',
    wrongCount: 35,
    taskName: '第三单元综合练习',
    classLevel: 'B',
    createTime: '2026-04-16 10:15:00'
  },
  {
    questionId: 5,
    questionType: '3',
    questionTypeName: '单词拼写',
    questionContent: 'Please spell the word: r-e-l-u-c-t-a-n-t',
    correctAnswer: 'reluctant',
    wrongCount: 28,
    taskName: '第二单元单词听写',
    classLevel: 'B',
    createTime: '2026-04-14 16:45:00'
  },
  {
    questionId: 6,
    questionType: '1',
    questionContent: '"Pragmatic" can best be described as:',
    options: JSON.stringify({
      'A': 'Idealistic and visionary',
      'B': 'Practical and realistic',
      'C': 'Theoretical and abstract',
      'D': 'Emotional and irrational'
    }),
    correctAnswer: 'B',
    wrongCount: 25,
    taskName: '第三单元综合练习',
    classLevel: 'B',
    createTime: '2026-04-16 10:15:00'
  },
  {
    questionId: 7,
    questionType: '2',
    questionTypeName: '填空题',
    questionContent: 'The antonym of "transparent" is ________.',
    correctAnswer: 'opaque',
    wrongCount: 22,
    taskName: '第四单元基础练习',
    classLevel: 'C',
    createTime: '2026-04-17 11:30:00'
  },
  {
    questionId: 8,
    questionType: '3',
    questionTypeName: '单词拼写',
    questionContent: 'Please spell the word: a-c-q-u-i-e-s-c-e',
    correctAnswer: 'acquiesce',
    wrongCount: 20,
    taskName: '第三单元单词拼写',
    classLevel: 'C',
    createTime: '2026-04-19 14:00:00'
  },
  {
    questionId: 9,
    questionType: '1',
    questionContent: 'What does "ambiguous" mean?',
    options: JSON.stringify({
      'A': 'Clear and definite',
      'B': 'Open to multiple interpretations',
      'C': 'Extremely important',
      'D': 'Very small'
    }),
    correctAnswer: 'B',
    wrongCount: 30,
    taskName: '基础单词练习',
    classLevel: 'D',
    createTime: '2026-04-12 08:45:00'
  },
  {
    questionId: 10,
    questionType: '2',
    questionTypeName: '填空题',
    questionContent: '"Benevolent" means kind and ________.',
    correctAnswer: 'well-meaning',
    wrongCount: 18,
    taskName: '基础词汇练习',
    classLevel: 'D',
    createTime: '2026-04-13 15:20:00'
  }
]

// ==================== 错题详情数据 ====================

export const mockErrorQuestionDetailData = {
  1: {
    questionId: 1,
    questionType: '1',
    questionContent: 'The word "ubiquitous" means:',
    options: JSON.stringify({
      'A': 'Rare or uncommon',
      'B': 'Existing or being everywhere',
      'C': 'Very important',
      'D': 'Extremely beautiful'
    }),
    correctAnswer: 'B',
    wrongCount: 45,
    taskName: '第一单元单词测试',
    classLevel: 'A',
    createTime: '2026-04-15 14:30:00'
  }
}

// ==================== 模拟API函数 ====================

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 本地存储的错题列表（模拟数据库）
let localErrorList = [...mockErrorQuestionListData]

/**
 * 模拟获取错题列表
 */
export async function mockGetQuestionList(params = {}) {
  await delay(300)

  let filteredList = [...localErrorList]

  // 按题目类型筛选
  if (params.questionType) {
    filteredList = filteredList.filter(q => q.questionType === params.questionType)
  }

  // 按班级等级筛选
  if (params.classLevel) {
    filteredList = filteredList.filter(q => q.classLevel === params.classLevel)
  }

  // 按时间范围筛选
  if (params.beginDate) {
    filteredList = filteredList.filter(q => {
      const createDate = q.createTime.split(' ')[0]
      return createDate >= params.beginDate
    })
  }
  if (params.endDate) {
    filteredList = filteredList.filter(q => {
      const createDate = q.createTime.split(' ')[0]
      return createDate <= params.endDate
    })
  }

  return {
    code: 200,
    rows: filteredList,
    total: filteredList.length
  }
}

/**
 * 模拟获取错题详情
 */
export async function mockGetQuestionDetail(questionId) {
  await delay(300)

  const question = localErrorList.find(q => q.questionId === questionId)
  if (!question) {
    return {
      code: 404,
      msg: '题目不存在'
    }
  }

  return {
    code: 200,
    data: question
  }
}

/**
 * 模拟获取错题模板下载地址
 */
export function mockGetQuestionTemplateUrl() {
  return '/templates/error-question-template.xlsx'
}

/**
 * 模拟导入错题
 */
export async function mockImportQuestion(formData) {
  await delay(500)

  return {
    code: 200,
    msg: '错题导入成功'
  }
}

/**
 * 模拟导出错题
 */
export async function mockExportQuestion(taskId) {
  await delay(500)

  // 创建一个简单的 Excel Blob（实际项目中应该由后端生成）
  const blob = new Blob(['模拟错题导出数据'], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  return blob
}

/**
 * 模拟批量删除错题
 */
export async function mockBatchDeleteQuestions(questionIds) {
  await delay(300)

  // 从本地列表中移除
  localErrorList = localErrorList.filter(q => !questionIds.includes(q.questionId))

  return {
    code: 200,
    msg: `成功删除 ${questionIds.length} 道题目`
  }
}

/**
 * 模拟标记错题已掌握
 */
export async function mockMarkErrorMastered(questionId) {
  await delay(300)

  return {
    code: 200,
    msg: '已标记为已掌握'
  }
}

/**
 * 模拟获取错题统计
 */
export async function mockGetErrorStats() {
  await delay(300)

  return {
    code: 200,
    data: {
      totalQuestions: localErrorList.length,
      choiceQuestions: localErrorList.filter(q => q.questionType === '1').length,
      fillBlankQuestions: localErrorList.filter(q => q.questionType === '2').length,
      spellingQuestions: localErrorList.filter(q => q.questionType === '3').length,
      totalWrongCount: localErrorList.reduce((sum, q) => sum + q.wrongCount, 0)
    }
  }
}

/**
 * 模拟获取错题类型统计
 */
export async function mockGetErrorTypeStats() {
  await delay(300)

  return {
    code: 200,
    data: [
      { type: '选择题', count: 45, percentage: 45 },
      { type: '填空题', count: 35, percentage: 35 },
      { type: '单词拼写', count: 20, percentage: 20 }
    ]
  }
}
