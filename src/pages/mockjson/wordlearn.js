/**
 * 学生单词学习相关模拟数据
 * 包含单词数据库、收藏列表、单词API函数等
 */

import { ref } from 'vue'

// ==================== 单词数据库 ====================

export const mockWordsData = {
  hello: {
    word: 'hello',
    wordId: 1,
    ukPhonetic: 'həˈləʊ',
    usPhonetic: 'həˈloʊ',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=hello&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=hello&type=2',
    meanings: ['int. 喂；你好', 'n. 表示问候'],
    webMeanings: [],
    examples: [
      { sentence: 'Hello, how are you?', translation: '你好，你好吗？', sentenceSpeech: '' },
      { sentence: 'Say hello to your family for me.', translation: '代我向你的家人问好。', sentenceSpeech: '' }
    ],
    wordForms: []
  },
  apple: {
    word: 'apple',
    wordId: 2,
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
      { sentence: 'An apple a day keeps the doctor away.', translation: '一天一苹果，医生远离我。', sentenceSpeech: '' },
      { sentence: 'I like eating apples.', translation: '我喜欢吃苹果。', sentenceSpeech: '' }
    ],
    wordForms: ['apples']
  },
  world: {
    word: 'world',
    wordId: 3,
    ukPhonetic: 'wɜːld',
    usPhonetic: 'wɜːrld',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=world&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=world&type=2',
    meanings: ['n. 世界；领域；世俗'],
    webMeanings: [],
    examples: [
      { sentence: 'The world is beautiful.', translation: '世界是美丽的。', sentenceSpeech: '' }
    ],
    wordForms: []
  },
  study: {
    word: 'study',
    wordId: 4,
    ukPhonetic: 'ˈstʌdi',
    usPhonetic: 'ˈstʌdi',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=study&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=study&type=2',
    meanings: ['n. 学习，研究', 'vt. 学习；考虑'],
    webMeanings: [],
    examples: [
      { sentence: 'I study English every day.', translation: '我每天学习英语。', sentenceSpeech: '' }
    ],
    wordForms: ['studies', 'studied', 'studying']
  },
  learn: {
    word: 'learn',
    wordId: 5,
    ukPhonetic: 'lɜːn',
    usPhonetic: 'lɜːrn',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=learn&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=learn&type=2',
    meanings: ['vt. 学习；得知', 'vi. 学习；获悉'],
    webMeanings: [],
    examples: [
      { sentence: 'We learn something new every day.', translation: '我们每天都学到新东西。', sentenceSpeech: '' }
    ],
    wordForms: ['learns', 'learned', 'learning']
  },
  practice: {
    word: 'practice',
    wordId: 6,
    ukPhonetic: 'ˈpræktɪs',
    usPhonetic: 'ˈpræktɪs',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=practice&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=practice&type=2',
    meanings: ['n. 实践；练习', 'vt. 练习；实习'],
    webMeanings: [],
    examples: [
      { sentence: 'Practice makes perfect.', translation: '熟能生巧。', sentenceSpeech: '' }
    ],
    wordForms: ['practices', 'practiced', 'practicing']
  },
  improve: {
    word: 'improve',
    wordId: 7,
    ukPhonetic: 'ɪmˈpruːv',
    usPhonetic: 'ɪmˈpruːv',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=improve&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=improve&type=2',
    meanings: ['vt. 改善，增进', 'vi. 改善，变得更好'],
    webMeanings: [],
    examples: [
      { sentence: 'I want to improve my English.', translation: '我想提高我的英语水平。', sentenceSpeech: '' }
    ],
    wordForms: ['improves', 'improved', 'improving']
  },
  knowledge: {
    word: 'knowledge',
    wordId: 8,
    ukPhonetic: 'ˈnɒlɪdʒ',
    usPhonetic: 'ˈnɑːlɪdʒ',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=knowledge&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=knowledge&type=2',
    meanings: ['n. 知识，学问；知道'],
    webMeanings: [],
    examples: [
      { sentence: 'Knowledge is power.', translation: '知识就是力量。', sentenceSpeech: '' }
    ],
    wordForms: []
  },
  education: {
    word: 'education',
    wordId: 9,
    ukPhonetic: 'ˌedʒuˈkeɪʃn',
    usPhonetic: 'ˌedʒuˈkeɪʃn',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=education&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=education&type=2',
    meanings: ['n. 教育；培养'],
    webMeanings: [],
    examples: [
      { sentence: 'Education is very important.', translation: '教育非常重要。', sentenceSpeech: '' }
    ],
    wordForms: []
  },
  teacher: {
    word: 'teacher',
    wordId: 10,
    ukPhonetic: 'ˈtiːtʃə(r)',
    usPhonetic: 'ˈtiːtʃər',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=teacher&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=teacher&type=2',
    meanings: ['n. 教师；导师'],
    webMeanings: [],
    examples: [
      { sentence: 'My teacher is very kind.', translation: '我的老师很和蔼。', sentenceSpeech: '' }
    ],
    wordForms: ['teachers']
  },
  student: {
    word: 'student',
    wordId: 11,
    ukPhonetic: 'ˈstjuːdnt',
    usPhonetic: 'ˈstuːdnt',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=student&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=student&type=2',
    meanings: ['n. 学生；学者'],
    webMeanings: [],
    examples: [
      { sentence: 'I am a student.', translation: '我是一名学生。', sentenceSpeech: '' }
    ],
    wordForms: ['students']
  },
  book: {
    word: 'book',
    wordId: 12,
    ukPhonetic: 'bʊk',
    usPhonetic: 'bʊk',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=book&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=book&type=2',
    meanings: ['n. 书籍；卷；账簿', 'vt. 预订；登记'],
    webMeanings: [],
    examples: [
      { sentence: 'I love reading books.', translation: '我喜欢读书。', sentenceSpeech: '' }
    ],
    wordForms: ['books', 'booked', 'booking']
  },
  computer: {
    word: 'computer',
    wordId: 13,
    ukPhonetic: 'kəmˈpjuːtə',
    usPhonetic: 'kəmˈpjuːtər',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=computer&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=computer&type=2',
    meanings: ['n. 计算机；电脑'],
    webMeanings: [],
    examples: [
      { sentence: 'I use my computer every day.', translation: '我每天使用电脑。', sentenceSpeech: '' }
    ],
    wordForms: ['computers']
  },
  english: {
    word: 'English',
    wordId: 14,
    ukPhonetic: 'ˈɪŋɡlɪʃ',
    usPhonetic: 'ˈɪŋɡlɪʃ',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=English&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=English&type=2',
    meanings: ['n. 英语；英文', 'adj. 英国的；英语的'],
    webMeanings: [],
    examples: [
      { sentence: 'I am learning English.', translation: '我正在学习英语。', sentenceSpeech: '' }
    ],
    wordForms: []
  },
  school: {
    word: 'school',
    wordId: 15,
    ukPhonetic: 'skuːl',
    usPhonetic: 'skuːl',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=school&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=school&type=2',
    meanings: ['n. 学校；学院；学派'],
    webMeanings: [],
    examples: [
      { sentence: 'I go to school every day.', translation: '我每天去学校。', sentenceSpeech: '' }
    ],
    wordForms: ['schools']
  },
  family: {
    word: 'family',
    wordId: 16,
    ukPhonetic: 'ˈfæməli',
    usPhonetic: 'ˈfæməli',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=family&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=family&type=2',
    meanings: ['n. 家庭；家族；子女'],
    webMeanings: [],
    examples: [
      { sentence: 'My family is very happy.', translation: '我的家庭很幸福。', sentenceSpeech: '' }
    ],
    wordForms: ['families']
  },
  friend: {
    word: 'friend',
    wordId: 17,
    ukPhonetic: 'frend',
    usPhonetic: 'frend',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=friend&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=friend&type=2',
    meanings: ['n. 朋友；助手'],
    webMeanings: [],
    examples: [
      { sentence: 'She is my best friend.', translation: '她是我最好的朋友。', sentenceSpeech: '' }
    ],
    wordForms: ['friends']
  },
  happy: {
    word: 'happy',
    wordId: 18,
    ukPhonetic: 'ˈhæpi',
    usPhonetic: 'ˈhæpi',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=happy&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=happy&type=2',
    meanings: ['adj. 快乐的；幸福的；高兴的'],
    webMeanings: [],
    examples: [
      { sentence: 'I am very happy today.', translation: '我今天很开心。', sentenceSpeech: '' }
    ],
    wordForms: ['happier', 'happiest', 'happiness']
  },
  time: {
    word: 'time',
    wordId: 19,
    ukPhonetic: 'taɪm',
    usPhonetic: 'taɪm',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=time&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=time&type=2',
    meanings: ['n. 时间；时代；次数', 'vt. 为...安排时间'],
    webMeanings: [],
    examples: [
      { sentence: 'Time waits for no one.', translation: '时间不等人。', sentenceSpeech: '' }
    ],
    wordForms: ['times', 'timed', 'timing']
  },
  day: {
    word: 'day',
    wordId: 20,
    ukPhonetic: 'deɪ',
    usPhonetic: 'deɪ',
    ukSpeech: 'https://dict.youdao.com/dictvoice?audio=day&type=1',
    usSpeech: 'https://dict.youdao.com/dictvoice?audio=day&type=2',
    meanings: ['n. 一天；白天；时期'],
    webMeanings: [],
    examples: [
      { sentence: 'What a beautiful day!', translation: '多么美好的一天！', sentenceSpeech: '' }
    ],
    wordForms: ['days']
  }
}

// ==================== 中文到英文映射 ====================

export const chineseToEnglishMap = {
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
  '学生': 'student',
  '书': 'book',
  '电脑': 'computer',
  '英语': 'English',
  '学校': 'school',
  '家庭': 'family',
  '朋友': 'friend',
  '快乐': 'happy',
  '时间': 'time',
  '天': 'day'
}

// ==================== 收藏单词列表（根据用户区分）====================

export const mockFavoriteWordsData = {
  student: ref([
    { ...mockWordsData.hello, collectionId: 1 },
    { ...mockWordsData.apple, collectionId: 2 },
    { ...mockWordsData.world, collectionId: 3 },
    { ...mockWordsData.study, collectionId: 4 }
  ]),
  lisi: ref([
    { ...mockWordsData.learn, collectionId: 1 },
    { ...mockWordsData.practice, collectionId: 2 },
    { ...mockWordsData.improve, collectionId: 3 },
    { ...mockWordsData.knowledge, collectionId: 4 },
    { ...mockWordsData.education, collectionId: 5 }
  ]),
  zhangsan: ref([
    { ...mockWordsData.english, collectionId: 1 },
    { ...mockWordsData.computer, collectionId: 2 },
    { ...mockWordsData.book, collectionId: 3 },
    { ...mockWordsData.family, collectionId: 4 },
    { ...mockWordsData.friend, collectionId: 5 },
    { ...mockWordsData.happy, collectionId: 6 }
  ])
}

// ==================== 单词学习进度（根据用户区分）====================

export const mockWordProgressData = {
  student: {
    totalLearned: 128,
    totalMastered: 85,
    totalReviewing: 43,
    todayLearned: 15,
    weekLearned: 76
  },
  lisi: {
    totalLearned: 200,
    totalMastered: 150,
    totalReviewing: 50,
    todayLearned: 20,
    weekLearned: 113
  },
  zhangsan: {
    totalLearned: 320,
    totalMastered: 280,
    totalReviewing: 40,
    todayLearned: 25,
    weekLearned: 145
  }
}

// ==================== 模拟API函数 ====================

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 获取当前用户名
const getCurrentUsername = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    return userInfo.username || 'student'
  }
  return 'student'
}

/**
 * 模拟获取单词列表
 */
export async function mockFetchStudentWords(params = {}) {
  await delay(300)
  const words = Object.values(mockWordsData)
  return {
    code: 200,
    total: words.length,
    rows: words.map(w => ({
      ...w,
      englishWord: w.word,
      chineseMeaning: w.meanings.join('；')
    })),
    records: words
  }
}

/**
 * 模拟搜索单词
 */
export async function mockSearchWord(keyword) {
  await delay(300)
  const lowerKeyword = keyword.toLowerCase()
  
  // 先检查是否是中文
  if (/[\u4e00-\u9fa5]/.test(keyword)) {
    const englishWord = chineseToEnglishMap[keyword]
    if (englishWord && mockWordsData[englishWord]) {
      return {
        success: true,
        data: mockWordsData[englishWord]
      }
    }
  }
  
  // 检查英文单词
  if (mockWordsData[lowerKeyword]) {
    return {
      success: true,
      data: mockWordsData[lowerKeyword]
    }
  }
  
  // 检查模糊匹配
  const matched = Object.values(mockWordsData).find(w => 
    w.word.toLowerCase().includes(lowerKeyword) ||
    w.meanings.some(m => m.includes(keyword))
  )
  
  if (matched) {
    return {
      success: true,
      data: matched
    }
  }
  
  return {
    success: false,
    message: `未找到"${keyword}"相关的单词`
  }
}

/**
 * 模拟获取收藏单词
 */
export async function mockGetFavoriteWords() {
  await delay(300)
  const username = getCurrentUsername()
  const favorites = mockFavoriteWordsData[username] || mockFavoriteWordsData.student
  
  return {
    code: 200,
    rows: favorites.value,
    records: favorites.value
  }
}

/**
 * 模拟收藏/取消收藏
 */
export async function mockToggleWordCollect(wordId, collect) {
  await delay(200)
  const username = getCurrentUsername()
  
  // 确保该用户的收藏列表存在
  if (!mockFavoriteWordsData[username]) {
    mockFavoriteWordsData[username] = ref([])
  }
  
  const favorites = mockFavoriteWordsData[username]
  const word = Object.values(mockWordsData).find(w => w.wordId === wordId)
  
  if (collect) {
    // 添加收藏
    if (word && !favorites.value.find(f => f.wordId === wordId)) {
      favorites.value.push({
        ...word,
        collectionId: Date.now()
      })
    }
  } else {
    // 取消收藏
    favorites.value = favorites.value.filter(f => f.wordId !== wordId)
  }
  
  return {
    code: 200,
    msg: collect ? '收藏成功' : '取消收藏成功'
  }
}

/**
 * 模拟删除收藏
 */
export async function mockDeleteFavoriteWords(collectionIds) {
  await delay(200)
  return {
    code: 200,
    msg: '删除成功'
  }
}

/**
 * 模拟单词答案匹配
 */
export async function mockMatchWordAnswer(params) {
  await delay(200)
  const { wordId, userAnswer, matchType } = params
  const word = Object.values(mockWordsData).find(w => w.wordId === wordId)
  
  if (!word) {
    return {
      code: 400,
      msg: '未找到该单词'
    }
  }
  
  const isCorrect = word.word.toLowerCase() === userAnswer.toLowerCase().trim()
  
  return {
    code: 200,
    data: {
      isCorrect,
      correctAnswer: word.word
    }
  }
}

/**
 * 模拟记录学习进度
 */
export async function mockRecordProgress(progress) {
  await delay(100)
  return {
    code: 200,
    msg: '记录成功'
  }
}

/**
 * 模拟获取单词学习进度
 */
export async function mockGetWordProgress() {
  await delay(200)
  const username = getCurrentUsername()
  const progress = mockWordProgressData[username] || mockWordProgressData.student
  
  return {
    code: 200,
    data: progress
  }
}
