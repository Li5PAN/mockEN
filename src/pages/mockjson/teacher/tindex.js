  /**
   * 教师端首页相关模拟数据
   * 包含教师仪表盘、班级等级分布、图表数据等
   */

  import { mockGetCurrentTeacherStudentCount } from '../student-enrollment.js'
  import { _localClassList } from './tmyclass.js'

  // ==================== 教师仪表盘数据 ====================

  export const mockTeacherDashboardData = {
    teacher: {
      totalStudents: 0,  // 将由动态数据填充
      totalClasses: 2,
      pendingApplications: 0,
      pendingTasks: 0
    },
    teacherLi: {
      totalStudents: 0,
      totalClasses: 1,
      pendingApplications: 0,
      pendingTasks: 0
    },
    teacherWang: {
      totalStudents: 0,
      totalClasses: 1,
      pendingApplications: 0,
      pendingTasks: 0
    }
  }

  // ==================== 班级等级分布数据 ====================

  export const mockLevelDistributionData = [
    { classLevel: 'A', classCount: 1 },
    { classLevel: 'B', classCount: 1 },
    { classLevel: 'C', classCount: 1 },
    { classLevel: 'D', classCount: 1 }
  ]

  // ==================== 各班级任务完成率数据 ====================

  export const mockTaskCompletionData = {
    classNames: ['A级-英语精英班', 'B级-英语进阶班', 'C级-英语提高班', 'D级-英语基础班'],
    completionRates: [85, 78, 92, 65]
  }

  // ==================== 学生活跃度趋势数据 ====================

  export const mockActivityTrendData = {
    days: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    completedTasks: [220, 182, 191, 234, 290, 330, 310],
    exercises: [150, 232, 201, 154, 190, 330, 410]
  }

  // ==================== 错题类型分布数据 ====================

  export const mockErrorTypeDistributionData = [
    { type: '选择题', count: 335 },
    { type: '填空题', count: 234 },
    { type: '单词拼写', count: 148 }
  ]

  // ==================== 模拟API函数 ====================

  const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

  // 获取当前用户名
  const getCurrentUsername = () => {
    const userInfoStr = localStorage.getItem('userInfo')
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr)
      return userInfo.username || 'teacher'
    }
    return 'teacher'
  }

  /**
   * 模拟获取教师仪表盘数据（动态获取学生数）
   */
  export async function mockGetTeacherDashboard() {
    await delay(300)
    const username = getCurrentUsername()
    
    // 动态获取当前老师的班级数量（基于 _localClassList 和当前用户）
    const dynamicClassCount = _localClassList.filter(c => c.teacherId === username).length
    
    // 动态获取当前老师的学生数
    const studentCountRes = await mockGetCurrentTeacherStudentCount()
    const dynamicStudentCount = studentCountRes?.data?.totalStudents || 0
    
    return {
      code: 200,
      data: {
        totalStudents: dynamicStudentCount,
        totalClasses: dynamicClassCount,
        pendingApplications: 0,
        pendingTasks: 0
      }
    }
  }

  /**
   * 模拟获取班级等级分布
   */
  export async function mockGetLevelDistribution() {
    await delay(300)

    return {
      code: 200,
      data: mockLevelDistributionData
    }
  }

  /**
   * 模拟获取班级任务完成率
   */
  export async function mockGetTaskCompletionData() {
    await delay(300)

    return {
      code: 200,
      data: mockTaskCompletionData
    }
  }

  /**
   * 模拟获取学生活跃度趋势
   */
  export async function mockGetActivityTrend() {
    await delay(300)

    return {
      code: 200,
      data: mockActivityTrendData
    }
  }

  /**
   * 模拟获取错题类型分布
   */
  export async function mockGetErrorTypeDistribution() {
    await delay(300)

    return {
      code: 200,
      data: mockErrorTypeDistributionData
    }
  }
