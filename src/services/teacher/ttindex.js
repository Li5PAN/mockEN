/**
 * 教师首页服务 - 仪表盘数据、图表数据
 */
import request from '@/utils/request'

/**
 * 获取教师仪表盘数据（顶部概览）
 * @returns {Promise<Object>} - 包含 totalStudents, totalClasses, pendingApplications, pendingTasks
 */
export async function getTeacherDashboard() {
  const res = await request({
    url: '/teacher-home/dashboard',
    method: 'get'
  })
  return res
}

/**
 * 获取班级等级分布
 * @returns {Promise<Array>} - 班级等级分布列表 [{classLevel, classCount}]
 */
export async function getLevelDistribution() {
  const res = await request({
    url: '/teacher-home/level-distribution',
    method: 'get'
  })
  return res
}

/**
 * 获取各班级任务完成率对比
 * @returns {Promise<Object>} - {classNames: [], completionRates: []}
 */
export async function getTaskCompletion() {
  const res = await request({
    url: '/teacher-home/task-completion',
    method: 'get'
  })
  return res
}

/**
 * 获取学生活跃度趋势（最近7天）
 * @returns {Promise<Object>} - {days: [], completedTasks: [], exercises: []}
 */
export async function getActivityTrend() {
  const res = await request({
    url: '/teacher-home/activity-trend',
    method: 'get'
  })
  return res
}

/**
 * 获取错题类型分布
 * @returns {Promise<Array>} - 错题类型列表 [{type, count}]
 */
export async function getErrorTypeDistribution() {
  const res = await request({
    url: '/teacher-home/error-type-distribution',
    method: 'get'
  })
  return res
}

/**
 * 获取班级创建审批通知列表（管理员对老师班级创建的审核状态）
 * @returns {Promise<Array>} - 审批通知列表 [{className, status, reason, createTime}]
 *   status: 'approved' 通过, 'rejected' 拒绝, 'pending' 待审核
 */
export async function getClassApprovalNotifications() {
  const res = await request({
    url: '/teacher-home/class-approval-notifications',
    method: 'get'
  })
  return res
}

export default {
  getTeacherDashboard,
  getLevelDistribution,
  getTaskCompletion,
  getActivityTrend,
  getErrorTypeDistribution,
  getClassApprovalNotifications
}
