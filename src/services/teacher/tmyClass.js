/**
 * 教师端 - 班级管理接口
 */
import request from '@/utils/request'

/**
 * 获取班级概览数据
 * @returns {Promise<Object>} - 返回班级统计数据
 * @property {number} data.totalStudents - 学生总人数
 * @property {number} data.totalClasses - 班级总数
 * @property {number} data.avgCompletionRate - 班级平均完成率
 * @property {number} data.pendingApplications - 待审核申请数
 */
export async function getClassOverview() {
  const res = await request({
    url: '/teacher/class/overview',
    method: 'GET'
  })

  return res
}

/**
 * 获取班级列表
 * @param {Object} params - 查询参数
 * @param {string} params.classLevel - 班级等级(A/B/C/D)
 * @param {number} params.pageNum - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise<Object>} - 返回班级列表分页数据
 * @property {number} data.total - 总记录数
 * @property {Array} data.rows - 班级列表
 */
export async function getClassList(params = {}) {
  const res = await request({
    url: '/teacher/class/list',
    method: 'GET',
    params: {
      classLevel: params.classLevel || undefined,
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10,
      ...params
    }
  })

  return res
}

/**
 * 创建班级
 * @param {Object} data - 班级信息
 * @param {string} data.classLevel - 班级等级(A/B/C/D)
 * @param {string} data.className - 班级名称
 * @param {number} data.taskRequirement - 任务完成要求数量
 * @param {number} data.maxStudents - 最大学生数
 * @returns {Promise<Object>} - 返回创建结果
 */
export async function createClass(data) {
  const res = await request({
    url: '/teacher/class/create',
    method: 'POST',
    data: {
      classLevel: data.classLevel,
      className: data.className,
      taskRequirement: data.taskRequirement,
      maxStudents: data.maxStudents
    }
  })

  return res
}

/**
 * 审核申请（通过/拒绝）
 * @param {number} applicationId - 申请ID
 * @param {string} applicationStatus - 审核状态：1-通过，2-拒绝
 * @returns {Promise<Object>} - 返回审核结果
 */
export async function auditApplication(applicationId, applicationStatus) {
  const res = await request({
    url: '/teacher/application/audit',
    method: 'POST',
    params: {
      applicationId,
      applicationStatus
    }
  })

  return res
}
