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



/**
 * 创建任务并批量添加题目
 * @param {Object} data - 任务和题目信息
 * @param {string} data.taskName - 任务名称
 * @param {number} data.classId - 所属班级ID
 * @param {string} data.taskType - 任务类型(1单词学习 2单词测试 3综合练习)
 * @param {string} data.startTime - 开始时间
 * @param {string} data.endTime - 截止时间
 * @param {Array} data.questions - 题目列表
 * @param {string} data.questions[].questionType - 题型(1选择题 2单词拼写 3填空题)
 * @param {string} data.questions[].questionContent - 题目内容
 * @param {string} data.questions[].options - 选项(JSON格式，选择题使用)
 * @param {string} data.questions[].correctAnswer - 正确答案
 * @returns {Promise<Object>} - 返回添加结果
 */
export async function publishTaskWithQuestions(data) {
  const res = await request({
    url: '/teacher/task/publish-with-questions',
    method: 'POST',
    data: {
      taskName: data.taskName,
      classId: data.classId,
      taskType: data.taskType,
      startTime: data.startTime,
      endTime: data.endTime,
      questions: data.questions
    }
  })

  return res
}
