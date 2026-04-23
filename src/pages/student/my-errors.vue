<template>
  <div class="my-errors-container">
    <a-card>
      <template #title>
        <div class="card-title-wrapper">
          <span class="title-text">我的错题</span>
          <a-space :size="8" class="title-buttons">
            <a-button type="primary" @click="showImportModal">
              <UploadOutlined /> 导入错题
            </a-button>
            <a-dropdown>
              <template #overlay>
                <a-menu @click="handleExport">
                  <a-menu-item key="excel">
                    <FileExcelOutlined /> 导出为 Excel
                  </a-menu-item>
                  <a-menu-item key="pdf">
                    <FilePdfOutlined /> 导出为 PDF
                  </a-menu-item>
                </a-menu>
              </template>
              <a-button>
                <DownloadOutlined /> 导出错题
                <DownOutlined />
              </a-button>
            </a-dropdown>
          </a-space>
        </div>
      </template>

      <!-- 筛选区域 -->
      <div class="filter-section">
        <a-space size="middle" wrap>
          <a-select
            v-model:value="filterType"
            placeholder="题目类型"
            style="width: 150px"
            allowClear
          >
            <a-select-option value="">全部类型</a-select-option>
            <a-select-option value="1">选择题</a-select-option>
            <a-select-option value="2">单词拼写</a-select-option>
            <a-select-option value="3">填空题</a-select-option>
          </a-select>

          <a-range-picker
            v-model:value="filterDateRange"
            format="YYYY-MM-DD"
            placeholder="['开始日期', '结束日期']"
            style="width: 280px"
          />

          <a-button type="primary" @click="applyFilter">
            <SearchOutlined /> 筛选
          </a-button>
          <a-button danger @click="batchDelete" :disabled="selectedRowKeys.length === 0">
            <DeleteOutlined /> 批量删除{{ selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : '' }}
          </a-button>
          <a-button @click="resetFilter">
            <ReloadOutlined /> 重置
          </a-button>
        </a-space>
      </div>

      <!-- 错题列表 -->
      <a-table
        :columns="columns"
        :data-source="errorList"
        :loading="loading"
        :row-selection="rowSelection"
        :row-key="record => record.wrongId"
        :pagination="pagination"
        :scroll="{ x: 1400 }"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'questionContent'">
            <div class="question-cell">
              {{ record.questionContent }}
            </div>
          </template>
          <template v-if="column.key === 'questionType'">
            <a-tag :color="getQuestionTypeColor(record.questionType)">
              {{ getQuestionTypeText(record.questionType) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'isMastered'">
            <a-tag :color="record.isMastered === '1' ? 'success' : 'warning'">
              {{ record.isMastered === '1' ? '已掌握' : '未掌握' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewDetail(record)">
                详情
              </a-button>
              <a-popconfirm
                title="确定要删除这道错题吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="deleteError(record)"
              >
                <a-button type="link" danger size="small">
                  删除
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 导入错题弹窗 -->
    <a-modal
      v-model:open="importModalVisible"
      title="导入错题"
      @ok="handleImport"
      @cancel="importModalVisible = false"
      :confirmLoading="importLoading"
    >
      <div class="import-modal-content">
        <a-button
          type="link"
          class="download-template-btn"
          @click="handleDownloadTemplate"
        >
          <DownloadOutlined /> 下载导入模板
        </a-button>
        <a-upload-dragger
          v-model:fileList="fileList"
          :before-upload="beforeUpload"
          accept=".xlsx,.xls"
          :max-count="1"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p class="ant-upload-hint">
            仅支持 Excel 格式文件（.xlsx, .xls）
          </p>
        </a-upload-dragger>
      </div>
    </a-modal>

    <!-- 错题详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="错题详情"
      width="800px"
      :footer="null"
    >
      <div v-if="currentError" class="error-detail">
        <a-descriptions bordered :column="2">
          <a-descriptions-item label="题目类型">
            <a-tag :color="getQuestionTypeColor(currentError.questionType)">
              {{ getQuestionTypeText(currentError.questionType) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="所属任务">{{ currentError.taskName }}</a-descriptions-item>
          <a-descriptions-item label="错误日期" :span="2">{{ currentError.wrongDate }}</a-descriptions-item>
        </a-descriptions>

        <a-divider>题目内容</a-divider>
        <div class="question-content">
          <p><strong>题目：</strong>{{ currentError.questionContent }}</p>
        </div>

        <!-- 选择题选项展示 -->
        <div v-if="currentError.questionType === '1' && parsedOptions.length > 0" class="options-section">
          <a-divider>选项内容</a-divider>
          <div
            v-for="opt in parsedOptions"
            :key="opt.key"
            class="option-item"
            :class="{
              'correct-option': isOptionCorrect(opt.key),
              'wrong-option': isOptionUserAnswer(opt.key) && !isOptionCorrect(opt.key)
            }"
          >
            <span class="option-key">{{ opt.key }}.</span>
            <span class="option-value">{{ opt.value }}</span>
            <span v-if="isOptionCorrect(opt.key)" class="option-badge correct-badge">正确答案</span>
            <span v-if="isOptionUserAnswer(opt.key) && !isOptionCorrect(opt.key)" class="option-badge wrong-badge">您的答案</span>
          </div>
        </div>

        <div class="answer-section">
          <p><strong>正确答案：</strong><span class="correct-text">{{ currentError.questionType === '1' ? formatAnswer(currentError.correctAnswer) : currentError.correctAnswer }}</span></p>
          <p><strong>您的答案：</strong><span class="wrong-text">{{ currentError.questionType === '1' ? formatUserAnswer(currentError.userAnswer) : currentError.userAnswer }}</span></p>
        </div>

        <!-- <a-divider>题目解析</a-divider>
        <div class="explanation-section">
          <p>{{ currentError.explanation || '暂无解析' }}</p>
        </div> -->
      </div>
    </a-modal>

    <!-- 编辑错题弹窗 -->
    <a-modal
      v-model:open="editModalVisible"
      title="编辑错题"
      @ok="saveEdit"
      @cancel="editModalVisible = false"
      width="700px"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="题目内容">
          <a-textarea v-model:value="editForm.question" :rows="3" />
        </a-form-item>
        <a-form-item label="题目类型">
          <a-select v-model:value="editForm.questionType">
            <a-select-option value="1">选择题</a-select-option>
            <a-select-option value="2">单词拼写</a-select-option>
            <a-select-option value="3">填空题</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="正确答案">
          <a-input v-model:value="editForm.correctAnswer" />
        </a-form-item>
        <a-form-item label="解析">
          <a-textarea v-model:value="editForm.explanation" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  getErrorList,
  getErrorDetail,
  deleteError as deleteErrorApi,
  batchDeleteErrors,
  importErrors,
  exportErrorsBlob,
  downloadTemplateBlob,
  updateError
} from '@/services/student/smyerror.js'
import {
  UploadOutlined,
  DownloadOutlined,
  DownOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  SearchOutlined,
  ReloadOutlined,
  InboxOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

// 表格列配置
const columns = [
  { title: '题目内容', dataIndex: 'questionContent', key: 'questionContent', width: 350, ellipsis: true },
  { title: '题目类型', dataIndex: 'questionType', key: 'questionType', width: 100 },
  { title: '正确答案', dataIndex: 'correctAnswer', key: 'correctAnswer', width: 120, ellipsis: true },
  { title: '您的答案', dataIndex: 'userAnswer', key: 'userAnswer', width: 120, ellipsis: true },
  { title: '所属任务', dataIndex: 'taskName', key: 'taskName', width: 150, ellipsis: true },
  { title: '错误日期', dataIndex: 'wrongDate', key: 'wrongDate', width: 120 },
  { title: '掌握状态', dataIndex: 'isMastered', key: 'isMastered', width: 100 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' },
]

// 错题数据列表
const errorList = ref([])
const loading = ref(false)
const total = ref(0)

// 分页配置
const pagination = computed(() => ({
  pageSize: 10,
  showSizeChanger: true,
  showTotal: (total) => `共 ${total} 条`,
  current: current.value,
  total: total.value
}))

const current = ref(1)
const pageSize = ref(10)

// 筛选条件
const filterType = ref('')
const filterDateRange = ref(null)

// 加载错题列表
const loadErrorList = async () => {
  loading.value = true
  try {
    const params = {
      pageNum: current.value,
      pageSize: pageSize.value
    }
    if (filterType.value) {
      params.questionType = filterType.value
    }
    if (filterDateRange.value && filterDateRange.value.length === 2) {
      params.startDate = filterDateRange.value[0].format('YYYY-MM-DD')
      params.endDate = filterDateRange.value[1].format('YYYY-MM-DD')
    }
    const res = await getErrorList(params)
    if (res.code === 200) {
      errorList.value = res.rows || []
      total.value = res.total || 0
    }
  } catch (error) {
    console.error('加载错题列表失败:', error)
    message.error('加载错题列表失败')
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadErrorList()
})

// 应用筛选
const applyFilter = () => {
  current.value = 1
  loadErrorList()
}

// 重置筛选
const resetFilter = () => {
  filterType.value = ''
  filterDateRange.value = null
  current.value = 1
  loadErrorList()
}

// 分页变化处理
const handleTableChange = (pag) => {
  current.value = pag.current
  pageSize.value = pag.pageSize
  loadErrorList()
}

// 获取题目类型文本
const getQuestionTypeText = (type) => {
  const typeMap = {
    '1': '选择题',
    '2': '单词拼写',
    '3': '填空题'
  }
  return typeMap[type] || type
}

// 题目类型颜色
const getQuestionTypeColor = (type) => {
  const colors = {
    '1': 'blue',
    '2': 'green',
    '3': 'orange'
  }
  return colors[type] || 'default'
}

// 行选择
const selectedRowKeys = ref([])

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys) => {
    selectedRowKeys.value = keys
  },
}))

// 批量删除
const batchDelete = async () => {
  if (selectedRowKeys.value.length === 0) {
    return
  }
  try {
    const res = await batchDeleteErrors(selectedRowKeys.value)
    if (res.code === 200) {
      message.success(`已删除 ${selectedRowKeys.value.length} 条错题`)
      selectedRowKeys.value = []
      loadErrorList()
    } else {
      message.error(res.msg || '批量删除失败')
    }
  } catch (error) {
    console.error('批量删除错题失败:', error)
    message.error('批量删除错题失败')
  }
}

// 删除单个错题
const deleteError = async (record) => {
  try {
    const res = await deleteErrorApi(record.wrongId)
    if (res.code === 200) {
      message.success('删除成功')
      loadErrorList()
    } else {
      message.error(res.msg || '删除失败')
    }
  } catch (error) {
    console.error('删除错题失败:', error)
    message.error('删除错题失败')
  }
}

// 导入相关
const importModalVisible = ref(false)
const fileList = ref([])
const importLoading = ref(false)

const showImportModal = () => {
  importModalVisible.value = true
}

const beforeUpload = (file) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                  file.type === 'application/vnd.ms-excel'
  if (!isExcel) {
    message.error('只能上传 Excel 文件！')
  }
  return false
}

const handleImport = async () => {
  if (fileList.value.length === 0) {
    message.warning('请先选择文件')
    return
  }
  
  importLoading.value = true
  try {
    const formData = new FormData()
    formData.append('file', fileList.value[0].originFileObj)
    
    const res = await importErrors(formData)
    if (res.code === 200) {
      message.success(res.msg || '导入成功！')
      importModalVisible.value = false
      fileList.value = []
      loadErrorList()
    } else {
      message.error(res.msg || '导入失败')
    }
  } catch (error) {
    console.error('导入错题失败:', error)
    message.error('导入错题失败')
  } finally {
    importLoading.value = false
  }
}

// 下载导入模板（处理文件流）
const handleDownloadTemplate = async () => {
  try {
    const response = await downloadTemplateBlob()
    // response.data 是 blob
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'student_error_template.xlsx'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    message.success('模板下载成功！')
  } catch (error) {
    console.error('下载模板失败:', error)
    message.error('下载模板失败')
  }
}

// 导出相关（处理文件流）
const handleExport = async ({ key }) => {
  const format = key === 'excel' ? 'excel' : 'pdf'
  const filename = format === 'excel' ? 'error_export.xlsx' : 'error_export.pdf'

  try {
    message.loading({ content: `正在导出为 ${format === 'excel' ? 'Excel' : 'PDF'} 格式...`, key: 'exportWrong' })

    const response = await exportErrorsBlob(format)
    // response.data 是 blob
    const mimeType = format === 'excel'
      ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      : 'application/pdf'
    const blob = new Blob([response.data], { type: mimeType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    message.success({ content: '导出成功！', key: 'exportWrong' })
  } catch (error) {
    console.error('导出错题失败:', error)
    message.error({ content: '导出失败，请重试', key: 'exportWrong' })
  }
}

// 详情查看
const detailModalVisible = ref(false)
const currentError = ref(null)

// 解析选项列表
const parsedOptions = computed(() => {
  if (!currentError.value || !currentError.value.options) return []
  try {
    if (typeof currentError.value.options === 'string') {
      return JSON.parse(currentError.value.options)
    }
    return currentError.value.options
  } catch {
    return []
  }
})

// 判断选项是否被选中（正确答案或用户答案）
const isOptionCorrect = (key) => {
  if (!currentError.value || !currentError.value.correctAnswer) return false
  try {
    const correct = JSON.parse(currentError.value.correctAnswer)
    return Array.isArray(correct) ? correct.includes(key) : false
  } catch {
    return currentError.value.correctAnswer === key
  }
}

const isOptionUserAnswer = (key) => {
  if (!currentError.value || !currentError.value.userAnswer) return false
  try {
    const user = JSON.parse(currentError.value.userAnswer)
    return Array.isArray(user) ? user.includes(key) : false
  } catch {
    return currentError.value.userAnswer === key
  }
}

// 格式化答案文本（将选项 key 替换为 "key. 内容" 形式）
const formatAnswer = (answer) => {
  if (!answer) return '无'
  try {
    const keys = JSON.parse(answer)
    if (!Array.isArray(keys)) return answer
    const opts = parsedOptions.value
    return keys.map(k => {
      const opt = opts.find(o => o.key === k)
      return opt ? `${k}. ${opt.value}` : k
    }).join('；')
  } catch {
    const opts = parsedOptions.value
    const opt = opts.find(o => o.key === answer)
    return opt ? `${answer}. ${opt.value}` : answer
  }
}

// 格式化用户答案文本
const formatUserAnswer = (answer) => {
  if (!answer) return '无'
  try {
    const keys = JSON.parse(answer)
    if (!Array.isArray(keys)) return answer
    const opts = parsedOptions.value
    return keys.map(k => {
      const opt = opts.find(o => o.key === k)
      return opt ? `${k}. ${opt.value}` : k
    }).join('；')
  } catch {
    const opts = parsedOptions.value
    const opt = opts.find(o => o.key === answer)
    return opt ? `${answer}. ${opt.value}` : answer
  }
}

const viewDetail = async (record) => {
  loading.value = true
  try {
    const res = await getErrorDetail(record.wrongId)
    if (res.code === 200 && res.data) {
      currentError.value = res.data
      detailModalVisible.value = true
    } else {
      message.error(res.msg || '获取错题详情失败')
    }
  } catch (error) {
    console.error('获取错题详情失败:', error)
    message.error('获取错题详情失败')
  } finally {
    loading.value = false
  }
}

// 编辑错题
const editModalVisible = ref(false)
const editForm = ref({
  wrongId: null,
  question: '',
  questionType: '',
  correctAnswer: '',
  explanation: '',
})

const editError = (record) => {
  editForm.value = {
    wrongId: record.wrongId,
    question: record.questionContent,
    questionType: record.questionType,
    correctAnswer: record.correctAnswer,
    explanation: record.explanation || '',
  }
  editModalVisible.value = true
}

const saveEdit = async () => {
  if (!editForm.value.wrongId) {
    message.error('缺少错题ID')
    return
  }
  
  try {
    const data = {
      questionContent: editForm.value.question,
      questionType: editForm.value.questionType,
      correctAnswer: editForm.value.correctAnswer,
      explanation: editForm.value.explanation,
    }
    
    const res = await updateError(editForm.value.wrongId, data)
    if (res.code === 200) {
      message.success('编辑成功')
      editModalVisible.value = false
      loadErrorList()
    } else {
      message.error(res.msg || '编辑失败')
    }
  } catch (error) {
    console.error('编辑错题失败:', error)
    message.error('编辑错题失败')
  }
}
</script>

<style scoped src="./my-errors.css"></style>
