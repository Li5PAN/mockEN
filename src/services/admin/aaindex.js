import request from '@/utils/request'

/**
 * 获取管理员首页数据概览
 * @returns {Promise} 返回包含用户总数、学生总数、教师总数、班级总数等数据
 */
export const getOverview = () => {
  return request({
    url: '/admin-home/overview',
    method: 'GET'
  })
}

/**
 * 获取各等级班级分布
 * @returns {Promise} 返回各等级(A/B/C/D)的班级数量、学生数量和占比
 */
export const getLevelDistribution = () => {
  return request({
    url: '/admin-home/level-distribution',
    method: 'GET'
  })
}

/**
 * 获取用户增长趋势
 * @returns {Promise} 返回每日新增学生数、新增教师数、新增用户总数
 */
export const getUserGrowthTrend = () => {
  return request({
    url: '/admin-home/user-growth-trend',
    method: 'GET'
  })
}

/**
 * 获取换班变化趋势
 * @returns {Promise} 返回每日转出人数和转入人数
 */
export const getClassChangeTrend = () => {
  return request({
    url: '/admin-home/class-change-trend',
    method: 'GET'
  })
}

/**
 * 获取退班变化趋势
 * @returns {Promise} 返回每日退班人数
 */
export const getDropClassTrend = () => {
  return request({
    url: '/admin-home/drop-class-trend',
    method: 'GET'
  })
}

/**
 * 获取班级创建趋势
 * @returns {Promise} 返回每日新增班级数
 */
export const getClassCreateTrend = () => {
  return request({
    url: '/admin-home/class-create-trend',
    method: 'GET'
  })
}
