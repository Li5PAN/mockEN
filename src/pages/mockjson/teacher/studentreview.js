/**
 * 学生申请审核相关模拟数据
 * 包含入班申请、换班申请、退班申请等功能
 */

// ==================== 入班申请数据 ====================

export const mockJoinApplicationsData = [
  {
    applicationId: 1,
    userId: 101,
    userName: '王小明',
    classId: 1,
    className: 'A级-英语精英班',
    classLevel: 'A',
    applicationTime: '2026-04-18 10:30:00',
    applicationReason: '希望提升英语水平',
    status: 0
  },
  {
    applicationId: 2,
    userId: 102,
    userName: '李小红',
    classId: 2,
    className: 'B级-英语进阶班',
    classLevel: 'B',
    applicationTime: '2026-04-19 14:20:00',
    applicationReason: '想要参加英语进阶学习',
    status: 0
  },
  {
    applicationId: 3,
    userId: 103,
    userName: '张小刚',
    classId: 1,
    className: 'A级-英语精英班',
    classLevel: 'A',
    applicationTime: '2026-04-20 09:15:00',
    applicationReason: '英语基础较好，希望挑战高级班',
    status: 0
  }
]

// ==================== 换班申请数据 ====================

export const mockTransferApplicationsData = [
  {
    applicationId: 11,
    userId: 201,
    userName: '陈小丽',
    fromClassId: 2,
    fromClassName: 'B级-英语进阶班',
    fromClassLevel: 'B',
    toClassId: 1,
    toClassName: 'A级-英语精英班',
    toClassLevel: 'A',
    applicationTime: '2026-04-17 16:45:00',
    applicationReason: '经过一段时间学习，感觉可以挑战更高难度',
    status: 0
  },
  {
    applicationId: 12,
    userId: 202,
    userName: '周小军',
    fromClassId: 3,
    fromClassName: 'C级-英语提高班',
    fromClassLevel: 'C',
    toClassId: 2,
    toClassName: 'B级-英语进阶班',
    toClassLevel: 'B',
    applicationTime: '2026-04-19 11:30:00',
    applicationReason: '希望进入更高级别的班级学习',
    status: 0
  },
  {
    applicationId: 13,
    userId: 203,
    userName: '赵小华',
    fromClassId: 4,
    fromClassName: 'D级-英语基础班',
    fromClassLevel: 'D',
    toClassId: 3,
    toClassName: 'C级-英语提高班',
    toClassLevel: 'C',
    applicationTime: '2026-04-20 15:00:00',
    applicationReason: '已完成基础学习，想要进一步提高',
    status: 0
  }
]

// ==================== 退班申请数据 ====================

export const mockQuitApplicationsData = [
  {
    applicationId: 21,
    userId: 301,
    userName: '孙小芳',
    classId: 3,
    className: 'C级-英语提高班',
    classLevel: 'C',
    applicationTime: '2026-04-18 13:20:00',
    applicationReason: '时间冲突，无法继续参加学习',
    status: 0
  },
  {
    applicationId: 22,
    userId: 302,
    userName: '吴小敏',
    classId: 4,
    className: 'D级-英语基础班',
    classLevel: 'D',
    applicationTime: '2026-04-19 17:45:00',
    applicationReason: '计划调整，暂时退出学习',
    status: 0
  }
]

// ==================== 模拟API函数 ====================

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 本地存储的申请数据（模拟数据库）
let localJoinApplications = [...mockJoinApplicationsData]
let localTransferApplications = [...mockTransferApplicationsData]
let localQuitApplications = [...mockQuitApplicationsData]

/**
 * 模拟获取申请列表
 */
export async function mockGetApplicationList(params = {}) {
  await delay(300)

  let data = []
  let rows = []

  // 根据申请类型返回不同数据
  if (params.applicationType === 1) {
    rows = localJoinApplications
  } else if (params.applicationType === 2) {
    rows = localTransferApplications
  } else if (params.applicationType === 3) {
    rows = localQuitApplications
  } else {
    // 返回所有申请
    rows = [
      ...localJoinApplications.map(a => ({ ...a, applicationType: 1 })),
      ...localTransferApplications.map(a => ({ ...a, applicationType: 2 })),
      ...localQuitApplications.map(a => ({ ...a, applicationType: 3 }))
    ]
  }

  // 分页
  const pageNum = params.pageNum || 1
  const pageSize = params.pageSize || 10
  const start = (pageNum - 1) * pageSize
  const end = start + pageSize

  return {
    code: 200,
    rows: rows.slice(start, end),
    total: rows.length,
    data: {
      rows: rows.slice(start, end),
      total: rows.length
    }
  }
}

/**
 * 模拟审核申请
 */
export async function mockAuditApplication(applicationId, auditResult) {
  await delay(300)

  // 从各个列表中移除已处理的申请
  localJoinApplications = localJoinApplications.filter(a => a.applicationId !== applicationId)
  localTransferApplications = localTransferApplications.filter(a => a.applicationId !== applicationId)
  localQuitApplications = localQuitApplications.filter(a => a.applicationId !== applicationId)

  const action = auditResult === '1' ? '通过' : '拒绝'

  return {
    code: 200,
    msg: `申请已${action}`
  }
}

/**
 * 模拟获取入班申请列表
 */
export async function mockGetJoinApplications(params = {}) {
  return mockGetApplicationList({ ...params, applicationType: 1 })
}

/**
 * 模拟获取换班申请列表
 */
export async function mockGetTransferApplications(params = {}) {
  return mockGetApplicationList({ ...params, applicationType: 2 })
}

/**
 * 模拟获取退班申请列表
 */
export async function mockGetQuitApplications(params = {}) {
  return mockGetApplicationList({ ...params, applicationType: 3 })
}
