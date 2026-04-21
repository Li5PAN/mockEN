/**
 * 学生错题相关模拟数据
 * 包含错题列表、错题详情等数据
 */

// ==================== 错题列表（根据用户区分）====================

export const mockErrorQuestionsData = {
  student: [
    {
      wrongId: 1,
      questionContent: '单词 "necessary" 的正确拼写是什么？',
      questionType: '2',
      questionTypeText: '单词拼写',
      taskName: '第三单元单词测试',
      wrongDate: '2026-04-18',
      wrongCount: 2,
      isMastered: '0',
      correctAnswer: 'necessary',
      userAnswer: 'neccessary',
      explanation: '"necessary" 的拼写需要特别注意，只有e和c各一个。'
    },
    {
      wrongId: 2,
      questionContent: '请选择正确的时态：He _____ (go) to school every day.',
      questionType: '1',
      questionTypeText: '语法选择',
      taskName: '第二单元语法练习',
      wrongDate: '2026-04-15',
      wrongCount: 1,
      isMastered: '0',
      correctAnswer: 'goes',
      userAnswer: 'going',
      explanation: '一般现在时，主语为第三人称单数，动词要加s。'
    },
    {
      wrongId: 3,
      questionContent: '单词 "tomato" 的复数形式是什么？',
      questionType: '2',
      questionTypeText: '词形变化',
      taskName: '第一单元单词测试',
      wrongDate: '2026-04-10',
      wrongCount: 1,
      isMastered: '1',
      correctAnswer: 'tomatoes',
      userAnswer: 'tomatos',
      explanation: '以o结尾的名词复数，一般加-es，如tomato->tomatoes。'
    },
    {
      wrongId: 4,
      questionContent: '请选择正确的介词：The cat is _____ the table.',
      questionType: '1',
      questionTypeText: '语法选择',
      taskName: '第二单元语法练习',
      wrongDate: '2026-04-08',
      wrongCount: 1,
      isMastered: '0',
      correctAnswer: 'on',
      userAnswer: 'in',
      explanation: '"on" 表示在...上面，"in" 表示在...里面。猫在桌子上，所以用on。'
    },
    {
      wrongId: 5,
      questionContent: '请拼写单词：学_____（learn）',
      questionType: '2',
      questionTypeText: '单词拼写',
      taskName: '第一单元单词测试',
      wrongDate: '2026-04-05',
      wrongCount: 1,
      isMastered: '1',
      correctAnswer: 'learn',
      userAnswer: 'lern',
      explanation: 'learn 表示"学习"的意思，拼写为l-e-a-r-n。'
    },
    {
      wrongId: 6,
      questionContent: '请选择正确的代词：This is _____ book.',
      questionType: '1',
      questionTypeText: '语法选择',
      taskName: '第二单元语法练习',
      wrongDate: '2026-04-03',
      wrongCount: 1,
      isMastered: '0',
      correctAnswer: 'my',
      userAnswer: 'I',
      explanation: '"my" 是形容词性物主代词，后面接名词；"I" 是主格，用作主语。'
    },
    {
      wrongId: 7,
      questionContent: '单词 "receive" 的正确拼写是什么？',
      questionType: '2',
      questionTypeText: '单词拼写',
      taskName: '第三单元单词测试',
      wrongDate: '2026-04-01',
      wrongCount: 2,
      isMastered: '0',
      correctAnswer: 'receive',
      userAnswer: 'recieve',
      explanation: '"receive" 的拼写规则是"i before e except after c"。'
    },
    {
      wrongId: 8,
      questionContent: '请选择正确的冠词：_____ apple a day keeps the doctor away.',
      questionType: '1',
      questionTypeText: '语法选择',
      taskName: '第一单元单词测试',
      wrongDate: '2026-03-28',
      wrongCount: 1,
      isMastered: '1',
      correctAnswer: 'An',
      userAnswer: 'A',
      explanation: '"an" 用于以元音音素开头的单词前，"apple" 发音以元音开头。'
    }
  ],
  lisi: [
    {
      wrongId: 101,
      questionContent: '请选择正确的时态：She _____ (watch) TV now.',
      questionType: '1',
      questionTypeText: '语法选择',
      taskName: '第五单元语法练习',
      wrongDate: '2026-04-18',
      wrongCount: 1,
      isMastered: '0',
      correctAnswer: 'is watching',
      userAnswer: 'watches',
      explanation: '现在进行时表示正在进行的动作，用be + doing形式。'
    },
    {
      wrongId: 102,
      questionContent: '请拼写单词：知识 _____（knowledge）',
      questionType: '2',
      questionTypeText: '单词拼写',
      taskName: '第四单元单词测试',
      wrongDate: '2026-04-15',
      wrongCount: 1,
      isMastered: '1',
      correctAnswer: 'knowledge',
      userAnswer: 'knowlage',
      explanation: '"knowledge" 拼写为k-n-o-w-l-e-d-g-e。'
    },
    {
      wrongId: 103,
      questionContent: '请选择正确的介词：She arrived _____ Beijing yesterday.',
      questionType: '1',
      questionTypeText: '语法选择',
      taskName: '第五单元语法练习',
      wrongDate: '2026-04-12',
      wrongCount: 1,
      isMastered: '0',
      correctAnswer: 'in',
      userAnswer: 'at',
      explanation: '"arrive in" 用于较大的地方如城市、国家，"arrive at" 用于较小的地点。'
    },
    {
      wrongId: 104,
      questionContent: '单词 "practice" 的美式英语拼写是什么？',
      questionType: '2',
      questionTypeText: '词形变化',
      taskName: '第四单元单词测试',
      wrongDate: '2026-04-10',
      wrongCount: 1,
      isMastered: '1',
      correctAnswer: 'practice',
      userAnswer: 'practise',
      explanation: '美式英语中"练习"作名词时拼写为practice，英式英语作动词时为practise。'
    },
    {
      wrongId: 105,
      questionContent: '请选择正确的比较级：This book is _____ than that one.',
      questionType: '1',
      questionTypeText: '语法选择',
      taskName: '第五单元语法练习',
      wrongDate: '2026-04-08',
      wrongCount: 1,
      isMastered: '0',
      correctAnswer: 'more interesting',
      userAnswer: 'interesting',
      explanation: '多音节形容词用more + 原级构成比较级。'
    }
  ],
  zhangsan: [
    {
      wrongId: 201,
      questionContent: '请选择正确的虚拟语气：If I _____ you, I would accept the offer.',
      questionType: '1',
      questionTypeText: '语法选择',
      taskName: '高级语法练习',
      wrongDate: '2026-04-18',
      wrongCount: 1,
      isMastered: '0',
      correctAnswer: 'were',
      userAnswer: 'was',
      explanation: '虚拟语气中，与现在事实相反的条件句用过去时，be动词一律用were。'
    },
    {
      wrongId: 202,
      questionContent: '请拼写单词：教育 _____（education）',
      questionType: '2',
      questionTypeText: '单词拼写',
      taskName: '高级单词测试',
      wrongDate: '2026-04-15',
      wrongCount: 1,
      isMastered: '1',
      correctAnswer: 'education',
      userAnswer: 'eduction',
      explanation: '"education" 的拼写为e-d-u-c-a-t-i-o-n。'
    },
    {
      wrongId: 203,
      questionContent: '请选择正确的定语从句：The man _____ car was stolen is my friend.',
      questionType: '1',
      questionTypeText: '语法选择',
      taskName: '高级语法练习',
      wrongDate: '2026-04-12',
      wrongCount: 1,
      isMastered: '0',
      correctAnswer: 'whose',
      userAnswer: 'who',
      explanation: '"whose" 表示所有格，用于指代先行词的所有关系。'
    }
  ]
}

// ==================== 错题统计（根据用户区分）====================

export const mockErrorStatsData = {
  student: {
    totalErrors: 8,
    masteredCount: 3,
    reviewingCount: 5,
    mostCommonType: '单词拼写',
    accuracyRate: 75
  },
  lisi: {
    totalErrors: 5,
    masteredCount: 2,
    reviewingCount: 3,
    mostCommonType: '语法选择',
    accuracyRate: 85
  },
  zhangsan: {
    totalErrors: 3,
    masteredCount: 1,
    reviewingCount: 2,
    mostCommonType: '语法选择',
    accuracyRate: 92
  }
}

// ==================== 错题类型映射 ====================

export const errorQuestionTypeMap = {
  '1': '语法选择',
  '2': '单词拼写',
  '3': '词形变化',
  '4': '阅读理解',
  '5': '完形填空'
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
 * 模拟获取错题列表
 */
export async function mockGetWrongQuestions(params = {}) {
  await delay(300)
  const username = getCurrentUsername()
  let data = [...(mockErrorQuestionsData[username] || mockErrorQuestionsData.student)]
  
  if (params.questionType) {
    data = data.filter(e => e.questionType === params.questionType)
  }
  
  if (params.isMastered !== undefined) {
    data = data.filter(e => e.isMastered === params.isMastered)
  }
  
  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟删除错题
 */
export async function mockDeleteWrongQuestions(wrongIds) {
  await delay(200)
  return {
    code: 200,
    msg: '删除成功'
  }
}

/**
 * 模拟获取错题详情
 */
export async function mockGetWrongQuestionDetail(wrongId) {
  await delay(300)
  const username = getCurrentUsername()
  const errors = mockErrorQuestionsData[username] || mockErrorQuestionsData.student
  const error = errors.find(e => e.wrongId === wrongId)
  
  if (!error) {
    return {
      code: 404,
      msg: '错题不存在'
    }
  }
  
  return {
    code: 200,
    data: error
  }
}

/**
 * 模拟标记错题已掌握
 */
export async function mockMarkErrorMastered(wrongId) {
  await delay(200)
  return {
    code: 200,
    msg: '已标记为掌握'
  }
}

/**
 * 模拟获取错题统计
 */
export async function mockGetErrorStats() {
  await delay(200)
  const username = getCurrentUsername()
  const stats = mockErrorStatsData[username] || mockErrorStatsData.student
  
  return {
    code: 200,
    data: stats
  }
}

/**
 * 模拟获取错题类型统计
 */
export async function mockGetErrorTypeStats() {
  await delay(200)
  const username = getCurrentUsername()
  const errors = mockErrorQuestionsData[username] || mockErrorQuestionsData.student
  
  const typeCount = {}
  errors.forEach(e => {
    const typeText = errorQuestionTypeMap[e.questionType] || '其他'
    typeCount[typeText] = (typeCount[typeText] || 0) + 1
  })
  
  const data = Object.entries(typeCount).map(([type, count]) => ({
    type,
    count,
    percentage: Math.round((count / errors.length) * 100)
  }))
  
  return {
    code: 200,
    data: data
  }
}
