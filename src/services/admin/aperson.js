import request from '@/utils/request'

// 获取人员列表（支持身份筛选、搜索）
export function getUserList(params) {
  return request({
    url: '/admin-home/user/list',
    method: 'get',
    params
  })
}

// 获取人员详情
export function getUserDetail(userId) {
  return request({
    url: `/admin-home/user/${userId}`,
    method: 'get'
  })
}

// 删除人员
export function deleteUser(userId) {
  return request({
    url: `/admin-home/user/${userId}`,
    method: 'delete'
  })
}
