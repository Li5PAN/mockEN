/**
 * 班级数据分析相关模拟数据
 * 包含班级任务完成对比、学生学习活跃度、错题类型分析等功能
 */

// ==================== 班级列表数据 ====================

export const mockClassListData = [
  { id: 1, name: 'A级-英语精英班', level: 'A' },
  { id: 2, name: 'B级-英语进阶班', level: 'B' },
  { id: 3, name: 'C级-英语提高班', level: 'C' },
  { id: 4, name: 'D级-英语基础班', level: 'D' }
]

// ==================== 班级任务完成对比数据 ====================

export const mockClassTaskCompletionData = {
  1: {
    className: 'A级-英语精英班',
    tasks: ['任务1', '任务2', '任务3', '任务4', '任务5', '任务6', '任务7', '任务8'],
    completed: [35, 38, 32, 40, 36, 39, 37, 34],
    uncompleted: [5, 2, 8, 0, 4, 1, 3, 6]
  },
  2: {
    className: 'B级-英语进阶班',
    tasks: ['任务1', '任务2', '任务3', '任务4', '任务5', '任务6', '任务7', '任务8'],
    completed: [30, 32, 28, 35, 31, 33, 29, 30],
    uncompleted: [5, 3, 7, 0, 4, 2, 6, 5]
  },
  3: {
    className: 'C级-英语提高班',
    tasks: ['任务1', '任务2', '任务3', '任务4', '任务5', '任务6', '任务7', '任务8'],
    completed: [42, 45, 40, 48, 43, 46, 41, 44],
    uncompleted: [6, 3, 8, 0, 5, 2, 7, 4]
  },
  4: {
    className: 'D级-英语基础班',
    tasks: ['任务1', '任务2', '任务3', '任务4', '任务5', '任务6', '任务7', '任务8'],
    completed: [40, 43, 38, 46, 41, 44, 39, 42],
    uncompleted: [8, 5, 10, 2, 7, 4, 9, 6]
  }
}

// ==================== 学生活跃度分析数据 ====================

export const mockStudentActivityData = {
  1: {
    className: 'A级-英语精英班',
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    completedTasks: [25, 22, 24, 28, 32, 38, 35],
    exercises: [20, 25, 22, 18, 24, 35, 42]
  },
  2: {
    className: 'B级-英语进阶班',
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    completedTasks: [30, 28, 32, 35, 38, 42, 40],
    exercises: [28, 32, 30, 25, 35, 45, 50]
  },
  3: {
    className: 'C级-英语提高班',
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    completedTasks: [40, 38, 42, 45, 48, 55, 52],
    exercises: [35, 40, 38, 32, 45, 60, 68]
  },
  4: {
    className: 'D级-英语基础班',
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    completedTasks: [38, 35, 40, 42, 45, 52, 48],
    exercises: [30, 38, 35, 28, 42, 58, 62]
  }
}

// ==================== 错题类型分析数据 ====================

export const mockErrorTypeAnalysisData = {
  1: {
    className: 'A级-英语精英班',
    errorTypes: [
      { type: '选择题', count: 85, color: '#1890ff' },
      { type: '填空题', count: 62, color: '#52c41a' },
      { type: '单词拼写', count: 38, color: '#faad14' }
    ]
  },
  2: {
    className: 'B级-英语进阶班',
    errorTypes: [
      { type: '选择题', count: 95, color: '#1890ff' },
      { type: '填空题', count: 72, color: '#52c41a' },
      { type: '单词拼写', count: 45, color: '#faad14' }
    ]
  },
  3: {
    className: 'C级-英语提高班',
    errorTypes: [
      { type: '选择题', count: 110, color: '#1890ff' },
      { type: '填空题', count: 85, color: '#52c41a' },
      { type: '单词拼写', count: 55, color: '#faad14' }
    ]
  },
  4: {
    className: 'D级-英语基础班',
    errorTypes: [
      { type: '选择题', count: 120, color: '#1890ff' },
      { type: '填空题', count: 95, color: '#52c41a' },
      { type: '单词拼写', count: 65, color: '#faad14' }
    ]
  }
}

// ==================== 模拟API函数 ====================

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 模拟获取班级列表
 */
export async function mockGetClassList() {
  await delay(300)

  return {
    code: 200,
    data: mockClassListData
  }
}

/**
 * 模拟获取班级任务完成对比数据
 */
export async function mockGetClassTaskCompletion(classId) {
  await delay(300)

  const data = mockClassTaskCompletionData[classId] || mockClassTaskCompletionData[1]

  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取学生活跃度分析数据
 */
export async function mockGetStudentActivity(classId) {
  await delay(300)

  const data = mockStudentActivityData[classId] || mockStudentActivityData[1]

  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取错题类型分析数据
 */
export async function mockGetErrorTypeAnalysis(classId) {
  await delay(300)

  const data = mockErrorTypeAnalysisData[classId] || mockErrorTypeAnalysisData[1]

  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取班级统计数据
 */
export async function mockGetClassStatistics(classId) {
  await delay(300)

  return {
    code: 200,
    data: {
      totalStudents: 50,
      activeStudents: 45,
      completionRate: 85,
      avgScore: 78,
      errorRate: 15
    }
  }
}
