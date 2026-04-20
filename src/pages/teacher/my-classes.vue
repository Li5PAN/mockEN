<template>
  <div class="my-classes-container">
    <!-- 顶部区域 -->
    <div class="top-section">
      <!-- 功能按钮 -->
      <div class="action-bar">
        <a-button type="primary" size="large" @click="showCreateModal">
          <template #icon><PlusOutlined /></template>
          创建班级
        </a-button>
      </div>

      <!-- 统计数据 -->
      <div class="statistics">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-card>
              <a-statistic title="学生总人数" :value="statistics.totalStudents" suffix="人" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic title="我的班级总数" :value="statistics.totalClasses" suffix="个" />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic 
                title="班级平均完成率" 
                :value="statistics.avgCompletionRate" 
                suffix="%" 
                :precision="1"
              />
            </a-card>
          </a-col>
          <a-col :span="6">
            <a-card>
              <a-statistic 
                title="学生申请审核数" 
                :value="statistics.pendingReviews" 
                suffix="个"
                :value-style="{ color: '#cf1322' }"
              />
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>

    <!-- 中间区域 -->
    <div class="middle-section">
      <!-- 筛选功能 -->
      <div class="filter-bar">
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

      <!-- 班级卡片展示 -->
      <div class="classes-grid">
        <a-row :gutter="[16, 16]">
          <a-col 
            v-for="classItem in paginatedClasses" 
            :key="classItem.id" 
            :xs="24" 
            :sm="12" 
            :md="8" 
            :lg="6"
          >
            <a-card class="class-card" hoverable>
              <!-- 待审核标签 -->
              <div class="pending-badge" v-if="classItem.pendingCount > 0">
                <a-badge :count="classItem.pendingCount" :offset="[10, -5]">
                  <span class="badge-text">待审核申请</span>
                </a-badge>
              </div>

              <!-- 班级等级标签 -->
              <div class="level-tag">
                <a-tag :color="getLevelColor(classItem.level)" class="level-badge">
                  {{ classItem.level }}级
                </a-tag>
              </div>

              <!-- 班级信息 -->
              <div class="class-info">
                <h3 class="class-name">{{ classItem.name }}</h3>
                
                <div class="info-item">
                  <TeamOutlined />
                  <span>限定人数：{{ classItem.maxStudents }}人</span>
                </div>
                <div class="info-item">
                  <TeamOutlined />
                  <span>当前人数：{{ classItem.currentStudents || 0 }}人</span>
                </div>
                
                <div class="info-item">
                  <CarryOutOutlined />
                  <span>任务数量：{{ classItem.taskCount }}个</span>
                </div>
                
                <div class="info-item">
                  <ClockCircleOutlined />
                  <span>创建时间：{{ classItem.createTime }}</span>
                </div>

                <!-- 发布任务按钮 -->
                <div class="publish-task-btn-wrapper">
                  <a-button type="primary" size="small" @click="showPublishTaskModal(classItem)">
                    发布任务
                  </a-button>
                </div>
              </div>
            </a-card>
          </a-col>
        </a-row>

        <!-- 空状态 -->
        <a-empty v-if="paginatedClasses.length === 0" description="暂无班级数据" />
      </div>

      <!-- 分页器 -->
      <div class="pagination-wrapper">
        <a-pagination
          v-model:current="pagination.current"
          :total="filteredClasses.length"
          :page-size="pagination.pageSize"
          show-quick-jumper
          @change="handlePageChange"
        />
      </div>
    </div>

    <!-- 创建班级弹窗 -->
    <a-modal
      v-model:open="createModalVisible"
      title="创建班级"
      @ok="handleCreateClass"
      @cancel="handleCancelCreate"
      :confirm-loading="createLoading"
      width="500px"
    >
      <a-form
        ref="createFormRef"
        :model="createForm"
        :rules="createRules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
      >
        <a-form-item label="班级等级" name="level">
          <a-select v-model:value="createForm.level" placeholder="请选择班级等级">
            <a-select-option value="A">A级</a-select-option>
            <a-select-option value="B">B级</a-select-option>
            <a-select-option value="C">C级</a-select-option>
            <a-select-option value="D">D级</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="班级名称" name="name">
          <a-input v-model:value="createForm.name" placeholder="请输入班级名称" />
        </a-form-item>

        <a-form-item label="任务数量" name="taskCount">
          <a-input-number
            v-model:value="createForm.taskCount"
            :min="0"
            :max="100"
            placeholder="0-100"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="班级限定人数" name="maxStudents">
          <a-input-number
            v-model:value="createForm.maxStudents"
            :min="30"
            :max="50"
            placeholder="30-50"
            style="width: 100%"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 发布任务弹窗 -->
    <a-modal
      v-model:open="publishTaskModalVisible"
      title="发布任务"
      @ok="handlePublishTask"
      @cancel="handleCancelPublishTask"
      :confirm-loading="publishTaskLoading"
      width="1000px"
      :body-style="{ height: 'calc(100vh - 200px)', overflowY: 'auto' }"
    >
      <a-form
        ref="publishTaskFormRef"
        :model="publishTaskForm"
        :rules="publishTaskRules"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
      >
        <a-form-item label="任务名称" name="taskName">
          <a-input v-model:value="publishTaskForm.taskName" placeholder="请输入任务名称" />
        </a-form-item>

        <a-form-item label="所属班级">
          <a-input :value="selectedClass?.name" disabled />
        </a-form-item>

        <a-form-item label="任务类型" name="taskType">
          <a-select v-model:value="publishTaskForm.taskType" placeholder="请选择任务类型">
            <a-select-option value="1">单词学习</a-select-option>
            <a-select-option value="2">单词测试</a-select-option>
            <a-select-option value="3">综合练习</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="开始时间" name="startTime">
          <a-date-picker 
            v-model:value="publishTaskForm.startTime" 
            show-time 
            format="YYYY-MM-DD HH:mm"
            placeholder="请选择任务开始时间"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="截止时间" name="deadline">
          <a-date-picker 
            v-model:value="publishTaskForm.deadline" 
            show-time 
            format="YYYY-MM-DD HH:mm"
            placeholder="请选择任务截止时间"
            style="width: 100%"
          />
        </a-form-item>

        <a-divider>题目列表</a-divider>

        <!-- 题目列表 -->
        <div class="questions-list">
          <div 
            v-for="(question, index) in publishTaskForm.questions" 
            :key="index"
            class="question-item"
          >
            <div class="question-header">
              <span class="question-number">题目 {{ index + 1 }}</span>
              <a-button 
                type="text" 
                danger 
                size="small" 
                @click="removeQuestion(index)"
              >
                删除
              </a-button>
            </div>

            <a-form-item label="题型">
              <a-select v-model:value="question.type" placeholder="请选择题型" @change="handleQuestionTypeChange(question)">
                <a-select-option value="choice">选择题</a-select-option>
                <a-select-option value="fillBlank">填空题</a-select-option>
                <a-select-option value="spelling">单词拼写</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="题目内容">
              <a-textarea 
                v-model:value="question.content" 
                placeholder="请输入题目内容"
                :rows="2"
              />
            </a-form-item>

            <!-- 选择题选项 -->
            <a-form-item label="选项" v-if="question.type === 'choice'">
              <div style="margin-bottom: 8px; color: #666; font-size: 12px;">
                请勾选正确答案（可单选或多选）
              </div>
              <a-space direction="vertical" style="width: 100%">
                <div 
                  v-for="(option, optIndex) in question.options" 
                  :key="optIndex"
                  style="display: flex; gap: 8px; align-items: center;"
                >
                  <!-- 统一使用 Checkbox，支持单选和多选 -->
                  <a-checkbox 
                    :checked="question.correctIndexes && question.correctIndexes.includes(optIndex)"
                    @change="(e) => toggleMultiAnswer(question, optIndex, e.target.checked)"
                  />
                  <span style="min-width: 24px; font-weight: bold; color: #1890ff;">
                    {{ String.fromCharCode(65 + optIndex) }}.
                  </span>
                  <a-input 
                    v-model:value="question.options[optIndex]"
                    placeholder="请输入选项内容"
                    style="flex: 1;"
                  />
                  <a-button 
                    danger 
                    size="small" 
                    @click="removeOption(question, optIndex)"
                    v-if="question.options.length > 2"
                  >
                    删除
                  </a-button>
                </div>
                <a-button 
                  type="dashed" 
                  size="small" 
                  @click="addOption(question)"
                  style="width: 100%;"
                >
                  <template #icon><PlusOutlined /></template>
                  添加选项
                </a-button>
              </a-space>
            </a-form-item>

            <a-form-item label="正确答案" v-if="question.type === 'fillBlank' || question.type === 'spelling'">
              <a-input 
                v-model:value="question.answer" 
                placeholder="请输入正确答案" 
              />
            </a-form-item>
          </div>
        </div>

        <!-- 添加题目按钮 -->
        <a-button type="dashed" block @click="addQuestion" style="margin-top: 16px">
          <template #icon><PlusOutlined /></template>
          添加题目
        </a-button>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { message } from 'ant-design-vue'
import PlusOutlined from '@ant-design/icons-vue/PlusOutlined'
import TeamOutlined from '@ant-design/icons-vue/TeamOutlined'
import CarryOutOutlined from '@ant-design/icons-vue/CarryOutOutlined'
import ClockCircleOutlined from '@ant-design/icons-vue/ClockCircleOutlined'
import { getClassOverview, getClassList, createClass, publishTaskWithQuestions } from '@/services/teacher/tmyClass'

// 统计数据
const statistics = reactive({
  totalStudents: 0,
  totalClasses: 0,
  avgCompletionRate: 0,
  pendingReviews: 0
})

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

// 班级列表
const classList = ref([])

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 100, // 一次获取100条
  total: 0
})

// 分页后的班级列表
const paginatedClasses = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredClasses.value.slice(start, end)
})

// 创建弹窗相关
const createModalVisible = ref(false)
const createLoading = ref(false)
const createFormRef = ref()

const createForm = reactive({
  level: undefined,
  name: '',
  taskCount: 60,
  maxStudents: 30
})

const createRules = {
  level: [{ required: true, message: '请选择班级等级', trigger: 'change' }],
  name: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  taskCount: [
    { required: true, message: '请输入任务完成数量', trigger: 'blur' },
    { type: 'number', min: 1, max: 100, message: '任务数量必须在1-100之间', trigger: 'blur' }
  ],
  maxStudents: [
    { required: true, message: '请输入班级限定人数', trigger: 'blur' },
    { type: 'number', min: 30, max: 50, message: '班级人数必须在30-50之间', trigger: 'blur' }
  ]
}

// 筛选后的班级列表
const filteredClasses = computed(() => {
  if (!filterLevel.value) {
    return classList.value
  }
  return classList.value.filter(item => item.level === filterLevel.value)
})

// 监听筛选等级变化，重新加载列表
watch(filterLevel, () => {
  // 重置分页
  pagination.value.current = 1
  // 列表数据已通过 computed 筛选，无需重新加载
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

// 显示创建弹窗
const showCreateModal = () => {
  createModalVisible.value = true
}

// 处理创建班级
const handleCreateClass = async () => {
  try {
    await createFormRef.value.validate()
    createLoading.value = true

    // 调用创建班级接口
    const res = await createClass({
      classLevel: createForm.level,
      className: createForm.name,
      taskRequirement: createForm.taskCount,
      maxStudents: createForm.maxStudents
    })

    if (res.code === 200) {
      message.success('班级创建成功')
      createModalVisible.value = false
      // 重置表单
      createFormRef.value.resetFields()
      // 刷新列表（静默失败，不影响用户体验）
      loadClassList()
      loadStatistics()
    } else {
      message.error(res.msg || '创建失败')
    }
  } catch (error) {
    console.log('表单验证失败:', error)
  } finally {
    createLoading.value = false
  }
}

// 取消创建
const handleCancelCreate = () => {
  createFormRef.value.resetFields()
}

// 发布任务相关
const publishTaskModalVisible = ref(false)
const publishTaskLoading = ref(false)
const publishTaskFormRef = ref()
const selectedClass = ref(null)

const publishTaskForm = reactive({
  taskName: '',
  taskType: undefined,
  startTime: null,
  deadline: null,
  questions: []
})

const publishTaskRules = {
  taskName: [{ required: true, message: '请输入任务名称', trigger: 'blur' }],
  taskType: [{ required: true, message: '请选择任务类型', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择任务开始时间', trigger: 'change' }],
  deadline: [
    { required: true, message: '请选择任务截止时间', trigger: 'change' },
    {
      validator: (rule, value) => {
        if (value && publishTaskForm.startTime && value <= publishTaskForm.startTime) {
          return Promise.reject('截止时间必须晚于开始时间')
        }
        return Promise.resolve()
      },
      trigger: 'change'
    }
  ]
}

// 显示发布任务弹窗
const showPublishTaskModal = (classItem) => {
  selectedClass.value = classItem
  publishTaskModalVisible.value = true
  // 初始化一个空题目
  publishTaskForm.questions = []
  addQuestion()
}

// 添加题目
const addQuestion = () => {
  publishTaskForm.questions.push({
    type: 'choice',
    content: '',
    answer: '',
    options: ['', '', '', ''],
    correctIndexes: [] // 存储正确答案的索引
  })
}

// 删除题目
const removeQuestion = (index) => {
  publishTaskForm.questions.splice(index, 1)
}

// 添加选项
const addOption = (question) => {
  question.options.push('')
}

// 删除选项
const removeOption = (question, optIndex) => {
  if (question.options.length > 2) {
    question.options.splice(optIndex, 1)
    // 同时更新正确答案索引
    if (question.correctIndexes) {
      question.correctIndexes = question.correctIndexes
        .filter(idx => idx !== optIndex)
        .map(idx => idx > optIndex ? idx - 1 : idx)
      
      // 更新 answer 字段
      question.correctIndexes.sort()
      question.answer = question.correctIndexes
        .map(idx => String.fromCharCode(65 + idx))
        .join(',')
    }
  }
}

// 切换答案选择（支持单选和多选）
const toggleMultiAnswer = (question, optIndex, checked) => {
  if (!question.correctIndexes) {
    question.correctIndexes = []
  }
  
  if (checked) {
    if (!question.correctIndexes.includes(optIndex)) {
      question.correctIndexes.push(optIndex)
    }
  } else {
    question.correctIndexes = question.correctIndexes.filter(idx => idx !== optIndex)
  }
  
  // 更新 answer 字段为字母组合
  question.correctIndexes.sort()
  question.answer = question.correctIndexes
    .map(idx => String.fromCharCode(65 + idx))
    .join(',')
}

// 题型变化处理
const handleQuestionTypeChange = (question) => {
  // 如果切换到选择题，确保有选项
  if (question.type === 'choice' && (!question.options || question.options.length === 0)) {
    question.options = ['', '', '', '']
    question.correctIndexes = []
  }
  // 如果切换到其他题型，清空选项
  if (question.type !== 'choice') {
    question.options = []
    question.correctIndexes = []
  }
  // 清空答案
  question.answer = ''
}

// 处理发布任务
const handlePublishTask = async () => {
  try {
    await publishTaskFormRef.value.validate()
    
    if (publishTaskForm.questions.length === 0) {
      message.warning('请至少添加一道题目')
      return
    }

    publishTaskLoading.value = true

    // 转换时间格式
    const startTime = publishTaskForm.startTime ? publishTaskForm.startTime.format('YYYY-MM-DD HH:mm:ss') : ''
    const endTime = publishTaskForm.deadline ? publishTaskForm.deadline.format('YYYY-MM-DD HH:mm:ss') : ''

    // 转换题目格式
    const formattedQuestions = publishTaskForm.questions.map(q => {
      let questionType = ''
      if (q.type === 'choice') questionType = '1'
      else if (q.type === 'spelling') questionType = '2'
      else if (q.type === 'fillBlank') questionType = '3'

      // 处理选择题选项
      let options = ''
      if (q.type === 'choice' && q.options && q.options.length > 0) {
        const optionsObj = {}
        q.options.forEach((opt, idx) => {
          optionsObj[String.fromCharCode(65 + idx)] = opt
        })
        options = JSON.stringify(optionsObj)
      }

      return {
        questionType,
        questionContent: q.content,
        options,
        correctAnswer: q.answer
      }
    })

    // 使用单一接口发布任务并添加题目
    const res = await publishTaskWithQuestions({
      taskName: publishTaskForm.taskName,
      classId: selectedClass.value.id,
      taskType: publishTaskForm.taskType,
      startTime,
      endTime,
      questions: formattedQuestions
    })

    if (res.code === 200) {
      message.success(`任务发布成功！共 ${formattedQuestions.length} 道题目`)
      publishTaskModalVisible.value = false

      // 重置表单
      publishTaskForm.taskName = ''
      publishTaskForm.taskType = undefined
      publishTaskForm.startTime = null
      publishTaskForm.deadline = null
      publishTaskForm.questions = []
    } else {
      message.error(res.msg || '任务发布失败')
    }
  } catch (error) {
    console.error('发布任务失败:', error)
    message.error('发布任务失败')
  } finally {
    publishTaskLoading.value = false
  }
}

// 取消发布任务
const handleCancelPublishTask = () => {
  publishTaskForm.taskName = ''
  publishTaskForm.taskType = undefined
  publishTaskForm.startTime = null
  publishTaskForm.deadline = null
  publishTaskForm.questions = []
}

// 处理筛选变化
const handleFilterChange = () => {
  // 筛选逻辑已通过 computed 实现
}

// 处理分页变化
const handlePageChange = (page, pageSize) => {
  pagination.value.current = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 加载统计数据
const loadStatistics = async () => {
  try {
    const overviewRes = await getClassOverview()
    if (overviewRes.code === 200 && overviewRes.data) {
      statistics.totalStudents = overviewRes.data.totalStudents || 0
      statistics.totalClasses = overviewRes.data.totalClasses || 0
      statistics.avgCompletionRate = overviewRes.data.avgCompletionRate || 0
      statistics.pendingReviews = overviewRes.data.pendingApplications || 0
    }
  } catch (error) {
    console.error('获取概览数据失败:', error)
  }
}

// 加载班级列表
const loadClassList = async () => {
  try {
    const listRes = await getClassList({
      classLevel: filterLevel.value || undefined,
      pageNum: 1, // 每次都从第一页开始
      pageSize: 100 // 一次获取100条
    })
    // 根据后端返回格式，数据直接在根层级
    if (listRes.code === 200 && listRes.rows) {
      // 映射接口字段到页面字段
      classList.value = listRes.rows.map(item => ({
        id: item.classId,
        name: item.className,
        level: item.classLevel,
        currentStudents: item.currentStudents,
        maxStudents: item.maxStudents,
        taskCount: item.taskCount,
        createTime: formatDate(item.createTime),
        pendingCount: item.pendingApplicationCount,
        auditStatus: item.auditStatus // 0-待审核 1-已通过 2-已拒绝
      }))
      pagination.total = listRes.total || 0
    }
  } catch (error) {
    console.error('获取班级列表失败:', error)
  }
}

// 加载所有数据
const loadData = async () => {
  await Promise.all([loadStatistics(), loadClassList()])
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

onMounted(() => {
  loadData()
})
</script>

<style scoped src="./my-classes.css"></style>
