<template>
  <div class="word-learn-container">
    <!-- 顶部搜索和模式切换区 -->
    <div class="header-section">
      <div class="search-area">
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="输入单词 / 中文查询（回车确认）"
          size="large"
          :loading="searching"
          @search="handleSearch"
          allow-clear
          @clear="handleClear"
        >
          <template #enterButton>
            <a-button type="primary">查询</a-button>
          </template>
        </a-input-search>
      </div>
      
      <div class="mode-tabs">
        <!-- 搜索模式下显示单词学习按钮 -->
        <a-space v-if="isSearchMode" :size="12">
          <a-button 
            type="primary"
            size="large"
            @click="startLearningFromSearch"
          >
            单词学习
          </a-button>
          <a-button 
            size="large"
            @click="goToFavorites"
          >
            <StarFilled style="color: #faad14;" /> 查看收藏
          </a-button>
        </a-space>
        
        <!-- 学习模式下显示模式切换 -->
        <a-space v-else :size="12">
          <a-button 
            :type="learningMode === 'recognize' ? 'primary' : 'default'"
            size="large"
            @click="learningMode = 'recognize'"
          >
            单词学习
          </a-button>
          <a-button 
            :type="learningMode === 'spell' ? 'primary' : 'default'"
            size="large"
            @click="learningMode = 'spell'"
          >
            看中文拼写英文
          </a-button>
          <a-button 
            :type="learningMode === 'fill' ? 'primary' : 'default'"
            size="large"
            @click="learningMode = 'fill'"
          >
            单词填空
          </a-button>
          <a-button 
            size="large"
            @click="goToFavorites"
          >
            <StarFilled style="color: #faad14;" /> 查看收藏
          </a-button>
          <a-tooltip placement="bottom">
            <template #title>
              <div style="text-align: left;">
                <div>回车键: 下一个单词</div>
              </div>
            </template>
            <a-button size="large" type="text">
              <QuestionCircleOutlined />
            </a-button>
          </a-tooltip>
        </a-space>
      </div>
    </div>

    <!-- 核心展示区 -->
    <div class="content-section">
      <!-- 初始加载状态 -->
      <div v-if="isInitialLoading" class="loading-container">
        <a-spin size="large" tip="正在加载单词..." />
      </div>
      
      <!-- 搜索模式 -->
      <div v-else-if="isSearchMode" class="search-result">
        <a-spin :spinning="searching">
          <div v-if="searchResult" class="word-detail">
            <!-- 单词和发音 -->
            <div class="word-header">
              <h1 class="word-title">{{ searchResult.word }}</h1>
              <div class="phonetic-area">
                <span v-if="searchResult.ukPhonetic" class="phonetic">
                  英 [{{ searchResult.ukPhonetic }}]
                  <a-button 
                    type="link" 
                    size="small"
                    @click="playAudio(searchResult.ukSpeech)"
                  >
                    <SoundOutlined />
                  </a-button>
                </span>
                <span v-if="searchResult.usPhonetic" class="phonetic">
                  美 [{{ searchResult.usPhonetic }}]
                  <a-button 
                    type="link" 
                    size="small"
                    @click="playAudio(searchResult.usSpeech)"
                  >
                    <SoundOutlined />
                  </a-button>
                </span>
              </div>
              <a-button 
                type="text" 
                :icon="h(isFavorite ? StarFilled : StarOutlined)"
                @click="toggleFavorite"
                class="favorite-btn"
              >
                {{ isFavorite ? '已收藏' : '收藏' }}
              </a-button>
            </div>

            <!-- 释义 -->
            <div class="meanings-section">
              <h3>释义</h3>
              <div class="meanings-list">
                <p v-for="(meaning, index) in searchResult.meanings" :key="index">
                  {{ meaning }}
                </p>
              </div>
              
              <!-- 词形变化 -->
              <div v-if="searchResult.wordForms && searchResult.wordForms.length > 0" class="word-forms">
                <span v-for="(form, index) in searchResult.wordForms" :key="index" class="word-form">
                  {{ form }}
                </span>
              </div>
            </div>

            <!-- 例句 -->
            <div v-if="searchResult.examples.length > 0" class="examples-section">
              <h3>例句</h3>
              <div 
                v-for="(example, index) in searchResult.examples" 
                :key="index"
                class="example-item"
              >
                <p class="example-en">
                  {{ example.sentence }}
                  <a-button 
                    v-if="example.sentenceSpeech"
                    type="link" 
                    size="small"
                    @click="playAudio(example.sentenceSpeech)"
                  >
                    <SoundOutlined />
                  </a-button>
                </p>
                <p class="example-cn">{{ example.translation }}</p>
              </div>
            </div>

            <!-- 网络释义 -->
            <div v-if="searchResult.webMeanings.length > 0" class="web-meanings-section">
              <h3>网络释义</h3>
              <div 
                v-for="(item, index) in searchResult.webMeanings" 
                :key="index"
                class="web-meaning-item"
              >
                <span class="phrase">{{ item.phrase }}</span>
                <span class="meaning">{{ item.meaning }}</span>
              </div>
            </div>
          </div>
          
          <a-empty v-else-if="searchError" :description="searchError" />
        </a-spin>
      </div>

      <!-- 学习模式 -->
      <div v-else-if="wordList.length > 0" class="learning-mode">
        <!-- 单词认识模式 -->
        <div v-if="learningMode === 'recognize'" class="recognize-mode">
          <div class="word-card">
            <h1 class="word-title">{{ currentWord.word }}</h1>
            <div class="phonetic-area">
              <span v-if="currentWord.ukPhonetic" class="phonetic">
                英 [{{ currentWord.ukPhonetic }}]
                <a-button 
                  type="link" 
                  size="small"
                  @click="playAudio(currentWord.ukSpeech)"
                >
                  <SoundOutlined />
                </a-button>
              </span>
              <span v-if="currentWord.usPhonetic" class="phonetic">
                美 [{{ currentWord.usPhonetic }}]
                <a-button 
                  type="link" 
                  size="small"
                  @click="playAudio(currentWord.usSpeech)"
                >
                  <SoundOutlined />
                </a-button>
              </span>
            </div>
            
            <div class="meanings-list">
              <p v-for="(meaning, index) in currentWord.meanings" :key="index">
                {{ meaning }}
              </p>
            </div>

            <!-- 例句 -->
            <div v-if="currentWord.examples && currentWord.examples.length > 0" class="examples-section">
              <h3>例句</h3>
              <div 
                v-for="(example, index) in currentWord.examples" 
                :key="index"
                class="example-item"
              >
                <p class="example-en">
                  {{ example.sentence }}
                  <a-button 
                    v-if="example.sentenceSpeech"
                    type="link" 
                    size="small"
                    @click="playAudio(example.sentenceSpeech)"
                  >
                    <SoundOutlined />
                  </a-button>
                </p>
                <p class="example-cn">{{ example.translation }}</p>
              </div>
            </div>

            <div class="action-buttons-row">
              <a-button 
                type="text" 
                :icon="h(isFavorite ? StarFilled : StarOutlined)"
                @click="toggleFavorite"
                class="favorite-btn"
              >
                {{ isFavorite ? '已收藏' : '收藏' }}
              </a-button>
              <a-button 
                type="primary" 
                size="large"
                @click="goNextWord"
              >
                下一个
              </a-button>
            </div>
          </div>
        </div>

        <!-- 看中文拼写英文模式 -->
        <div v-else-if="learningMode === 'spell'" class="spell-mode">
          <div class="word-card">
            <h2>请根据中文释义拼写单词</h2>
            <div class="meanings-list">
              <p v-for="(meaning, index) in currentWord.meanings" :key="index">
                {{ meaning }}
              </p>
            </div>

            <a-input
              v-model:value="userInput"
              placeholder="请输入单词"
              size="large"
              @pressEnter="checkSpelling"
              class="input-field"
            />

            <div v-if="showResult" class="result-feedback">
              <a-alert
                :type="isCorrect ? 'success' : 'error'"
                :message="isCorrect ? '回答正确！' : '回答错误'"
                show-icon
              >
                <template #description>
                  <div v-if="!isCorrect">
                    <p>正确答案：{{ correctAnswer }}</p>
                    <p>你的答案：{{ userInput }}</p>
                  </div>
                </template>
              </a-alert>
            </div>

            <a-button 
              type="primary" 
              size="large" 
              @click="checkSpelling"
              :disabled="!userInput"
              class="submit-btn"
            >
              提交
            </a-button>
          </div>

          <div class="progress-footer">
            <span class="progress-text">{{ currentIndex + 1 }} / {{ wordList.length }}</span>
            <a-button type="primary" size="large" @click="nextWord">
              下一个
            </a-button>
          </div>
        </div>

        <!-- 单词填空模式 -->
        <div v-else-if="learningMode === 'fill'" class="fill-mode">
          <div class="word-card">
            <h2>请填写缺失的字母</h2>
            <div class="word-display">
              <span 
                v-for="(char, index) in displayWord" 
                :key="index"
                class="char-box"
                :class="{ blank: char === '_' }"
              >
                <a-input
                  v-if="char === '_'"
                  v-model:value="fillInputs[index]"
                  maxlength="1"
                  class="fill-input"
                  @input="handleFillInput(index)"
                />
                <span v-else>{{ char }}</span>
              </span>
            </div>

            <div class="meanings-list">
              <p v-for="(meaning, index) in currentWord.meanings" :key="index">
                {{ meaning }}
              </p>
            </div>

            <div v-if="showResult" class="result-feedback">
              <a-alert
                :type="isCorrect ? 'success' : 'error'"
                :message="isCorrect ? '回答正确！' : '回答错误'"
                show-icon
              >
                <template #description>
                  <div v-if="!isCorrect">
                    <p>正确答案：{{ correctAnswer }}</p>
                  </div>
                </template>
              </a-alert>
            </div>

            <a-button 
              type="primary" 
              size="large" 
              @click="checkFill"
              class="submit-btn"
            >
              提交
            </a-button>
          </div>

          <div class="progress-footer">
            <span class="progress-text">{{ currentIndex + 1 }} / {{ wordList.length }}</span>
            <a-button type="primary" size="large" @click="nextWord">
              下一个
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { SoundOutlined, StarOutlined, StarFilled, QuestionCircleOutlined } from '@ant-design/icons-vue'
import { 
  fetchWordList,
  searchWord,
  collectWord,
  uncollectWord,
  getFavoriteList,
  checkSpelling as apiCheckSpelling,
  checkFillBlank as apiCheckFillBlank
} from '../../services/student/swordlearn.js'
import { incrementWordCount } from '../../utils/wordCount.js'

const router = useRouter()

// 搜索相关
const searchKeyword = ref('')
const searching = ref(false)
const searchResult = ref(null)
const searchError = ref('')

// 学习模式
const learningMode = ref('recognize')
const isSearchMode = computed(() => !!searchResult.value)

// 单词列表（从服务动态加载）
const wordList = ref([])
const allWords = ref([])
const isInitialLoading = ref(true)
const learnedCount = ref(0)

const currentIndex = ref(0)
const currentWord = computed(() => wordList.value[currentIndex.value] || {})

// 收藏状态
const isFavorite = ref(false)

// 拼写模式
const userInput = ref('')
const showResult = ref(false)
const isCorrect = ref(false)
const correctAnswer = ref('')

// 填空模式
const fillInputs = ref({})
const displayWord = ref([])

const initFillMode = () => {
  if (!currentWord.value.word) {
    displayWord.value = []
    return
  }
  const word = currentWord.value.word
  const result = []
  const blankCount = Math.ceil(word.length / 3)
  const blankPositions = new Set()
  
  while (blankPositions.size < blankCount) {
    blankPositions.add(Math.floor(Math.random() * word.length))
  }
  
  for (let i = 0; i < word.length; i++) {
    result.push(blankPositions.has(i) ? '_' : word[i])
  }
  
  displayWord.value = result
}

// 搜索单词
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) {
    message.warning('请输入要查询的单词')
    return
  }

  searching.value = true
  searchError.value = ''

  try {
    const keyword = searchKeyword.value.trim()
    const res = await searchWord(keyword)
    
    if (res.success && res.data) {
      searchResult.value = res.data
      if (res.data.meanings && res.data.meanings.length > 0) {
        message.success('查询成功')
      }
      checkSearchResultFavorite()
    } else {
      searchError.value = res.message || `未找到"${keyword}"相关的单词`
    }
  } catch (error) {
    console.error('搜索失败:', error)
    searchError.value = '搜索失败，请稍后重试'
  } finally {
    searching.value = false
  }
}

// 检查搜索结果的收藏状态
const checkSearchResultFavorite = async () => {
  if (!searchResult.value?.wordId) {
    isFavorite.value = false
    return
  }
  
  try {
    const res = await getFavoriteList()
    if (res.code === 200) {
      isFavorite.value = res.records.some(w => w.wordId === searchResult.value.wordId)
    }
  } catch (error) {
    console.error('检查收藏状态失败:', error)
    isFavorite.value = false
  }
}

// 清空搜索
const handleClear = () => {
  searchKeyword.value = ''
  searchResult.value = null
  searchError.value = ''
  loadWords()
}

// 从搜索结果开始学习
const startLearningFromSearch = () => {
  if (!searchResult.value) {
    message.warning('请先搜索单词')
    return
  }
  
  wordList.value = [searchResult.value]
  currentIndex.value = 0
  
  searchKeyword.value = ''
  searchResult.value = null
  searchError.value = ''
  
  resetLearningState()
  
  message.success('开始学习该单词')
}

// 播放发音
const playAudio = (audioUrl) => {
  if (!audioUrl) {
    message.info('暂无发音')
    return
  }

  try {
    const audio = new Audio(audioUrl)
    
    audio.addEventListener('error', (e) => {
      console.error('音频加载失败:', audioUrl, e)
      message.error('发音加载失败，请检查网络或稍后重试')
    })
    
    audio.addEventListener('canplay', () => {
      audio.play().catch(err => {
        console.error('音频播放失败:', err)
        message.error('发音播放失败')
      })
    })
    
    setTimeout(() => {
      if (audio.readyState === 0) {
        message.warning('发音加载超时，请检查网络连接')
      }
    }, 5000)
    
  } catch (error) {
    console.error('创建音频对象失败:', error)
    message.error('发音功能异常')
  }
}

// 切换收藏
const toggleFavorite = async () => {
  const wordData = isSearchMode.value ? searchResult.value : currentWord.value
  const wordId = wordData.wordId
  const word = wordData.word
  
  if (!wordId) {
    message.error('无法获取单词ID')
    return
  }
  
  try {
    if (isFavorite.value) {
      await uncollectWord(wordId)
      isFavorite.value = false
      message.success('已取消收藏')
    } else {
      await collectWord(wordId)
      isFavorite.value = true
      message.success('收藏成功')
    }
  } catch (error) {
    message.error('操作失败，请稍后重试')
  }
}

// 认识 - 跳下一个
const handleKnown = () => {
  goNextWord()
}

// 不认识 - 跳下一个
const handleUnknown = () => {
  goNextWord()
}

// 跳转到下一个单词
const goNextWord = () => {
  if (currentIndex.value < wordList.value.length - 1) {
    currentIndex.value++
    learnedCount.value++
    incrementWordCount() // 记录每日单词学习计数
    resetLearningState()
    
    if (learnedCount.value > 0 && learnedCount.value % 20 === 0) {
      message.success(`已学习 ${learnedCount.value} 个单词，继续加油！`)
    }
  } else {
    message.success(`恭喜完成所有 ${learnedCount.value} 个单词学习！`)
    currentIndex.value = 0
    wordList.value = shuffleArray([...allWords.value]).slice(0, Math.min(100, allWords.value.length))
    learnedCount.value = 0
    resetLearningState()
  }
}

// 下一个单词
const nextWord = async () => {
  if (currentIndex.value < wordList.value.length - 1) {
    currentIndex.value++
    learnedCount.value++
    incrementWordCount()
    resetLearningState()
    
    if (learnedCount.value > 0 && learnedCount.value % 20 === 0) {
      message.success(`已学习 ${learnedCount.value} 个单词，继续加油！`)
    }
  } else {
    message.success(`恭喜完成所有 ${learnedCount.value} 个单词学习！`)
    currentIndex.value = 0
    wordList.value = shuffleArray([...allWords.value]).slice(0, Math.min(100, allWords.value.length))
    learnedCount.value = 0
    resetLearningState()
  }
}

// 重置学习状态
const resetLearningState = () => {
  userInput.value = ''
  showResult.value = false
  isCorrect.value = false
  correctAnswer.value = ''
  fillInputs.value = {}
  initFillMode()
  checkCurrentFavorite()
}

// 检查拼写
const checkSpelling = async () => {
  if (!userInput.value || !currentWord.value.wordId) return

  try {
    const res = await apiCheckSpelling({
      wordId: currentWord.value.wordId,
      userAnswer: userInput.value
    })
    
    isCorrect.value = res.data?.isCorrect ?? false
    correctAnswer.value = res.data?.correctAnswer || currentWord.value.word
    showResult.value = true

    if (isCorrect.value) {
      setTimeout(() => {
        nextWord()
      }, 1500)
    }
  } catch (error) {
    message.error('验证失败，请稍后重试')
  }
}

// 检查填空
const checkFill = async () => {
  if (!currentWord.value.wordId) return
  
  const userAnswer = displayWord.value.map((char, index) => {
    return char === '_' ? (fillInputs.value[index] || '') : char
  }).join('')

  try {
    const res = await apiCheckFillBlank({
      wordId: currentWord.value.wordId,
      userAnswer: userAnswer
    })
    
    isCorrect.value = res.data?.isCorrect ?? false
    correctAnswer.value = res.data?.correctAnswer || currentWord.value.word
    showResult.value = true

    if (isCorrect.value) {
      setTimeout(() => {
        nextWord()
      }, 1500)
    }
  } catch (error) {
    message.error('验证失败，请稍后重试')
  }
}

// 处理填空输入
const handleFillInput = (index) => {
  const nextBlank = displayWord.value.findIndex((char, i) => i > index && char === '_')
  if (nextBlank !== -1 && fillInputs.value[index]) {
    setTimeout(() => {
      const inputs = document.querySelectorAll('.fill-input input')
      const currentInputIndex = Array.from(inputs).findIndex(input => 
        input === document.activeElement
      )
      if (currentInputIndex !== -1 && inputs[currentInputIndex + 1]) {
        inputs[currentInputIndex + 1].focus()
      }
    }, 0)
  }
}

// 加载单词列表
const loadWords = async () => {
  isInitialLoading.value = true
  
  try {
    const res = await fetchWordList({ 
      page: 1, 
      pageSize: 100 
    })
    
    if (res.records && res.records.length > 0) {
      allWords.value = res.records
      const selectedWords = shuffleArray([...allWords.value]).slice(0, 100)
      wordList.value = selectedWords
      learnedCount.value = 0
      currentIndex.value = 0
      initFillMode()
      checkCurrentFavorite()
    } else {
      message.warning('暂无学习单词')
    }
  } catch (error) {
    console.error('加载单词失败:', error)
    message.error('加载单词失败，请刷新页面重试')
  } finally {
    isInitialLoading.value = false
  }
}

// 检查当前单词是否已收藏
const checkCurrentFavorite = async () => {
  if (!currentWord.value.wordId) {
    isFavorite.value = false
    return
  }
  
  try {
    const res = await getFavoriteList()
    if (res.code === 200) {
      isFavorite.value = res.records.some(w => w.wordId === currentWord.value.wordId)
    }
  } catch (error) {
    console.error('检查收藏状态失败:', error)
    isFavorite.value = false
  }
}

// 数组随机洗牌
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

onMounted(() => {
  loadWords()
  window.addEventListener('keydown', handleKeyPress)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

// 快捷键处理
const handleKeyPress = (event) => {
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return
  }
  
  if (event.code === 'Enter' && !isSearchMode.value && wordList.value.length > 0) {
    event.preventDefault()
    nextWord()
  }
}

// 跳转到收藏页面
const goToFavorites = () => {
  router.push('/student/word-favorites')
}
</script>

<style scoped src="./word-learn.css"></style>
