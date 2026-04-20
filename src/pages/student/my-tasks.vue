<template>
  <div class="my-tasks-container">
    <a-card>
      <template #title>
        <div class="card-title-wrapper">
          <span class="title-text">我的任务</span>
          <a-space :size="8" class="title-buttons">
            <a-button 
              :type="taskStatus === 'pending' ? 'primary' : 'default'"
              @click="taskStatus = 'pending'"
            >
              未完成
            </a-button>
            <a-button 
              :type="taskStatus === 'completed' ? 'primary' : 'default'"
              @click="taskStatus = 'completed'"
            >
              已完成
            </a-button>
          </a-space>
        </div>
      </template>

      <!-- 未完成任务列表 -->
      <a-table 
        v-if="taskStatus === 'pending'"
        :columns="pendingColumns" 
        :data-source="pendingTasks" 
        :loading="loading"
        :pagination="{ pageSize: 10 }"
        :scroll="{ x: 1400 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'taskStatus'">
            <a-tag :color="getTaskStatusColor(record.taskStatus)">
              {{ getTaskStatusText(record.taskStatus) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'taskType'">
            <a-tag :color="getTaskTypeColor(record.taskType)">
              {{ getTaskTypeText(record.taskType) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'timeRange'">
            <div style="font-size: 12px">
              <div>开始：{{ record.startTime }}</div>
              <div>截止：{{ record.endTime }}</div>
            </div>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="primary" size="small" @click="startTask(record)">
              去做
            </a-button>
          </template>
        </template>
      </a-table>

      <!-- 已完成任务列表 -->
      <a-table 
        v-if="taskStatus === 'completed'"
        :columns="completedColumns" 
        :data-source="completedTasks" 
        :loading="loading"
        :pagination="{ pageSize: 10 }"
        :scroll="{ x: 1400 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'taskStatus'">
            <a-tag :color="getTaskStatusColor(record.taskStatus)">
              {{ getTaskStatusText(record.taskStatus) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'taskType'">
            <a-tag :color="getTaskTypeColor(record.taskType)">
              {{ getTaskTypeText(record.taskType) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'timeRange'">
            <div style="font-size: 12px">
              <div>开始：{{ record.startTime }}</div>
              <div>截止：{{ record.endTime }}</div>
            </div>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="viewDetail(record)">
              查看详情
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 做题弹窗 -->
    <a-modal
      v-model:open="doTaskModalVisible"
      :title="currentTask?.taskName"
      width="1000px"
      :footer="null"
      @cancel="closeTaskModal"
      :bodyStyle="{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }"
    >
      <div class="task-modal-content">
        <a-spin :spinning="doTaskLoading">
          <a-alert
            :message="`任务信息：${currentTask?.taskTypeText || currentTask?.taskType} | 题目总量：${currentTask?.totalQuestions || currentTask?.questionCount}题`"
            type="info"
            show-icon
            style="margin-bottom: 20px"
          />

          <div v-for="(question, index) in currentQuestions" :key="question.questionId || index" class="question-item">
            <div class="question-title">
              <span class="question-number">{{ index + 1 }}.</span>
              <span>{{ question.questionContent }}</span>
            </div>
            
            <!-- 单选题 -->
            <a-radio-group 
              v-if="question.type === 'single'"
              v-model:value="question.userAnswer"
              style="width: 100%"
            >
              <a-radio 
                v-for="(option, optIndex) in question.options" 
                :key="optIndex"
                :value="option.key"
                style="display: block; margin: 10px 0"
              >
                {{ option.key }}. {{ option.value }}
              </a-radio>
            </a-radio-group>

            <!-- 多选题 -->
            <a-checkbox-group 
              v-if="question.type === 'multiple'"
              v-model:value="question.userAnswer"
              style="width: 100%"
            >
              <a-checkbox 
                v-for="(option, optIndex) in question.options" 
                :key="optIndex"
                :value="option.key"
                style="display: block; margin: 10px 0"
              >
                {{ option.key }}. {{ option.value }}
              </a-checkbox>
            </a-checkbox-group>

            <!-- 填空题 -->
            <a-input 
              v-if="question.type === 'input'"
              v-model:value="question.userAnswer"
              placeholder="请输入答案"
              style="margin-top: 10px; width: 100%"
            />
          </div>

          <div style="text-align: center; margin-top: 30px">
            <a-space>
              <a-button @click="closeTaskModal">取消</a-button>
              <a-button type="primary" @click="submitTask">提交答案</a-button>
            </a-space>
          </div>
        </a-spin>
      </div>
    </a-modal>

    <!-- 详情查看弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      :title="`任务详情 - ${currentTask?.taskName}`"
      width="1000px"
      :footer="null"
      :bodyStyle="{ maxHeight: '70vh', overflowY: 'auto', padding: '24px' }"
    >
      <div class="detail-modal-content">
        <a-spin :spinning="detailLoading">
          <!-- 结果统计 -->
          <a-row :gutter="16" style="margin-bottom: 20px">
            <a-col :span="6">
              <a-statistic 
                title="得分" 
                :value="currentTask?.score" 
                suffix="分"
                :value-style="{ color: (currentTask?.score ?? 0) >= 60 ? '#52c41a' : '#ff4d4f' }"
              />
            </a-col>
            <a-col :span="6">
              <a-statistic 
                title="正确题数" 
                :value="correctCount"
              />
            </a-col>
            <a-col :span="6">
              <a-statistic 
                title="错误题数" 
                :value="wrongCount"
              />
            </a-col>
            <a-col :span="6">
              <a-statistic 
                title="结果" 
                :value="currentTask?.isPassed ? '通过' : '未通过'"
                :value-style="{ color: currentTask?.isPassed ? '#52c41a' : '#ff4d4f' }"
              />
            </a-col>
          </a-row>

          <a-descriptions bordered :column="2" style="margin-bottom: 20px">
            <a-descriptions-item label="任务名称">{{ currentTask?.taskName }}</a-descriptions-item>
            <a-descriptions-item label="任务类型">
              <a-tag :color="getTaskTypeColor(currentTask?.taskType)">
                {{ currentTask?.taskTypeText || currentTask?.taskType }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="题目总量">{{ currentTask?.totalQuestions || currentTask?.questionCount }}题</a-descriptions-item>
            <a-descriptions-item label="所属班级">{{ currentTask?.className }}</a-descriptions-item>
            <a-descriptions-item label="授课老师">{{ currentTask?.teacherName }}</a-descriptions-item>
            <a-descriptions-item label="完成时间">{{ currentTask?.submitTime || '-' }}</a-descriptions-item>
          </a-descriptions>

          <a-divider>题目与答案</a-divider>

          <div v-for="(question, index) in currentTaskDetail" :key="question.questionId || index" class="detail-question-item">
            <div class="question-title">
              <span class="question-number">{{ index + 1 }}.</span>
              <span>{{ question.questionContent }}</span>
              <a-tag 
                :color="question.isCorrect ? 'success' : 'error'" 
                style="margin-left: 10px"
              >
                {{ question.isCorrect ? '正确' : '错误' }}
              </a-tag>
            </div>
            
            <!-- 单选题/多选题 -->
            <div v-if="question.type === 'single' || question.type === 'multiple'" class="question-options">
              <div 
                v-for="(option, optIndex) in question.options" 
                :key="optIndex"
                class="option-item"
                :class="{ 
                  'correct-answer': isCorrectOption(question, option.key),
                  'user-answer': isUserOption(question, option.key)
                }"
              >
                {{ option.key }}. {{ option.value }}
                <a-tag v-if="isCorrectOption(question, option.key)" color="success" style="margin-left: 10px">
                  正确答案
                </a-tag>
                <a-tag v-if="isUserOption(question, option.key) && !isCorrectOption(question, option.key)" color="error" style="margin-left: 10px">
                  您的答案
                </a-tag>
              </div>
            </div>

            <!-- 填空题 -->
            <div v-if="question.type === 'input'" class="answer-section">
              <div class="answer-item">
                <strong>正确答案：</strong>
                <span class="correct-text">{{ question.correctAnswer || '-' }}</span>
              </div>
              <div class="answer-item">
                <strong>您的答案：</strong>
                <span :class="question.userAnswer === question.correctAnswer ? 'correct-text' : 'wrong-text'">
                  {{ question.userAnswer || '未作答' }}
                </span>
              </div>
            </div>

            <!-- 解析 -->
            <div v-if="question.explanation" class="explanation-section">
              <strong>题目解析：</strong>
              <p>{{ question.explanation }}</p>
            </div>
          </div>
        </a-spin>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import myTaskService from '@/services/myTask'

// 任务状态：pending-未完成，completed-已完成
const taskStatus = ref('pending')

// 加载状态
const loading = ref(false)

// 未完成任务列配置
const pendingColumns = [
  { title: '任务名称', dataIndex: 'taskName', key: 'taskName', width: 180 },
  { title: '任务状态', dataIndex: 'taskStatus', key: 'taskStatus', width: 100 },
  { title: '任务类型', dataIndex: 'taskType', key: 'taskType', width: 100 },
  { title: '题目总量', dataIndex: 'questionCount', key: 'questionCount', width: 100 },
  { title: '时间范围', key: 'timeRange', width: 180 },
  { title: '所属班级', dataIndex: 'className', key: 'className', width: 120 },
  { title: '授课老师', dataIndex: 'teacherName', key: 'teacherName', width: 100 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' },
]

// 已完成任务列配置
const completedColumns = [
  { title: '任务名称', dataIndex: 'taskName', key: 'taskName', width: 180 },
  { title: '任务状态', dataIndex: 'taskStatus', key: 'taskStatus', width: 100 },
  { title: '任务类型', dataIndex: 'taskType', key: 'taskType', width: 100 },
  { title: '题目总量', dataIndex: 'questionCount', key: 'questionCount', width: 100 },
  { title: '时间范围', key: 'timeRange', width: 180 },
  { title: '所属班级', dataIndex: 'className', key: 'className', width: 120 },
  { title: '授课老师', dataIndex: 'teacherName', key: 'teacherName', width: 100 },
  { title: '操作', key: 'action', width: 100, fixed: 'right' },
]

// 未完成任务数据
const pendingTasks = ref([])

// 已完成任务数据
const completedTasks = ref([])

// 获取任务列表
const fetchTasks = async () => {
  loading.value = true
  try {
    // 根据任务状态调用不同的接口参数
    const completed = taskStatus.value === 'completed' ? 'true' : 'false'
    const res = await myTaskService.getMyTasks({ completed })
    
    if (res && res.code === 200) {
      const data = res.data || []
      if (taskStatus.value === 'pending') {
        pendingTasks.value = data
      } else {
        completedTasks.value = data
      }
    } else {
      message.error(res?.msg || '获取任务列表失败')
    }
  } catch (error) {
    console.error('获取任务列表失败:', error)
    message.error('获取任务列表失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

// 页面加载时获取数据
onMounted(() => {
  fetchTasks()
})

// 监听任务状态切换，重新获取数据
watch(taskStatus, () => {
  fetchTasks()
})

// 任务状态颜色
const getTaskStatusColor = (status) => {
  const colors = {
    '0': 'default',    // 未开始 - 灰色
    '1': 'processing', // 进行中 - 蓝色
    '2': 'success',    // 已完成 - 绿色
  }
  return colors[status] || 'default'
}

// 任务状态文本
const getTaskStatusText = (status) => {
  const texts = {
    '0': '未开始',
    '1': '进行中',
    '2': '已完成',
  }
  return texts[status] || '未知'
}

// 任务类型映射
const taskTypeMap = {
  '1': '单词测试',
  '2': '阅读理解',
  '3': '语法练习',
  '4': '听力练习',
  '5': '写作练习',
}

// 任务类型颜色
const getTaskTypeColor = (type) => {
  const colors = {
    '单词测试': 'blue',
    '阅读理解': 'green',
    '语法练习': 'orange',
    '听力练习': 'purple',
    '写作练习': 'cyan',
    '1': 'blue',
    '2': 'green',
    '3': 'orange',
    '4': 'purple',
    '5': 'cyan',
  }
  return colors[type] || 'default'
}

// 任务类型文本
const getTaskTypeText = (type) => {
  return taskTypeMap[type] || type || '未知'
}

// 题目类型映射
const questionTypeMap = {
  '1': 'single',   // 单选题
  '2': 'multiple', // 多选题
  '3': 'input',    // 填空题
}

// 做题弹窗相关
const doTaskModalVisible = ref(false)
const doTaskLoading = ref(false)
const currentTask = ref(null)
const currentQuestions = ref([])

// 计时器相关
const taskStartTime = ref(null)
const timerInterval = ref(null)
const timeUsed = ref(0)

// 开始计时
const startTimer = () => {
  taskStartTime.value = Date.now()
  timeUsed.value = 0
  timerInterval.value = setInterval(() => {
    timeUsed.value = Math.floor((Date.now() - taskStartTime.value) / 1000)
  }, 1000)
}

// 停止计时
const stopTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
    timerInterval.value = null
  }
}

// 开始做题
const startTask = async (task) => {
  currentTask.value = task
  doTaskLoading.value = true
  doTaskModalVisible.value = true
  
  try {
    const res = await myTaskService.getTaskQuestions(task.taskId)
    
    if (res && res.code === 200 && res.data) {
      const taskData = res.data
      // 更新任务信息
      currentTask.value = {
        ...task,
        ...taskData,
        taskTypeText: getTaskTypeText(taskData.taskType),
        taskStatusText: taskData.taskStatusText,
      }
      // 处理题目数据
      currentQuestions.value = (taskData.questions || []).map(q => {
        // 调试：打印原始类型
        console.log('题目ID:', q.questionId, '原始questionType:', q.questionType, '映射后type:', questionTypeMap[q.questionType])
        
        let options = []
        // 解析 options 字段（可能是 JSON 字符串）
        if (q.options) {
          try {
            const parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options
            options = Object.entries(parsedOptions).map(([key, value]) => ({ key, value }))
          } catch (e) {
            options = []
          }
        }
        
        return {
          questionId: q.questionId,
          questionName: q.questionName,
          questionContent: q.questionContent,
          questionType: q.questionType, // 保留原始类型便于调试
          type: questionTypeMap[q.questionType] || 'single',
          options: options,
          userAnswer: null,
        }
      })
      // 开始计时
      startTimer()
    } else {
      message.error(res?.msg || '获取题目失败')
      closeTaskModal()
    }
  } catch (error) {
    console.error('获取题目失败:', error)
    message.error('获取题目失败，请稍后重试')
    closeTaskModal()
  } finally {
    doTaskLoading.value = false
  }
}

// 生成模拟题目
const generateQuestions = (count) => {
  const questions = []
  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      // 单选题
      questions.push({
        type: 'single',
        question: `单词 "example${i + 1}" 的中文意思是？`,
        options: [
          { key: 'A', value: '例子' },
          { key: 'B', value: '样本' },
          { key: 'C', value: '示范' },
          { key: 'D', value: '模板' },
        ],
        correctAnswer: 'A',
        userAnswer: null,
      })
    } else {
      // 填空题
      questions.push({
        type: 'input',
        question: `请翻译单词 "word${i + 1}"`,
        correctAnswer: '单词',
        userAnswer: '',
      })
    }
  }
  return questions
}

// 关闭做题弹窗
const closeTaskModal = () => {
  stopTimer()
  doTaskModalVisible.value = false
  currentTask.value = null
  currentQuestions.value = []
}

// 提交任务
const submitTask = async () => {
  // 检查是否所有题目都已作答
  const unanswered = currentQuestions.value.some(q => !q.userAnswer)
  if (unanswered) {
    message.warning('请完成所有题目后再提交')
    return
  }

  // 停止计时
  stopTimer()

  // 构建提交参数
  const answers = currentQuestions.value.map(q => ({
    questionId: q.questionId,
    answer: Array.isArray(q.userAnswer) ? q.userAnswer.join(',') : q.userAnswer,
  }))

  try {
    const res = await myTaskService.submitTaskAnswers({
      taskId: currentTask.value.taskId,
      answers: answers,
      timeUsed: timeUsed.value,
    })

    if (res && res.code === 200 && res.data) {
      const result = res.data
      // 显示结果
      message.success(`提交成功！（答对${result.correctCount}题，答错${result.wrongCount}题）`)
      
      // 刷新任务列表
      await fetchTasks()
      closeTaskModal()
    } else {
      message.error(res?.msg || '提交失败，请稍后重试')
    }
  } catch (error) {
    console.error('提交失败:', error)
    message.error('提交失败，请稍后重试')
  }
}

// 详情查看相关
const detailModalVisible = ref(false)
const detailLoading = ref(false)
const currentTaskDetail = ref([])

// 查看详情
const viewDetail = async (task) => {
  currentTask.value = task
  detailLoading.value = true
  detailModalVisible.value = true
  
  try {
    const res = await myTaskService.getTaskDetail(task.taskId)
    
    if (res && res.code === 200 && res.data) {
      const taskData = res.data
      // 更新任务信息
      currentTask.value = {
        ...task,
        ...taskData,
        taskTypeText: getTaskTypeText(taskData.taskType),
        taskStatusText: taskData.taskStatusText,
      }
      // 处理题目数据
      currentTaskDetail.value = (taskData.questions || []).map(q => {
        let options = []
        // 解析 options 字段（可能是 JSON 字符串）
        if (q.options) {
          try {
            const parsedOptions = typeof q.options === 'string' ? JSON.parse(q.options) : q.options
            options = Object.entries(parsedOptions).map(([key, value]) => ({ key, value }))
          } catch (e) {
            options = []
          }
        }
        
        return {
          questionId: q.questionId,
          questionName: q.questionName,
          questionContent: q.questionContent,
          type: questionTypeMap[q.questionType] || 'single',
          options: options,
          correctAnswer: q.correctAnswer,
          userAnswer: q.userAnswer,
          isCorrect: q.isCorrect,
          explanation: q.explanation,
        }
      })
    } else {
      message.error(res?.msg || '获取详情失败')
    }
  } catch (error) {
    console.error('获取详情失败:', error)
    message.error('获取详情失败，请稍后重试')
  } finally {
    detailLoading.value = false
  }
}

// 答案判断辅助函数
const isCorrectOption = (question, optionKey) => {
  if (!question.correctAnswer) return false
  // 多选题：correctAnswer 可能是 "A,B" 格式
  if (question.type === 'multiple') {
    const correctOptions = question.correctAnswer.split(',').map(s => s.trim())
    return correctOptions.includes(optionKey)
  }
  // 单选题：直接比较
  return question.correctAnswer === optionKey
}

const isUserOption = (question, optionKey) => {
  if (!question.userAnswer) return false
  // 多选题：userAnswer 可能是 "A,B" 格式
  if (question.type === 'multiple') {
    const userOptions = question.userAnswer.split(',').map(s => s.trim())
    return userOptions.includes(optionKey)
  }
  // 单选题：直接比较
  return question.userAnswer === optionKey
}

// 统计正确/错误题数
const correctCount = computed(() => {
  return currentTaskDetail.value.filter(q => q.isCorrect === true).length
})

const wrongCount = computed(() => {
  return currentTaskDetail.value.filter(q => q.isCorrect === false).length
})
</script>

<style scoped src="./my-tasks.css"></style>
