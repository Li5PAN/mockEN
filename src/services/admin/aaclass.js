import request from '@/utils/request'

// 获取待审核班级列表
export const getAuditList = (params) => {
  return request({
    url: '/admin-home/class-review/list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100,
      ...params
    }
  })
}

// 获取已通过班级列表
export const getManageList = (params) => {
  return request({
    url: '/admin-home/class-review/management-list',
    method: 'get',
    params: {
      pageNum: 1,
      pageSize: 100,
      ...params
    }
  })
}

// 审核通过班级
export const approveClass = (classId, reason) => {
  return request({
    url: `/admin-home/class-review/approve/${classId}`,
    method: 'post',
    data: reason ? { reason } : {}
  })
}

// 拒绝班级
export const rejectClass = (classId, reason) => {
  return request({
    url: `/admin-home/class-review/reject/${classId}`,
    method: 'post',
    data: { reason }
  })
}

// 删除班级
export const deleteClass = (classId) => {
  return request({
    url: `/admin-home/class-review/delete/${classId}`,
    method: 'delete'
  })
}
