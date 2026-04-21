/**
 * 用户认证相关模拟数据
 * 包含学生、老师、管理员三种身份的用户信息
 */

import { ref } from 'vue'

// ==================== 学生用户信息 ====================

export const mockStudentUsers = {
  student: {
    userId: 1,
    username: 'student',
    name: '张三',
    role: 'student',
    roles: [{ roleKey: 'student', roleName: '学生' }],
    className: 'D级-英语基础班',
    classLevel: 'D',
    teacherName: '李老师',
    avatar: '',
    // 统计数据
    stats: {
      totalWordsSearched: 256,
      tasksCompleted: 8,
      wrongQuestions: 15,
      masteredWords: 128,
      totalStudyMinutes: 1850,
      todayWordsLearned: 15,
      todayStudyMinutes: 45,
      todayTasksCompleted: 2
    }
  },
  lisi: {
    userId: 2,
    username: 'lisi',
    name: '李四',
    role: 'student',
    roles: [{ roleKey: 'student', roleName: '学生' }],
    className: 'C级-英语提高班',
    classLevel: 'C',
    teacherName: '王老师',
    avatar: '',
    stats: {
      totalWordsSearched: 320,
      tasksCompleted: 12,
      wrongQuestions: 8,
      masteredWords: 200,
      totalStudyMinutes: 2200,
      todayWordsLearned: 20,
      todayStudyMinutes: 60,
      todayTasksCompleted: 3
    }
  },
  zhangsan: {
    userId: 3,
    username: 'zhangsan',
    name: '赵小三',
    role: 'student',
    roles: [{ roleKey: 'student', roleName: '学生' }],
    className: 'B级-英语进阶班',
    classLevel: 'B',
    teacherName: '张老师',
    avatar: '',
    stats: {
      totalWordsSearched: 450,
      tasksCompleted: 18,
      wrongQuestions: 5,
      masteredWords: 320,
      totalStudyMinutes: 3500,
      todayWordsLearned: 25,
      todayStudyMinutes: 80,
      todayTasksCompleted: 4
    }
  }
}

// ==================== 老师用户信息 ====================

export const mockTeacherUsers = {
  teacher: {
    userId: 101,
    username: 'teacher',
    name: '李教师',
    role: 'teacher',
    roles: [{ roleKey: 'teacher', roleName: '教师' }],
    teacherId: 1,
    classCount: 3,
    studentCount: 120,
    avatar: ''
  },
  teacherLi: {
    userId: 102,
    username: 'teacherLi',
    name: '李老师',
    role: 'teacher',
    roles: [{ roleKey: 'teacher', roleName: '教师' }],
    teacherId: 2,
    classCount: 2,
    studentCount: 85,
    avatar: ''
  },
  teacherWang: {
    userId: 103,
    username: 'teacherWang',
    name: '王老师',
    role: 'teacher',
    roles: [{ roleKey: 'teacher', roleName: '教师' }],
    teacherId: 3,
    classCount: 4,
    studentCount: 160,
    avatar: ''
  }
}

// ==================== 管理员用户信息 ====================

export const mockAdminUsers = {
  admin: {
    userId: 1001,
    username: 'admin',
    name: '系统管理员',
    role: 'admin',
    roles: [{ roleKey: 'admin', roleName: '管理员' }],
    avatar: ''
  }
}

// ==================== 所有用户列表 ====================

export const mockUsers = [
  // 学生账号
  { username: 'student', password: 'student', role: 'student', name: '张三' },
  { username: 'lisi', password: 'lisi', role: 'student', name: '李四' },
  { username: 'zhangsan', password: 'zhangsan', role: 'student', name: '赵小三' },
  // 老师账号
  { username: 'teacher', password: 'teacher', role: 'teacher', name: '李教师' },
  { username: 'teacherLi', password: 'teacherLi', role: 'teacher', name: '李老师' },
  { username: 'teacherWang', password: 'teacherWang', role: 'teacher', name: '王老师' },
  // 管理员账号
  { username: 'admin', password: 'admin', role: 'admin', name: '系统管理员' }
]

// ==================== 模拟登录函数 ====================

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取用户信息（根据用户名）
 */
export const getUserInfoByUsername = (username) => {
  // 查找学生
  if (mockStudentUsers[username]) {
    return mockStudentUsers[username]
  }
  // 查找老师
  const lowerUsername = username.toLowerCase()
  if (lowerUsername === 'teacher') return mockTeacherUsers.teacher
  if (lowerUsername === 'teacherli') return mockTeacherUsers.teacherLi
  if (lowerUsername === 'teacherwang') return mockTeacherUsers.teacherWang
  // 查找管理员
  if (lowerUsername === 'admin') return mockAdminUsers.admin
  
  return null
}

/**
 * 获取用户对应的班级信息（学生）
 */
export const getStudentClassInfo = (username) => {
  const student = mockStudentUsers[username]
  if (!student) return null
  
  return {
    className: student.className,
    classLevel: student.classLevel,
    teacherName: student.teacherName
  }
}

/**
 * 模拟登录
 */
export async function mockLogin(username, password) {
  await delay(500)
  const user = mockUsers.find(u => u.username === username && u.password === password)
  
  if (user) {
    const userDetail = getUserInfoByUsername(username)
    
    return {
      code: 200,
      msg: '登录成功',
      token: 'mock_token_' + username + '_' + Date.now(),
      user: {
        ...user,
        userId: userDetail?.userId || (user.role === 'teacher' ? 101 : user.role === 'admin' ? 1001 : 1),
        roles: [{ roleKey: user.role, roleName: user.role === 'student' ? '学生' : user.role === 'teacher' ? '教师' : '管理员' }],
        ...(user.role === 'student' && userDetail ? {
          className: userDetail.className,
          classLevel: userDetail.classLevel,
          teacherName: userDetail.teacherName
        } : {}),
        ...(user.role === 'teacher' && userDetail ? {
          teacherId: userDetail.teacherId,
          classCount: userDetail.classCount,
          studentCount: userDetail.studentCount
        } : {})
      }
    }
  }
  
  return {
    code: 401,
    msg: '用户名或密码错误'
  }
}

/**
 * 模拟注册
 */
export async function mockRegister(username, password, code) {
  await delay(500)
  const exists = mockUsers.find(u => u.username === username)
  
  if (exists) {
    return {
      code: 400,
      msg: '用户名已存在'
    }
  }
  
  return {
    code: 200,
    msg: '注册成功'
  }
}

/**
 * 模拟获取用户信息（从localStorage）
 */
export async function mockGetUserInfo() {
  await delay(200)
  const userInfoStr = localStorage.getItem('userInfo')
  
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    return {
      code: 200,
      user: userInfo
    }
  }
  
  return {
    code: 401,
    msg: '未登录'
  }
}

/**
 * 模拟获取学生统计数据
 */
export async function mockGetStudentStats(username = 'student') {
  await delay(300)
  const student = mockStudentUsers[username] || mockStudentUsers.student
  
  return {
    code: 200,
    data: student.stats
  }
}
