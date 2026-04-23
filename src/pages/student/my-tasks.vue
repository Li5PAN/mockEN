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
            
            <!-- 选择题（支持多选，有选项时渲染） -->
            <a-checkbox-group 
              v-if="(question.type === 'single' || question.type === 'multiple') && question.options && question.options.length > 0"
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

            <!-- 多选题/单选题（无选项时降级为输入框） -->
            <a-input 
              v-if="(question.type === 'single' || question.type === 'multiple') && (!question.options || question.options.length === 0)"
              v-model:value="question.userAnswer"
              placeholder="请输入答案"
              style="margin-top: 10px; width: 100%"
            />

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
            <!-- <a-col :span="6">
              <a-statistic 
                title="得分" 
                :value="currentTask?.score" 
                suffix="分"
                :value-style="{ color: (currentTask?.score ?? 0) >= 60 ? '#52c41a' : '#ff4d4f' }"
              />
            </a-col> -->
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
            <!-- <a-descriptions-item label="完成时间">{{ currentTask?.submitTime || '-' }}</a-descriptions-item> -->
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
            
            <!-- 多选题选项 -->
            <div v-if="(question.type === 'single' || question.type === 'multiple') && question.options && question.options.length > 0" class="question-options">
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

            <!-- 多选题无选项时显示答案 -->
            <div v-if="question.type === 'multiple' && (!question.options || question.options.length === 0)" class="answer-section">
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
            <!-- <div v-if="question.explanation" class="explanation-section">
              <strong>题目解析：</strong>
              <p>{{ question.explanation }}</p>
            </div> -->
          </div>
        </a-spin>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import taskService from '@/services/student/smytask'
const { getTaskList, getTaskDetail, submitTask: submitTaskApi, getTaskResult } = taskService

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
    const res = await getTaskList({ status: taskStatus.value, pageNum: 1, pageSize: 100 })
    
    if (res && res.code === 200) {
      const data = res.rows || []
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
  taskStatus.value = 'pending'
  fetchTasks()
})

// 监听任务状态切换
watch(taskStatus, () => {
  fetchTasks()
})

// 任务状态颜色
const getTaskStatusColor = (status) => {
  const colors = {
    '0': 'default',
    '1': 'processing',
    '2': 'success',
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
  '1': '日常练习',
  '2': '单元测试',
  '3': '期中考试',
  '4': '期末考试',
  '5': '专项练习',
}

// 任务类型颜色
const getTaskTypeColor = (type) => {
  const colors = {
    '日常练习': 'blue',
    '单元测试': 'purple',
    '期中考试': 'red',
    '期末考试': 'magenta',
    '专项练习': 'cyan',
    '1': 'blue',
    '2': 'purple',
    '3': 'red',
    '4': 'magenta',
    '5': 'cyan',
  }
  return colors[type] || 'default'
}

// 任务类型文本
const getTaskTypeText = (type) => {
  return taskTypeMap[type] || type || '未知'
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
    const res = await getTaskDetail(task.taskId)
    
    if (res && res.code === 200 && res.data) {
      const taskData = res.data
      currentTask.value = {
        ...task,
        ...taskData,
      }
      currentQuestions.value = (taskData.questions || []).map(q => {
        return {
          questionId: q.questionId,
          questionContent: q.questionContent,
          type: q.type,
          options: q.options || [],
          score: q.score,
          userAnswer: (q.type === 'input' ? null : []),
        }
      })
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

// 关闭做题弹窗
const closeTaskModal = () => {
  stopTimer()
  doTaskModalVisible.value = false
  currentTask.value = null
  currentQuestions.value = []
}

// 提交任务
const submitTask = async () => {
  const allBlank = currentQuestions.value.every(q => {
    if (q.type === 'input') return !q.userAnswer
    if (Array.isArray(q.userAnswer)) return q.userAnswer.length === 0
    return !q.userAnswer
  })
  if (allBlank) {
    message.warning('请至少回答一道题目后再提交')
    return
  }

  stopTimer()

  const answers = {}
  currentQuestions.value.forEach(q => {
    answers[q.questionId] = q.userAnswer
  })

  try {
    const res = await submitTaskApi(currentTask.value.taskId, answers)

    if (res && res.code === 200 && res.data) {
      const result = res.data
      message.success(res.msg || `提交成功！（答对${result.correctCount}题，答错${result.wrongCount}题）`)
      
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
    const res = await getTaskResult(task.taskId)
    
    if (res && res.code === 200 && res.data) {
      const taskData = res.data
      currentTask.value = {
        ...task,
        ...taskData,
      }
      currentTaskDetail.value = (taskData.questions || []).map(q => {
        return {
          questionId: q.questionId,
          questionContent: q.questionContent,
          type: q.type,
          options: q.options || [],
          score: q.score,
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
  const correct = question.correctAnswer
  if (!correct) return false
  if (Array.isArray(correct)) {
    return correct.includes(optionKey)
  }
  return correct === optionKey
}

const isUserOption = (question, optionKey) => {
  const userAnswer = question.userAnswer
  if (!userAnswer) return false
  if (Array.isArray(userAnswer)) {
    return userAnswer.includes(optionKey)
  }
  return userAnswer === optionKey
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
