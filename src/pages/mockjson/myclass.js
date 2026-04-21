/**
 * 学生班级相关模拟数据
 * 包含所有班级列表、学生当前班级、班级排行榜等数据
 */

// ==================== 本地存储的班级数据读取 ====================

const STORAGE_KEY = 'teacher_class_list'

// 从 localStorage 读取教师创建的班级数据
const getTeacherClassesFromStorage = () => {
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

// ==================== 所有班级数据 ====================

// 默认班级数据（当 localStorage 没有数据时使用）
const defaultMockAllClasses = [
  { id: 1, classId: 1, level: 'A', name: 'A级-英语精英班', teacher: '张教授', teacherName: '张教授', studentCount: 25, memberCount: 25, totalTasks: 20, taskCount: 20 },
  { id: 2, classId: 2, level: 'A', name: 'A级-英语冲刺班', teacher: '刘教授', teacherName: '刘教授', studentCount: 22, memberCount: 22, totalTasks: 18, taskCount: 18 },
  { id: 3, classId: 3, level: 'B', name: 'B级-英语进阶班', teacher: '张老师', teacherName: '张老师', studentCount: 35, memberCount: 35, totalTasks: 15, taskCount: 15 },
  { id: 4, classId: 4, level: 'B', name: 'B级-英语强化班', teacher: '陈老师', teacherName: '陈老师', studentCount: 30, memberCount: 30, totalTasks: 16, taskCount: 16 },
  { id: 5, classId: 5, level: 'C', name: 'C级-英语提高班', teacher: '王老师', teacherName: '王老师', studentCount: 40, memberCount: 40, totalTasks: 12, taskCount: 12 },
  { id: 6, classId: 6, level: 'C', name: 'C级-英语拓展班', teacher: '赵老师', teacherName: '赵老师', studentCount: 38, memberCount: 38, totalTasks: 14, taskCount: 14 },
  { id: 7, classId: 7, level: 'D', name: 'D级-英语基础班', teacher: '李老师', teacherName: '李老师', studentCount: 50, memberCount: 50, totalTasks: 10, taskCount: 10 },
  { id: 8, classId: 8, level: 'D', name: 'D级-英语入门班', teacher: '周老师', teacherName: '周老师', studentCount: 48, memberCount: 48, totalTasks: 8, taskCount: 8 }
]

// 动态获取所有班级（优先从 localStorage 读取，否则使用默认数据）
export const getAllClasses = () => {
  const storedClasses = getTeacherClassesFromStorage()
  if (storedClasses && storedClasses.length > 0) {
    // 将教师端数据转换为学生端需要的格式
    return storedClasses.map(c => ({
      id: c.classId,
      classId: c.classId,
      level: c.classLevel,
      name: c.className,
      teacher: c.teacherName || '未知教师',
      teacherName: c.teacherName || '未知教师',
      studentCount: c.currentStudents || 0,
      memberCount: c.currentStudents || 0,
      totalTasks: c.taskCount || 0,
      taskCount: c.taskCount || 0
    }))
  }
  return defaultMockAllClasses
}

// 兼容旧写法（用于初始化时）
export const mockAllClasses = getAllClasses()

// ==================== 学生当前班级信息（根据用户区分）====================

export const mockCurrentClassData = {
  student: {
    id: 7,
    classId: 7,
    level: 'D',
    name: 'D级-英语基础班',
    teacher: '李老师',
    teacherName: '李老师',
    studentCount: 50,
    memberCount: 50,
    myRank: 5,
    taskCount: 10,
    totalTasks: 10,
    avgCompletionRate: 72,
    classTaskCompletionRate: 72,
    myCompletionRate: 80,
    completedTasks: 8,
    isFirstJoin: false
  },
  lisi: {
    id: 5,
    classId: 5,
    level: 'C',
    name: 'C级-英语提高班',
    teacher: '王老师',
    teacherName: '王老师',
    studentCount: 40,
    memberCount: 40,
    myRank: 3,
    taskCount: 12,
    totalTasks: 12,
    avgCompletionRate: 78,
    classTaskCompletionRate: 78,
    myCompletionRate: 92,
    completedTasks: 11,
    isFirstJoin: false
  },
  zhangsan: {
    id: 3,
    classId: 3,
    level: 'B',
    name: 'B级-英语进阶班',
    teacher: '张老师',
    teacherName: '张老师',
    studentCount: 35,
    memberCount: 35,
    myRank: 2,
    taskCount: 15,
    totalTasks: 15,
    avgCompletionRate: 85,
    classTaskCompletionRate: 85,
    myCompletionRate: 100,
    completedTasks: 15,
    isFirstJoin: false
  }
}

// ==================== 班级排行榜（根据用户区分）====================

export const mockClassRankingData = {
  student: [
    { rank: 1, name: '王小明', userId: 101, taskCompletionRate: 100, questionCount: 520, isMe: false },
    { rank: 2, name: '李小红', userId: 102, taskCompletionRate: 98, questionCount: 490, isMe: false },
    { rank: 3, name: '张小刚', userId: 103, taskCompletionRate: 95, questionCount: 475, isMe: false },
    { rank: 4, name: '陈小丽', userId: 104, taskCompletionRate: 88, questionCount: 440, isMe: false },
    { rank: 5, name: '张三', userId: 1, taskCompletionRate: 80, questionCount: 400, isMe: true },
    { rank: 6, name: '赵小华', userId: 105, taskCompletionRate: 75, questionCount: 375, isMe: false },
    { rank: 7, name: '孙小芳', userId: 106, taskCompletionRate: 70, questionCount: 350, isMe: false },
    { rank: 8, name: '周小军', userId: 107, taskCompletionRate: 65, questionCount: 325, isMe: false },
    { rank: 9, name: '吴小敏', userId: 108, taskCompletionRate: 60, questionCount: 300, isMe: false },
    { rank: 10, name: '郑小强', userId: 109, taskCompletionRate: 55, questionCount: 275, isMe: false }
  ],
  lisi: [
    { rank: 1, name: '刘小明', userId: 201, taskCompletionRate: 100, questionCount: 620, isMe: false },
    { rank: 2, name: '赵小红', userId: 202, taskCompletionRate: 98, questionCount: 590, isMe: false },
    { rank: 3, name: '李四', userId: 2, taskCompletionRate: 92, questionCount: 520, isMe: true },
    { rank: 4, name: '周小刚', userId: 203, taskCompletionRate: 88, questionCount: 480, isMe: false },
    { rank: 5, name: '陈小丽', userId: 204, taskCompletionRate: 85, questionCount: 460, isMe: false },
    { rank: 6, name: '孙小华', userId: 205, taskCompletionRate: 80, questionCount: 420, isMe: false },
    { rank: 7, name: '吴小芳', userId: 206, taskCompletionRate: 75, questionCount: 390, isMe: false },
    { rank: 8, name: '郑小军', userId: 207, taskCompletionRate: 70, questionCount: 360, isMe: false }
  ],
  zhangsan: [
    { rank: 1, name: '赵小三', userId: 3, taskCompletionRate: 100, questionCount: 720, isMe: true },
    { rank: 2, name: '钱小强', userId: 301, taskCompletionRate: 95, questionCount: 680, isMe: false },
    { rank: 3, name: '孙小明', userId: 302, taskCompletionRate: 90, questionCount: 620, isMe: false },
    { rank: 4, name: '李小红', userId: 303, taskCompletionRate: 85, questionCount: 580, isMe: false },
    { rank: 5, name: '周小刚', userId: 304, taskCompletionRate: 80, questionCount: 540, isMe: false },
    { rank: 6, name: '吴小丽', userId: 305, taskCompletionRate: 75, questionCount: 500, isMe: false },
    { rank: 7, name: '郑小华', userId: 306, taskCompletionRate: 70, questionCount: 460, isMe: false }
  ]
}

// ==================== 班级学习趋势数据（近8周）====================

export const mockClassTrendData = {
  student: {
    weeks: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
    classAvg: [45, 52, 58, 63, 70, 75, 82, 88],
    myData: [50, 58, 65, 72, 80, 88, 95, 102],
    wrongCount: [12, 15, 18, 20, 22, 25, 28, 30]
  },
  lisi: {
    weeks: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
    classAvg: [55, 62, 68, 73, 78, 82, 88, 92],
    myData: [60, 70, 78, 85, 92, 98, 105, 112],
    wrongCount: [8, 10, 12, 14, 15, 16, 18, 20]
  },
  zhangsan: {
    weeks: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
    classAvg: [65, 72, 78, 82, 86, 90, 93, 95],
    myData: [75, 85, 92, 98, 105, 110, 115, 120],
    wrongCount: [5, 6, 7, 8, 8, 9, 10, 10]
  }
}

// ==================== 班级状态枚举 ====================

export const ClassStatus = {
  NO_CLASS: 0,
  JOINED: 1,
  APPLYING_JOIN: 2,
  APPLYING_QUIT: 3,
  APPLYING_CHANGE: 4
}

// ==================== 班级状态数据（根据用户区分）====================

export const mockClassStatusData = {
  student: {
    status: 0, // 未入班
    isFirstJoin: true,
    currentClassId: null,
    currentClassName: null,
    pendingApplication: null
  },
  lisi: {
    status: 1, // 已入班
    isFirstJoin: false,
    currentClassId: 5,
    currentClassName: 'C级-英语提高班',
    pendingApplication: null
  },
  zhangsan: {
    status: 1, // 已入班
    isFirstJoin: false,
    currentClassId: 3,
    currentClassName: 'B级-英语进阶班',
    pendingApplication: null
  },
  // 默认未入班状态（用于其他新注册用户）
  default: {
    status: 0, // 未入班
    isFirstJoin: true,
    currentClassId: null,
    currentClassName: null,
    pendingApplication: null
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

// ==================== 学生入班状态管理（localStorage） ====================

const STUDENT_CLASS_STATUS_KEY = 'student_class_status'

// 获取学生班级状态
const getStudentClassStatus = (username) => {
  try {
    const stored = localStorage.getItem(STUDENT_CLASS_STATUS_KEY)
    if (stored) {
      const allStatus = JSON.parse(stored)
      return allStatus[username] || null
    }
  } catch (e) {
    console.error('读取学生班级状态失败:', e)
  }
  return null
}

// 保存学生班级状态
const saveStudentClassStatus = (username, status) => {
  try {
    const stored = localStorage.getItem(STUDENT_CLASS_STATUS_KEY)
    const allStatus = stored ? JSON.parse(stored) : {}
    allStatus[username] = status
    localStorage.setItem(STUDENT_CLASS_STATUS_KEY, JSON.stringify(allStatus))
  } catch (e) {
    console.error('保存学生班级状态失败:', e)
  }
}

// 获取默认的班级状态
const getDefaultClassStatus = (username) => ({
  status: 0,
  isFirstJoin: true,
  currentClassId: null,
  currentClassName: null,
  pendingApplication: null
})

/**
 * 模拟获取班级状态（支持 localStorage 持久化）
 */
export async function mockGetClassStatus() {
  await delay(300)
  const username = getCurrentUsername()
  const storedStatus = getStudentClassStatus(username)

  // 如果有存储的状态，优先使用
  if (storedStatus) {
    return {
      code: 200,
      data: storedStatus
    }
  }

  // 否则使用默认状态
  const data = mockClassStatusData[username] || getDefaultClassStatus(username)
  return {
    code: 200,
    data: data
  }
}

// ==================== 默认空班级数据（用于未入班用户）====================

export const mockEmptyClassData = {
  level: '',
  name: '',
  teacher: '',
  studentCount: 0,
  myRank: 0,
  taskCount: 0,
  avgCompletionRate: 0,
  myCompletionRate: 0,
  totalTasks: 0,
  completedTasks: 0,
  isFirstJoin: true
}

/**
 * 模拟获取我的班级信息（支持 localStorage 持久化）
 */
export async function mockGetMyClassInfo() {
  await delay(300)
  const username = getCurrentUsername()
  const storedStatus = getStudentClassStatus(username)

  if (storedStatus && storedStatus.currentClassId) {
    // 从 localStorage 获取当前班级信息
    const allClasses = getAllClasses()
    const classData = allClasses.find(c => c.classId === storedStatus.currentClassId)

    if (classData) {
      // 随机生成排名和完成率（模拟数据）
      const randomRank = Math.floor(Math.random() * 30) + 1
      const randomCompletionRate = Math.floor(Math.random() * 40) + 60

      return {
        code: 200,
        data: {
          classLevel: classData.level,
          className: classData.name,
          teacherName: classData.teacher,
          memberCount: classData.studentCount,
          myRank: randomRank,
          totalTasks: classData.totalTasks,
          classTaskCompletionRate: randomCompletionRate - 10,
          myTaskCompletionRate: randomCompletionRate,
          completedTasks: Math.floor(classData.totalTasks * randomCompletionRate / 100),
          isFirstJoin: storedStatus.isFirstJoin
        }
      }
    }
  }

  // 使用默认数据
  const data = mockCurrentClassData[username] || mockEmptyClassData
  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取班级列表
 */
export async function mockGetClassList(classLevel) {
  await delay(300)
  const allClasses = getAllClasses()
  const classes = classLevel
    ? allClasses.filter(c => c.level === classLevel)
    : allClasses
  return {
    code: 200,
    rows: classes
  }
}

/**
 * 模拟获取班级排行榜
 */
export async function mockGetClassRanking() {
  await delay(300)
  const username = getCurrentUsername()
  const data = mockClassRankingData[username] || mockClassRankingData.student
  
  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟获取班级学习趋势
 */
export async function mockGetClassTrend() {
  await delay(200)
  const username = getCurrentUsername()
  const data = mockClassTrendData[username] || mockClassTrendData.student
  
  return {
    code: 200,
    data: data
  }
}

/**
 * 模拟申请入班（实际保存到 localStorage）
 */
export async function mockJoinClass(classId) {
  await delay(300)
  const username = getCurrentUsername()
  const allClasses = getAllClasses()
  const classData = allClasses.find(c => c.classId === classId || c.id === classId)

  if (!classData) {
    return {
      code: 404,
      msg: '班级不存在'
    }
  }

  // 获取当前状态
  const currentStatus = getStudentClassStatus(username) || getDefaultClassStatus(username)

  // 更新状态为已入班
  const newStatus = {
    status: 1, // 已入班
    isFirstJoin: currentStatus.isFirstJoin,
    currentClassId: classData.classId,
    currentClassName: classData.name,
    pendingApplication: null
  }

  saveStudentClassStatus(username, newStatus)

  return {
    code: 200,
    msg: '成功加入班级',
    data: {
      classId: classData.classId,
      className: classData.name
    }
  }
}

/**
 * 模拟退出班级（实际保存到 localStorage）
 */
export async function mockQuitClass() {
  await delay(300)
  const username = getCurrentUsername()
  const currentStatus = getStudentClassStatus(username)

  if (!currentStatus || !currentStatus.currentClassId) {
    return {
      code: 400,
      msg: '您当前不在任何班级中'
    }
  }

  const lastClassLevel = currentStatus.currentClassId

  // 更新状态为空
  const newStatus = {
    status: 0,
    isFirstJoin: false,
    currentClassId: null,
    currentClassName: null,
    pendingApplication: null,
    lastClassLevel: lastClassLevel // 保存上次班级等级用于限制换班
  }

  saveStudentClassStatus(username, newStatus)

  return {
    code: 200,
    msg: '已成功退出班级'
  }
}

/**
 * 模拟申请换班
 */
export async function mockApplyChangeClass(classId) {
  await delay(300)
  return {
    code: 200,
    msg: '换班申请已提交，请等待老师审核'
  }
}
