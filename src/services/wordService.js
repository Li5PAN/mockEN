/**
 * 单词学习页面接口
 */

import request from '../utils/request'

// 模拟单词数据库
const MOCK_WORDS_DATA = {
  hello: {
    word: 'hello',
    ukPhonetic: 'həˈləʊ',
    usPhonetic: 'həˈloʊ',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=hello&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=hello&type=2',
    meanings: ['int. 喂；你好', 'n. 表示问候'],
    webMeanings: [],
    examples: [
      {
        sentence: 'Hello, how are you?',
        translation: '你好，你好吗？',
        sentenceSpeech: ''
      },
      {
        sentence: 'Say hello to your family for me.',
        translation: '代我向你的家人问好。',
        sentenceSpeech: ''
      }
    ],
    wordForms: []
  },
  apple: {
    word: 'apple',
    ukPhonetic: 'ˈæpl',
    usPhonetic: 'ˈæpl',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=apple&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=apple&type=2',
    meanings: ['n. 苹果；苹果树；苹果公司'],
    webMeanings: [
      { phrase: 'Apple Inc.', meaning: '苹果公司' },
      { phrase: 'apple pie', meaning: '苹果派' }
    ],
    examples: [
      {
        sentence: 'An apple a day keeps the doctor away.',
        translation: '一天一苹果，医生远离我。',
        sentenceSpeech: ''
      },
      {
        sentence: 'I like eating apples.',
        translation: '我喜欢吃苹果。',
        sentenceSpeech: ''
      }
    ],
    wordForms: ['apples']
  },
  world: {
    word: 'world',
    ukPhonetic: 'wɜːld',
    usPhonetic: 'wɜːrld',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=world&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=world&type=2',
    meanings: ['n. 世界；领域；世俗'],
    webMeanings: [],
    examples: [
      {
        sentence: 'The world is beautiful.',
        translation: '世界是美丽的。',
        sentenceSpeech: ''
      }
    ],
    wordForms: []
  },
  study: {
    word: 'study',
    ukPhonetic: 'ˈstʌdi',
    usPhonetic: 'ˈstʌdi',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=study&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=study&type=2',
    meanings: ['n. 学习，研究', 'vt. 学习；考虑'],
    webMeanings: [],
    examples: [
      {
        sentence: 'I study English every day.',
        translation: '我每天学习英语。',
        sentenceSpeech: ''
      }
    ],
    wordForms: ['studies', 'studied', 'studying']
  },
  learn: {
    word: 'learn',
    ukPhonetic: 'lɜːn',
    usPhonetic: 'lɜːrn',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=learn&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=learn&type=2',
    meanings: ['vt. 学习；得知', 'vi. 学习；获悉'],
    webMeanings: [],
    examples: [
      {
        sentence: 'We learn something new every day.',
        translation: '我们每天都学到新东西。',
        sentenceSpeech: ''
      }
    ],
    wordForms: ['learns', 'learned', 'learning']
  },
  practice: {
    word: 'practice',
    ukPhonetic: 'ˈpræktɪs',
    usPhonetic: 'ˈpræktɪs',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=practice&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=practice&type=2',
    meanings: ['n. 实践；练习', 'vt. 练习；实习'],
    webMeanings: [],
    examples: [
      {
        sentence: 'Practice makes perfect.',
        translation: '熟能生巧。',
        sentenceSpeech: ''
      }
    ],
    wordForms: ['practices', 'practiced', 'practicing']
  },
  improve: {
    word: 'improve',
    ukPhonetic: 'ɪmˈpruːv',
    usPhonetic: 'ɪmˈpruːv',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=improve&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=improve&type=2',
    meanings: ['vt. 改善，增进', 'vi. 改善，变得更好'],
    webMeanings: [],
    examples: [
      {
        sentence: 'I want to improve my English.',
        translation: '我想提高我的英语水平。',
        sentenceSpeech: ''
      }
    ],
    wordForms: ['improves', 'improved', 'improving']
  },
  knowledge: {
    word: 'knowledge',
    ukPhonetic: 'ˈnɒlɪdʒ',
    usPhonetic: 'ˈnɑːlɪdʒ',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=knowledge&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=knowledge&type=2',
    meanings: ['n. 知识，学问；知道'],
    webMeanings: [],
    examples: [
      {
        sentence: 'Knowledge is power.',
        translation: '知识就是力量。',
        sentenceSpeech: ''
      }
    ],
    wordForms: []
  },
  education: {
    word: 'education',
    ukPhonetic: 'ˌedʒuˈkeɪʃn',
    usPhonetic: 'ˌedʒuˈkeɪʃn',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=education&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=education&type=2',
    meanings: ['n. 教育；培养'],
    webMeanings: [],
    examples: [
      {
        sentence: 'Education is very important.',
        translation: '教育非常重要。',
        sentenceSpeech: ''
      }
    ],
    wordForms: []
  },
  teacher: {
    word: 'teacher',
    ukPhonetic: 'ˈtiːtʃə(r)',
    usPhonetic: 'ˈtiːtʃər',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=teacher&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=teacher&type=2',
    meanings: ['n. 教师；导师'],
    webMeanings: [],
    examples: [
      {
        sentence: 'My teacher is very kind.',
        translation: '我的老师很和蔼。',
        sentenceSpeech: ''
      }
    ],
    wordForms: ['teachers']
  },
  student: {
    word: 'student',
    ukPhonetic: 'ˈstjuːdnt',
    usPhonetic: 'ˈstuːdnt',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=student&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=student&type=2',
    meanings: ['n. 学生；学者'],
    webMeanings: [],
    examples: [
      {
        sentence: 'I am a student.',
        translation: '我是一名学生。',
        sentenceSpeech: ''
      }
    ],
    wordForms: ['students']
  }
}

/**
 * 获取单词详细信息
 * @param {string} word - 单词
 * @returns {Object} - 单词详细信息
 */
function getWordData(word) {
  const wordLower = word.toLowerCase()
  
  if (MOCK_WORDS_DATA[wordLower]) {
    return MOCK_WORDS_DATA[wordLower]
  }
  
  // 如果没有找到，返回基本数据
  return {
    word: word,
    ukPhonetic: '',
    usPhonetic: '',
    ukSpeech: `https://dict.youdao.com/dictvoice?audio=${word}&type=1`,
    usSpeech: `https://dict.youdao.com/dictvoice?audio=${word}&type=2`,
    meanings: ['暂无释义'],
    webMeanings: [],
    examples: [
      {
        sentence: `Example sentence for ${word}.`,
        translation: `${word} 的示例句子。`,
        sentenceSpeech: ''
      }
    ],
    wordForms: []
  }
}

/**
 * 中文到英文的映射（用于汉译英查询）
 */
const CHINESE_TO_ENGLISH = {
  '苹果': 'apple',
  '你好': 'hello',
  '世界': 'world',
  '学习': 'study',
  '学会': 'learn',
  '练习': 'practice',
  '提高': 'improve',
  '知识': 'knowledge',
  '教育': 'education',
  '老师': 'teacher',
  '学生': 'student'
}

/**
 * 检测是否为中文
 * @param {string} text - 文本
 * @returns {boolean} - 是否包含中文
 */
function isChinese(text) {
  return /[\u4e00-\u9fa5]/.test(text)
}

/**
 * 获取学生的学习单词列表
 * @param {Object} options - 查询选项
 * @returns {Promise<Array>} - 返回单词数据数组
 */
export async function getStudentWords(options = {}) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  const wordKeys = Object.keys(MOCK_WORDS_DATA)
  const limit = options.limit || wordKeys.length
  
  return wordKeys.slice(0, limit).map(key => MOCK_WORDS_DATA[key])
}

/**
 * 获取学生单词列表（调用后端API）
 * @param {Object} params - 查询参数
 * @param {string} params.englishWord - 英文单词(模糊搜索)
 * @param {string} params.chineseMeaning - 中文释义(模糊搜索)
 * @param {number} params.pageNum - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认10
 * @returns {Promise<Object>} - 返回分页数据 { total: number, records: Array }
 */
export async function fetchStudentWords(params = {}) {
  const { englishWord, chineseMeaning, pageNum = 1, pageSize = 10 } = params
  
  const queryParams = {}
  if (englishWord) queryParams.englishWord = englishWord
  if (chineseMeaning) queryParams.chineseMeaning = chineseMeaning
  queryParams.pageNum = pageNum
  queryParams.pageSize = pageSize
  
  console.log('请求参数:', queryParams)
  
  // request 响应拦截器已经返回 response.data，所以这里 response 就是后端返回的数据
  const res = await request({
    url: '/student/words',
    method: 'GET',
    params: queryParams
  })
  
  console.log('后端返回数据:', res)
  
  // 如果返回数据为空，抛出错误
  if (!res) {
    throw new Error('服务器返回数据为空')
  }
  
  // 转换后端数据格式为前端所需格式
  // 后端返回: { total: 10, rows: [...], code: 200, msg: '...' }
  // 需要转换为: { total: 10, records: [...] }
  return {
    total: res.total || 0,
    records: (res.rows || []).map(item => ({
      word: item.englishWord,
      wordId: item.wordId,
      ukPhonetic: item.phoneticUk || '',
      usPhonetic: item.phoneticUs || '',
      ukSpeech: item.phoneticUk ? `https://dict.youdao.com/dictvoice?audio=${item.englishWord}&type=1` : '',
      usSpeech: item.phoneticUs ? `https://dict.youdao.com/dictvoice?audio=${item.englishWord}&type=2` : '',
      meanings: item.chineseMeaning ? [item.chineseMeaning] : [],
      // 注意：wordType 已包含在 meanings 中，为避免重复显示，不在此处设置
      wordForms: [],
      examples: item.exampleSentence ? [{
        sentence: item.exampleSentence,
        translation: item.exampleTranslation || '',
        sentenceSpeech: ''
      }] : [],
      webMeanings: [],
      isCollected: item.isCollected || false,
      // 保留原始数据
      _rawData: item
    }))
  }
}

/**
 * 获取任务的单词列表
 * @param {string} taskId - 任务ID
 * @returns {Promise<Array>} - 返回单词数据数组
 */
export async function getTaskWords(taskId) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  console.log('获取任务单词:', taskId)
  
  // 返回部分单词作为任务单词
  return [
    MOCK_WORDS_DATA.hello,
    MOCK_WORDS_DATA.study,
    MOCK_WORDS_DATA.learn
  ]
}

/**
 * 获取学生的学习单词（带详细信息）
 * @param {Object} options - 查询选项
 * @param {Function} onProgress - 进度回调
 * @returns {Promise<Array>} - 返回包含详细信息的单词数组
 */
export async function getStudentWordsWithDetails(options = {}, onProgress = null) {
  const words = await getStudentWords(options)
  
  // 模拟加载进度
  if (onProgress) {
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50))
      onProgress(i + 1, words.length)
    }
  }
  
  return words
}

/**
 * 获取任务单词（带详细信息）
 * @param {string} taskId - 任务ID
 * @param {Function} onProgress - 进度回调
 * @returns {Promise<Array>} - 返回包含详细信息的单词数组
 */
export async function getTaskWordsWithDetails(taskId, onProgress = null) {
  const words = await getTaskWords(taskId)
  
  // 模拟加载进度
  if (onProgress) {
    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50))
      onProgress(i + 1, words.length)
    }
  }
  
  return words
}

/**
 * 搜索单词
 * @param {string} keyword - 搜索关键词
 * @returns {Promise<Object>} - 返回单词详细信息
 */
export async function searchWord(keyword) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  
  let searchKey = keyword
  
  // 如果是中文，尝试转换为英文
  if (isChinese(keyword)) {
    const englishWord = CHINESE_TO_ENGLISH[keyword]
    if (englishWord) {
      searchKey = englishWord
    } else {
      return {
        success: false,
        message: `未找到"${keyword}"对应的英文单词`
      }
    }
  }
  
  const wordData = getWordData(searchKey)
  
  return {
    success: true,
    data: wordData
  }
}

/**
 * 获取收藏的单词列表
 * @param {Object} params - 查询参数
 * @param {string} params.englishWord - 英文单词(模糊搜索，可选)
 * @param {number} params.pageNum - 页码，默认1
 * @param {number} params.pageSize - 每页条数，默认100
 * @returns {Promise<Array>} - 返回收藏的单词列表
 */
export async function getFavoriteWords(params = {}) {
  const { englishWord, pageNum = 1, pageSize = 100 } = params
  
  console.log('获取收藏单词列表，参数:', { englishWord, pageNum, pageSize })
  
  const queryParams = {
    pageNum,
    pageSize
  }
  if (englishWord) {
    queryParams.englishWord = englishWord
  }
  
  const res = await request({
    url: '/student/words/collections',
    method: 'GET',
    params: queryParams
  })
  
  console.log('收藏单词列表返回:', res)
  
  // 转换后端数据格式为前端所需格式
  const records = res.rows || res.records || []
  return records.map(item => ({
    word: item.englishWord,
    wordId: item.wordId,
    ukPhonetic: item.phoneticUk || '',
    usPhonetic: item.phoneticUs || '',
    ukSpeech: item.phoneticUk ? `https://dict.youdao.com/dictvoice?audio=${item.englishWord}&type=1` : '',
    usSpeech: item.phoneticUs ? `https://dict.youdao.com/dictvoice?audio=${item.englishWord}&type=2` : '',
    meanings: item.chineseMeaning ? [item.chineseMeaning] : [],
    wordForms: [],
    examples: item.exampleSentence ? [{
      sentence: item.exampleSentence,
      translation: item.exampleTranslation || '',
      sentenceSpeech: ''
    }] : [],
    webMeanings: [],
    isCollected: true
  }))
}

/**
 * 收藏/取消收藏单词
 * @param {number} wordId - 单词ID
 * @param {boolean} collect - true-收藏，false-取消收藏
 * @returns {Promise<Object>} - 返回操作结果
 */
export async function toggleWordCollect(wordId, collect) {
  console.log(`${collect ? '收藏' : '取消收藏'}单词:`, wordId)
  
  const res = await request({
    url: '/student/words/collect',
    method: 'POST',
    params: {
      wordId,
      collect
    }
  })
  
  console.log('收藏操作结果:', res)
  return res
}

/**
 * 单词答案匹配验证
 * @param {Object} params - 验证参数
 * @param {number} params.wordId - 单词ID
 * @param {string} params.userAnswer - 用户答案
 * @param {number} params.matchType - 匹配类型: 1=单词默写 2=单词拼写 3=英译中 4=中译英 5=填空题
 * @returns {Promise<Object>} - 返回匹配结果 { correct: boolean, correctAnswer?: string }
 */
export async function matchWordAnswer(params) {
  const { wordId, userAnswer, matchType } = params
  
  console.log('单词匹配验证:', { wordId, userAnswer, matchType })
  
  const res = await request({
    url: '/business/words/match',
    method: 'POST',
    data: {
      wordId,
      userAnswer,
      matchType
    }
  })
  
  console.log('匹配结果:', res)
  return res
}

/**
 * 记录学习进度
 * @param {Object} progress - 学习进度数据
 * @param {string} progress.word - 单词
 * @param {string} progress.mode - 学习模式
 * @param {boolean} progress.correct - 是否正确
 * @returns {Promise<Object>} - 返回操作结果
 */
export async function recordProgress(progress) {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100))
  
  console.log('记录学习进度:', progress)
  return {
    success: true,
    message: '进度已记录'
  }
}
