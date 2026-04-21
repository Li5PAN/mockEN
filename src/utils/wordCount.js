/**
 * 每日单词计数工具
 * 每天半夜12点自动清零
 */

const WORD_COUNT_KEY = 'dailyWordCount'
const WORD_COUNT_DATE_KEY = 'dailyWordCountDate'

/**
 * 获取保存的日期
 */
const getSavedDate = () => {
  return localStorage.getItem(WORD_COUNT_DATE_KEY)
}

/**
 * 获取今天的日期字符串
 */
const getTodayDateStr = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

/**
 * 检查并重置计数（如果是新的一天）
 */
export const checkAndResetDailyCount = () => {
  const savedDate = getSavedDate()
  const todayStr = getTodayDateStr()
  
  if (savedDate !== todayStr) {
    // 新的一天，重置计数
    localStorage.setItem(WORD_COUNT_KEY, '0')
    localStorage.setItem(WORD_COUNT_DATE_KEY, todayStr)
    return 0
  }
  
  return getCurrentWordCount()
}

/**
 * 获取当前单词计数
 */
export const getCurrentWordCount = () => {
  const savedDate = getSavedDate()
  const todayStr = getTodayDateStr()
  
  // 如果日期不匹配，先重置
  if (savedDate !== todayStr) {
    return checkAndResetDailyCount()
  }
  
  const count = localStorage.getItem(WORD_COUNT_KEY)
  return count ? parseInt(count, 10) : 0
}

/**
 * 增加单词计数
 * @returns 增加后的新计数
 */
export const incrementWordCount = () => {
  // 先检查是否需要重置
  const savedDate = getSavedDate()
  const todayStr = getTodayDateStr()
  
  let currentCount = 0
  
  if (savedDate !== todayStr) {
    // 新的一天，重置计数
    localStorage.setItem(WORD_COUNT_KEY, '0')
    localStorage.setItem(WORD_COUNT_DATE_KEY, todayStr)
  } else {
    currentCount = parseInt(localStorage.getItem(WORD_COUNT_KEY) || '0', 10)
  }
  
  const newCount = currentCount + 1
  localStorage.setItem(WORD_COUNT_KEY, String(newCount))
  
  return newCount
}

/**
 * 重置单词计数
 */
export const resetWordCount = () => {
  const todayStr = getTodayDateStr()
  localStorage.setItem(WORD_COUNT_KEY, '0')
  localStorage.setItem(WORD_COUNT_DATE_KEY, todayStr)
}
