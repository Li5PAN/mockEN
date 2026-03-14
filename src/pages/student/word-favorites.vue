<template>
  <div class="word-favorites-container">
    <!-- 顶部操作区 -->
    <div class="header-section">
      <a-space :size="16">
        <a-button @click="goBack">
          <LeftOutlined /> 返回
        </a-button>
        <a-input-search
          v-model:value="searchKeyword"
          placeholder="搜索收藏的单词"
          style="width: 300px"
          @search="handleSearch"
          allow-clear
        />
        <a-button 
          :type="learningMode === 'list' ? 'primary' : 'default'"
          size="large"
          @click="learningMode = 'list'"
        >
          列表模式
        </a-button>
        <a-button 
          :type="learningMode === 'spell' ? 'primary' : 'default'"
          size="large"
          @click="learningMode = 'spell'"
        >
          拼写练习
        </a-button>
        <a-button 
          :type="learningMode === 'fill' ? 'primary' : 'default'"
          size="large"
          @click="learningMode = 'fill'"
        >
          填空练习
        </a-button>
      </a-space>
    </div>

    <!-- 内容区 -->
    <div class="content-section">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <a-spin size="large" tip="正在加载收藏单词..." />
      </div>

      <!-- 列表模式 -->
      <div v-else-if="learningMode === 'list'" class="list-mode">
        <a-empty v-if="filteredWords.length === 0" description="暂无收藏单词" />
        
        <a-row v-else :gutter="[16, 16]">
          <a-col 
            v-for="word in filteredWords" 
            :key="word.word"
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="6"
          >
            <a-card 
              hoverable
              class="word-card-item"
            >
              <template #title>
                <div class="card-title">
                  {{ word.word }}
                  <a-button 
                    type="text" 
                    danger
                    size="small"
                    @click="removeFavorite(word.word)"
                  >
                    <DeleteOutlined />
                  </a-button>
                </div>
              </template>
              <div class="phonetic-area">
                <span v-if="word.ukPhonetic" class="phonetic">
                  英 [{{ word.ukPhonetic }}]
                  <a-button 
                    type="link" 
                    size="small"
                    @click="playAudio(word.ukSpeech)"
                  >
                    <SoundOutlined />
                  </a-button>
                </span>
                <span v-if="word.usPhonetic" class="phonetic">
                  美 [{{ word.usPhonetic }}]
                  <a-button 
                    type="link" 
                    size="small"
                    @click="playAudio(word.usSpeech)"
                  >
                    <SoundOutlined />
                  </a-button>
                </span>
              </div>
              <div class="meanings">
                <p v-for="(meaning, index) in word.meanings.slice(0, 2)" :key="index">
                  {{ meaning }}
                </p>
              </div>
              <div v-if="word.examples && word.examples.length > 0" class="examples-section">
                <div 
                  v-for="(example, idx) in word.examples.slice(0, 1)" 
                  :key="idx"
                  class="example-item"
                >
                  <p class="example-en">{{ example.sentence }}</p>
                  <p class="example-cn">{{ example.translation }}</p>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>

      <!-- 拼写练习模式 -->
      <div v-else-if="learningMode === 'spell'" class="practice-mode">
        <a-empty v-if="filteredWords.length === 0" description="暂无收藏单词可练习" />
        
        <div v-else class="word-card">
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
                  <p>正确答案：{{ currentWord.word }}</p>
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

          <div class="progress-footer">
            <span class="progress-text">{{ currentIndex + 1 }} / {{ filteredWords.length }}</span>
            <a-button type="primary" size="large" @click="nextWord">
              下一个
            </a-button>
          </div>
        </div>
      </div>

      <!-- 填空练习模式 -->
      <div v-else-if="learningMode === 'fill'" class="practice-mode">
        <a-empty v-if="filteredWords.length === 0" description="暂无收藏单词可练习" />
        
        <div v-else class="word-card">
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
                  <p>正确答案：{{ currentWord.word }}</p>
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

          <div class="progress-footer">
            <span class="progress-text">{{ currentIndex + 1 }} / {{ filteredWords.length }}</span>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { 
  LeftOutlined, 
  DeleteOutlined, 
  SoundOutlined 
} from '@ant-design/icons-vue'
import { getFavoriteWords, removeFromFavorites } from '../../services/wordService'

const router = useRouter()

// 状态
const loading = ref(true)
const favoriteWords = ref([])
const searchKeyword = ref('')
const learningMode = ref('list')

// 练习模式状态
const currentIndex = ref(0)
const userInput = ref('')
const showResult = ref(false)
const isCorrect = ref(false)
const fillInputs = ref({})

// 计算属性
const filteredWords = computed(() => {
  if (!searchKeyword.value) return favoriteWords.value
  
  const keyword = searchKeyword.value.toLowerCase()
  return favoriteWords.value.filter(word => 
    word.word.toLowerCase().includes(keyword) ||
    word.meanings.some(m => m.includes(searchKeyword.value))
  )
})

const currentWord = computed(() => filteredWords.value[currentIndex.value] || {})

const displayWord = computed(() => {
  if (!currentWord.value.word) return []
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
  
  return result
})

// 方法
const goBack = () => {
  router.back()
}

const handleSearch = () => {
  // 搜索已在 computed 中处理
}

const loadFavorites = async () => {
  loading.value = true
  try {
    const words = await getFavoriteWords()
    favoriteWords.value = words
    
    if (words.length === 0) {
      message.info('暂无收藏单词')
    }
  } catch (error) {
    console.error('加载收藏单词失败:', error)
    message.error('加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const removeFavorite = async (word) => {
  try {
    await removeFromFavorites(word)
    message.success('已取消收藏')
    await loadFavorites()
  } catch (error) {
    message.error('操作失败')
  }
}

const playAudio = (audioUrl) => {
  if (!audioUrl) {
    message.info('暂无发音')
    return
  }

  try {
    const audio = new Audio(audioUrl)
    audio.play().catch(err => {
      console.error('音频播放失败:', err)
      message.error('发音播放失败')
    })
  } catch (error) {
    console.error('创建音频对象失败:', error)
    message.error('发音功能异常')
  }
}

const checkSpelling = () => {
  if (!userInput.value) return
  
  isCorrect.value = userInput.value.toLowerCase() === currentWord.value.word.toLowerCase()
  showResult.value = true
  
  if (isCorrect.value) {
    setTimeout(() => {
      nextWord()
    }, 1500)
  }
}

const checkFill = () => {
  const userAnswer = displayWord.value.map((char, index) => {
    return char === '_' ? (fillInputs.value[index] || '') : char
  }).join('')
  
  isCorrect.value = userAnswer.toLowerCase() === currentWord.value.word.toLowerCase()
  showResult.value = true
  
  if (isCorrect.value) {
    setTimeout(() => {
      nextWord()
    }, 1500)
  }
}

const nextWord = () => {
  if (currentIndex.value < filteredWords.value.length - 1) {
    currentIndex.value++
    resetPracticeState()
  } else {
    message.success('已完成所有单词练习！')
    currentIndex.value = 0
    resetPracticeState()
  }
}

const resetPracticeState = () => {
  userInput.value = ''
  showResult.value = false
  isCorrect.value = false
  fillInputs.value = {}
}

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

onMounted(() => {
  loadFavorites()
})
</script>

<style scoped src="./word-favorites.css"></style>
