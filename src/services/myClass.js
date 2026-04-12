/**
 * 学生端 - 我的班级页面接口
 */

import request from '../utils/request'

/**
 * 获取学生班级状态
 * @returns {Promise<Object>} - 返回班级状态信息
 * status: 0-无班级, 1-已入班, 2-申请入班中, 3-申请退班中, 4-申请转班中
 */
export async function getClassStatus() {
  const res = await request({
    url: '/student/class/status',
    method: 'GET'
  })

  return res
}

/**
 * 获取我的班级信息
 * @returns {Promise<Object>} - 返回班级信息
 */
export async function getMyClassInfo() {
  const res = await request({
    url: '/student/class/my',
    method: 'GET'
  })

  return res
}

/**
 * 获取班级排行榜
 * @returns {Promise<Array>} - 返回排行榜数据
 */
export async function getClassRanking() {
  const res = await request({
    url: '/student/class/ranking',
    method: 'GET'
  })

  return res
}

/**
 * 退出班级
 * @returns {Promise<Object>} - 返回退出结果
 */
export async function quitClass() {
  const res = await request({
    url: '/student/class/quit',
    method: 'POST'
  })

  return res
}

/**
 * 查询可选班级列表（用于换班中心）
 * @param {string} classLevel - 班级等级（A/B/C/D），可选，不传则返回所有等级
 * @returns {Promise<Object>} - 返回可选班级列表
 */
export async function getClassList(classLevel) {
  const res = await request({
    url: '/student/class/list',
    method: 'GET',
    params: {
      classLevel: classLevel || undefined
    }
  })

  return res
}

/**
 * 申请换班
 * @param {number} classId - 目标班级ID
 * @returns {Promise<Object>} - 返回申请结果
 */
export async function applyChangeClass(classId) {
  const res = await request({
    url: '/student/class/change',
    method: 'POST',
    data: {
      classId
    }
  })

  return res
}

/**
 * 申请加入班级
 * @param {number} classId - 目标班级ID
 * @returns {Promise<Object>} - 返回申请结果
 */
export async function joinClass(classId) {
  const res = await request({
    url: '/student/class/join',
    method: 'POST',
    data: {
      classId
    }
  })

  return res
}
