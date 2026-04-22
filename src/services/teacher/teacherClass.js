/**
 * 教师班级申请审核服务
 * 提供入班申请、换班申请、退班申请的获取和审核功能
 */
import request from '@/utils/request'

/**
 * 获取待审核的入班申请列表
 * GET /api/teacher-class/applications
 *
 * @param {Object} params - 查询参数
 * @param {string} params.applicationType - 申请类型：1-入班，2-换班，3-退班
 * @param {number} params.pageNum - 页码，默认1
 * @param {number} params.pageSize - 每页数量，默认10
 * @returns {Promise<Object>} - 包含 rows 和 total
 */
export const getApplications = (params = {}) => {
  return request({
    url: '/teacher-class/applications',
    method: 'GET',
    params: {
      applicationType: params.applicationType || undefined,
      pageNum: params.pageNum || 1,
      pageSize: params.pageSize || 10
    }
  })
}

/**
 * 审核通过入班申请（自动将学生加入班级）
 * POST /api/teacher-class/applications/:applicationId/approve
 *
 * @param {number} applicationId - 申请ID
 * @returns {Promise<Object>} - 审核结果
 */
export const approveApplication = (applicationId, approveReason = '') => {
  return request({
    url: `/teacher-class/applications/${applicationId}/approve`,
    method: 'POST',
    data: { reason: approveReason }
  })
}

/**
 * 拒绝入班申请
 * POST /api/teacher-class/applications/:applicationId/reject
 *
 * @param {number} applicationId - 申请ID
 * @param {string} rejectReason - 拒绝原因（可选）
 * @returns {Promise<Object>} - 审核结果
 */
export const rejectApplication = (applicationId, rejectReason = '') => {
  return request({
    url: `/teacher-class/applications/${applicationId}/reject`,
    method: 'POST',
    data: { reason: rejectReason }
  })
}

export default {
  getApplications,
  approveApplication,
  rejectApplication
}
