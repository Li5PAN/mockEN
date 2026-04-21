<template>
  <div class="task-management-container">
    <!-- 筛选功能 -->
    <div class="filter-section">
      <a-space :size="12">
        <span class="filter-label">班级等级：</span>
        <div class="level-filter-buttons">
          <button 
            v-for="level in levelOptions" 
            :key="level.value"
            :class="['level-btn', level.value || 'all', { active: filterLevel === level.value }]"
            @click="filterLevel = level.value"
          >
            {{ level.label }}
          </button>
        </div>
      </a-space>
    </div>

    <!-- 任务卡片展示 -->
    <div class="tasks-grid">
      <a-row :gutter="[16, 16]">
        <a-col 
          v-for="task in filteredTasks" 
          :key="task.id" 
          :xs="24" 
          :sm="12" 
          :md="8" 
          :lg="6"
        >
          <a-card class="task-card" hoverable>
            <!-- 任务信息 -->
            <div class="task-info">
              <h3 class="task-name">{{ task.taskName }}</h3>
              
              <div class="info-item">
                <ApartmentOutlined />
                <span>班级等级：</span>
                <a-tag :color="getLevelColor(task.classLevel)" size="small">
                  {{ task.classLevel }}级
                </a-tag>
              </div>
              
              <div class="info-item">
                <TeamOutlined />
                <span>班级名称：{{ task.className }}</span>
              </div>
              
              <div class="info-item">
                <FileTextOutlined />
                <span>题目数量：{{ task.questionCount }}题</span>
              </div>
              
              <div class="info-item">
                <ClockCircleOutlined />
                <span>开始时间：{{ task.startTime }}</span>
              </div>
              
              <div class="info-item">
                <ClockCircleOutlined />
                <span>截止时间：{{ task.deadline }}</span>
              </div>
              
              <div class="info-item">
                <CheckCircleOutlined />
                <span>完成人数：{{ task.completedCount }}/{{ task.totalStudents }}</span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="task-actions">
              <a-button type="primary" size="small" @click="showTaskDetail(task)">
                查看详情
              </a-button>
              <a-button type="default" size="small" @click="remindStudents(task)">
                督促完成
              </a-button>
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- 空状态 -->
      <a-empty v-if="filteredTasks.length === 0" description="暂无任务数据" />
    </div>

    <!-- 任务详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="任务详情"
      :footer="null"
      width="900px"
      :body-style="{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }"
    >
      <div v-if="selectedTask" class="task-detail">
        <a-descriptions :column="2" bordered>
          <a-descriptions-item label="任务名称">{{ selectedTask.taskName }}</a-descriptions-item>
          <a-descriptions-item label="班级等级">
            <a-tag :color="getLevelColor(selectedTask.classLevel)">
              {{ selectedTask.classLevel }}级
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="班级名称">{{ selectedTask.className }}</a-descriptions-item>
          <a-descriptions-item label="题目数量">{{ selectedTask.questionCount }}题</a-descriptions-item>
          <a-descriptions-item label="开始时间">{{ selectedTask.startTime }}</a-descriptions-item>
          <a-descriptions-item label="截止时间">{{ selectedTask.deadline }}</a-descriptions-item>
          <a-descriptions-item label="完成情况">
            {{ selectedTask.completedCount }}/{{ selectedTask.totalStudents }}
          </a-descriptions-item>
          <a-descriptions-item label="发布时间">{{ selectedTask.createTime }}</a-descriptions-item>
        </a-descriptions>

        <a-divider>题目列表</a-divider>

        <div class="questions-detail">
          <div 
            v-for="(question, index) in selectedTask.questions" 
            :key="index"
            class="question-detail-item"
          >
            <div class="question-header">
              <a-tag color="blue">{{ getQuestionTypeLabel(question.type) }}</a-tag>
              <span class="question-title">题目 {{ index + 1 }}</span>
            </div>
            
            <div class="question-content">
              <p><strong>题目内容：</strong>{{ question.content }}</p>
              
              <!-- 选择题选项 -->
              <div v-if="question.type === 'choice' && question.options">
                <p><strong>选项：</strong></p>
                <div 
                  v-for="(option, optIndex) in question.options" 
                  :key="optIndex"
                  class="option-item"
                >
                  <span :class="{ 'correct-answer': question.correctIndexes && question.correctIndexes.includes(optIndex) }">
                    {{ String.fromCharCode(65 + optIndex) }}. {{ option }}
                    <a-tag v-if="question.correctIndexes && question.correctIndexes.includes(optIndex)" color="success" size="small">
                      正确答案
                    </a-tag>
                  </span>
                </div>
              </div>
              
              <!-- 填空题和单词拼写答案 -->
              <p v-else>
                <strong>正确答案：</strong>
                <a-tag color="success">{{ question.answer }}</a-tag>
              </p>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import TeamOutlined from '@ant-design/icons-vue/TeamOutlined'
import FileTextOutlined from '@ant-design/icons-vue/FileTextOutlined'
import ClockCircleOutlined from '@ant-design/icons-vue/ClockCircleOutlined'
import CheckCircleOutlined from '@ant-design/icons-vue/CheckCircleOutlined'
import ApartmentOutlined from '@ant-design/icons-vue/ApartmentOutlined'
// 使用真实接口
import { getTaskList, getTaskDetail, sendTaskReminder } from '@/services/teacher/ttaskmanagement'

// 筛选条件
const filterLevel = ref('')

// 等级选项
const levelOptions = [
  { value: '', label: '全部' },
  { value: 'A', label: 'A级' },
  { value: 'B', label: 'B级' },
  { value: 'C', label: 'C级' },
  { value: 'D', label: 'D级' }
]

// 任务列表
const taskList = ref([])

// 详情弹窗
const detailModalVisible = ref(false)
const selectedTask = ref(null)

// 筛选后的任务列表
const filteredTasks = computed(() => {
  if (!filterLevel.value) {
    return taskList.value
  }
  return taskList.value.filter(item => item.classLevel === filterLevel.value)
})

// 获取等级颜色
const getLevelColor = (level) => {
  const colorMap = {
    A: 'red',
    B: 'orange',
    C: 'blue',
    D: 'green'
  }
  return colorMap[level] || 'default'
}

// 获取题型标签
const getQuestionTypeLabel = (type) => {
  const typeMap = {
    choice: '选择题',
    fillBlank: '填空题',
    spelling: '单词拼写'
  }
  return typeMap[type] || '未知题型'
}

// 显示任务详情（使用真实接口）
const showTaskDetail = async (task) => {
  try {
    const res = await getTaskDetail(task.id)

    if (res.code === 200) {
      const detail = res.data

      // 将 API 返回的数据映射到组件需要的格式
      selectedTask.value = {
        id: detail.id,
        taskName: detail.taskName,
        classId: detail.classId,
        className: detail.className,
        classLevel: detail.classLevel,
        questionCount: detail.questionCount,
        startTime: detail.startTime,
        deadline: detail.deadline,
        completedCount: detail.completedCount,
        totalStudents: detail.totalStudents,
        taskStatus: detail.taskStatus,
        createTime: detail.createTime,
        questions: (detail.questions || []).map(q => {
          // 将题型转换为字符串
          const typeMap = {
            'choice': 'choice',
            'fill-blank': 'fillBlank',
            'spell': 'spelling'
          }
          // 解析选项 JSON 字符串
          let options = null
          let correctIndexes = null
          let answer = q.answer
          if (q.options && Array.isArray(q.options)) {
            options = q.options
            correctIndexes = q.correctIndexes || []
          }
          return {
            type: typeMap[q.type] || q.type || 'choice',
            content: q.content,
            options: options,
            correctIndexes: correctIndexes,
            answer: answer
          }
        })
      }

      detailModalVisible.value = true
    } else {
      message.error(res.msg || '获取任务详情失败')
    }
  } catch (error) {
    console.error('获取任务详情失败:', error)
    message.error('获取任务详情失败')
  }
}

// 督促完成（使用真实接口）
const remindStudents = async (task) => {
  const uncompletedCount = task.totalStudents - task.completedCount
  if (uncompletedCount === 0) {
    message.info('所有学生已完成该任务')
    return
  }

  try {
    const res = await sendTaskReminder(task.id)

    if (res.code === 200) {
      message.success(res.msg || `已向 ${uncompletedCount} 名未完成学生发送督促提示`)
    } else {
      message.error(res.msg || '发送督促失败')
    }
  } catch (error) {
    console.error('发送督促失败:', error)
    message.error('发送督促失败')
  }
}

// 加载任务列表数据（使用真实接口）
const loadData = async () => {
  try {
    const params = {
      classLevel: filterLevel.value || undefined,
      pageNum: 1,
      pageSize: 100
    }

    const res = await getTaskList(params)

    if (res.code === 200) {
      // 将 API 返回的数据映射到组件需要的字段格式
      taskList.value = res.rows.map(item => ({
        id: item.id,
        taskName: item.taskName,
        classId: item.classId,
        className: item.className,
        classLevel: item.classLevel,
        questionCount: item.questionCount,
        startTime: item.startTime,
        deadline: item.deadline,
        completedCount: item.completedCount,
        totalStudents: item.totalStudents,
        taskStatus: item.taskStatus,
        createTime: item.createTime,
        questions: []
      }))
    } else {
      message.error(res.msg || '加载任务列表失败')
    }
  } catch (error) {
    console.error('加载任务列表失败:', error)
    message.error('加载任务列表失败')
  }
}

// 监听筛选条件变化，重新加载数据
import { watch } from 'vue'
watch(filterLevel, () => {
  loadData()
})

onMounted(() => {
  loadData()
})
</script>

<style scoped src="./task-management.css"></style>
