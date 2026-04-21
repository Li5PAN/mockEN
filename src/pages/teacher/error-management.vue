<template>
  <div class="error-management-container">
    <!-- 顶部区域 -->
    <div class="top-section">
      <!-- 筛选和统计 -->
      <a-card>
        <a-row :gutter="16">
          <a-col :span="18">
            <a-space :size="16" wrap>
              <!-- 时间筛选 -->
              <a-space>
                <span>时间范围：</span>
                <a-range-picker 
                  v-model:value="filterDateRange" 
                  format="YYYY-MM-DD"
                  @change="handleFilterChange"
                />
              </a-space>

              <!-- 题目类型筛选 -->
              <a-space>
                <span>题目类型：</span>
                <a-select 
                  v-model:value="filterQuestionType" 
                  placeholder="全部类型" 
                  style="width: 150px"
                  @change="handleFilterChange"
                >
                  <a-select-option value="">全部类型</a-select-option>
                  <a-select-option value="1">选择题</a-select-option>
                  <a-select-option value="2">填空题</a-select-option>
                  <a-select-option value="3">单词拼写</a-select-option>
                </a-select>
              </a-space>

              <!-- 班级等级筛选 -->
              <a-space>
                <span>班级等级：</span>
                <a-select 
                  v-model:value="filterClassLevel" 
                  placeholder="全部等级" 
                  style="width: 150px"
                  @change="handleFilterChange"
                >
                  <a-select-option value="">全部等级</a-select-option>
                  <a-select-option value="A">A级</a-select-option>
                  <a-select-option value="B">B级</a-select-option>
                  <a-select-option value="C">C级</a-select-option>
                  <a-select-option value="D">D级</a-select-option>
                </a-select>
              </a-space>
              <a-button type="primary" @click="handleSearch">
                <template #icon><SearchOutlined /></template>
                搜索
              </a-button>
              <a-button @click="handleReset">
                <template #icon><ReloadOutlined /></template>
                重置
              </a-button>
            </a-space>
          </a-col>
          <a-col :span="6">
            <a-statistic 
              title="题目总数" 
              :value="errorList.length" 
              suffix="题"
              :value-style="{ color: '#cf1322' }"
            />
          </a-col>
        </a-row>
      </a-card>

      <!-- 操作按钮 -->
      <div class="action-bar">
        <a-space>
          <a-button type="primary" @click="showImportModal">
            <template #icon><UploadOutlined /></template>
            导入错题
          </a-button>
          <a-dropdown>
            <a-button>
              <template #icon><DownloadOutlined /></template>
              导出错题
              <DownOutlined />
            </a-button>
            <template #overlay>
              <a-menu @click="handleExport">
                <a-menu-item key="excel-all">导出全部（Excel）</a-menu-item>
                <a-menu-item key="pdf-all">导出全部（PDF）</a-menu-item>
                <a-menu-item key="excel-filtered">导出筛选结果（Excel）</a-menu-item>
                <a-menu-item key="pdf-filtered">导出筛选结果（PDF）</a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-button 
            danger 
            :disabled="selectedRowKeys.length === 0"
            @click="showBatchDeleteConfirm"
          >
            <template #icon><DeleteOutlined /></template>
            批量删除
            <a-badge 
              v-if="selectedRowKeys.length > 0" 
              :count="selectedRowKeys.length" 
              :number-style="{ backgroundColor: '#ff4d4f' }"
            />
          </a-button>
        </a-space>
      </div>
    </div>

    <!-- 错题列表 -->
    <a-card style="margin-top: 16px;">
      <a-table 
        :columns="columns" 
        :data-source="errorList" 
        :loading="loading"
        :row-selection="rowSelection"
        :pagination="{ pageSize: 10 }"
        :row-key="record => record.questionId"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'questionType'">
            <a-tag :color="getQuestionTypeColor(record.questionType)">
              {{ getQuestionTypeLabel(record.questionType) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'classLevel'">
            <a-tag :color="getLevelColor(record.classLevel)">
              {{ record.classLevel }}级
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="viewErrorDetail(record)">
                查看详情
              </a-button>
              <a-button type="link" size="small" @click="deleteErrorItem(record)">
                删除
              </a-button>
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
      @cancel="handleCancelImport"
      width="600px"
    >
      <a-space direction="vertical" style="width: 100%">
        <a-alert 
          message="仅支持 Excel 格式文件（.xlsx, .xls）" 
          type="info" 
          show-icon 
        />
        
        <div style="margin: 12px 0;">
          <a 
            @click.prevent="handleDownloadTemplate"
            style="color: #1890ff; cursor: pointer; text-decoration: none;"
          >
            点击下载错题模板
          </a>
        </div>
        
        <a-upload-dragger
          v-model:file-list="fileList"
          accept=".xlsx,.xls"
          :max-count="1"
          :before-upload="beforeUpload"
          :show-upload-list="true"
          name="file"
        >
          <p class="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
          <p class="ant-upload-hint">
            仅支持 Excel 格式文件（.xlsx, .xls）
          </p>
        </a-upload-dragger>

        <a-divider />

        <div>
          <p><strong>Excel 文件格式要求：</strong></p>
          <ul>
            <li>第一列：题目内容</li>
            <li>第二列：题目类型（选择题/填空题/单词拼写）</li>
            <li>第三列：正确答案</li>
            <li>第四列：班级等级（A/B/C/D）</li>
            <li>第五列：错误次数</li>
          </ul>
        </div>
      </a-space>
    </a-modal>

    <!-- 错题详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="题目详情"
      :footer="null"
      width="800px"
    >
      <div v-if="selectedError" class="error-detail">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="题目内容">
            {{ selectedError.questionContent }}
          </a-descriptions-item>
          <a-descriptions-item label="题目类型">
            <a-tag :color="getQuestionTypeColor(selectedError.questionType)">
              {{ getQuestionTypeLabel(selectedError.questionType) }}
            </a-tag>
          </a-descriptions-item>
          
          <!-- 选择题显示选项和正确答案 -->
          <a-descriptions-item label="选项" v-if="selectedError.questionType === '1' && selectedError.options">
            <div class="options-detail">
              <div 
                v-for="optionItem in parseOptions(selectedError.options).slice(0, 15)" 
                :key="optionItem[0]"
                class="option-detail-item"
              >
                <span :class="{ 'correct-option': selectedError.correctAnswer && selectedError.correctAnswer.includes(optionItem[0]) }">
                  {{ optionItem[0] }}. {{ optionItem[1] }}
                  <a-tag 
                    v-if="selectedError.correctAnswer && selectedError.correctAnswer.includes(optionItem[0])" 
                    color="success" 
                    size="small"
                    style="margin-left: 8px;"
                  >
                    正确答案
                  </a-tag>
                </span>
              </div>
            </div>
          </a-descriptions-item>
          
          <!-- 非选择题显示正确答案 -->
          <a-descriptions-item label="正确答案" v-else>
            <a-tag color="success">{{ selectedError.correctAnswer }}</a-tag>
          </a-descriptions-item>
          
          <a-descriptions-item label="错误次数">
            <span style="color: #cf1322; font-weight: bold;">{{ selectedError.wrongCount }} 次</span>
          </a-descriptions-item>
          <a-descriptions-item label="任务名称">
            {{ selectedError.taskName }}
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            {{ selectedError.createTime }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import UploadOutlined from '@ant-design/icons-vue/UploadOutlined'
import DownloadOutlined from '@ant-design/icons-vue/DownloadOutlined'
import DeleteOutlined from '@ant-design/icons-vue/DeleteOutlined'
import DownOutlined from '@ant-design/icons-vue/DownOutlined'
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined'
import ReloadOutlined from '@ant-design/icons-vue/ReloadOutlined'
import InboxOutlined from '@ant-design/icons-vue/InboxOutlined'
import {
  getErrorList,
  getErrorDetail,
  importError,
  exportError,
  batchDeleteErrors,
  downloadErrorTemplate
} from '@/services/teacher/ttmyerror'
import { Modal } from 'ant-design-vue'

// 筛选条件
const filterDateRange = ref(null)
const filterQuestionType = ref('')
const filterClassLevel = ref('')

// 错题列表
const errorList = ref([])
const loading = ref(false)

// 选中的行
const selectedRowKeys = ref([])
const selectedRows = ref([])

// 导入弹窗
const importModalVisible = ref(false)
const fileList = ref([])
const uploadFile = ref(null) // 存储原始文件对象

// 详情弹窗
const detailModalVisible = ref(false)
const selectedError = ref(null)

// 表格列定义
const columns = [
  {
    title: '题目ID',
    dataIndex: 'questionId',
    key: 'questionId',
    width: 100
  },
  {
    title: '题目类型',
    dataIndex: 'questionType',
    key: 'questionType',
    width: 120
  },
  {
    title: '错误次数',
    dataIndex: 'wrongCount',
    key: 'wrongCount',
    width: 100,
    sorter: (a, b) => a.wrongCount - b.wrongCount
  },
  {
    title: '任务名称',
    dataIndex: 'taskName',
    key: 'taskName',
    ellipsis: true,
    width: 150
  },
  {
    title: '班级等级',
    dataIndex: 'classLevel',
    key: 'classLevel',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]

// 行选择配置
const rowSelection = {
  selectedRowKeys: selectedRowKeys,
  onChange: (keys, rows) => {
    selectedRowKeys.value = keys
    selectedRows.value = rows
  }
}

// 筛选后的错题列表（后端筛选，无需前端计算）
const filteredErrors = computed(() => {
  return errorList.value
})

// 获取题型颜色
const getQuestionTypeColor = (type) => {
  const colorMap = {
    '1': 'blue',
    '2': 'green',
    '3': 'orange'
  }
  return colorMap[type] || 'default'
}

// 获取题型标签
const getQuestionTypeLabel = (type) => {
  const typeMap = {
    '1': '选择题',
    '2': '填空题',
    '3': '单词拼写'
  }
  return typeMap[type] || '未知'
}

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

// 解析选项（兼容数组和对象格式）
const parseOptions = (options) => {
  try {
    const parsed = JSON.parse(options)
    // 如果是数组，直接返回
    if (Array.isArray(parsed)) {
      return parsed
    }
    // 如果是对象，转成数组格式
    if (typeof parsed === 'object') {
      return Object.entries(parsed)
    }
    return []
  } catch {
    return []
  }
}

// 处理筛选变化
const handleFilterChange = () => {
  // 筛选逻辑已通过 computed 实现
}

// 搜索
const handleSearch = () => {
  loadData()
}

// 重置
const handleReset = () => {
  filterDateRange.value = null
  filterQuestionType.value = ''
  filterClassLevel.value = ''
  loadData()
}

// 显示导入弹窗
const showImportModal = () => {
  importModalVisible.value = true
}

// 下载错题模板
const handleDownloadTemplate = async () => {
  try {
    message.loading({ content: '正在下载模板...', key: 'downloadTemplate' })
    const response = await downloadErrorTemplate()
    const blob = response.data
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', '错题导入模板.xlsx')
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
    message.success({ content: '模板下载成功', key: 'downloadTemplate' })
  } catch (error) {
    console.error('模板下载失败:', error)
    message.error({ content: '模板下载失败', key: 'downloadTemplate' })
  }
}

// 文件上传前验证
const beforeUpload = (file) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                  file.type === 'application/vnd.ms-excel'
  if (!isExcel) {
    message.error('只能上传 Excel 文件！')
    return false
  }
  
  // 保存文件对象
  uploadFile.value = file
  fileList.value = [file]
  
  // 返回 false 阻止自动上传
  return false
}

// 删除文件
const handleRemove = () => {
  fileList.value = []
  uploadFile.value = null
  return true
}

// 处理导入
const handleImport = async () => {
  if (fileList.value.length === 0) {
    message.warning('请选择要导入的文件')
    return
  }
  
  // 使用单独存储的文件对象
  const fileObj = uploadFile.value
  
  if (!fileObj) {
    message.error('文件格式错误，请重新选择')
    return
  }
  
  const formData = new FormData()
  formData.append('file', fileObj)
  
  try {
    loading.value = true
    await importError(formData)
    message.success('错题导入成功！')
    importModalVisible.value = false
    fileList.value = []
    uploadFile.value = null

    // 重新加载数据
    loadData()
  } catch (error) {
    console.error('导入失败:', error)
    message.error('导入失败，请重试')
  } finally {
    loading.value = false
  }
}

// 取消导入
const handleCancelImport = () => {
  fileList.value = []
  uploadFile.value = null
}

// 处理导出
const handleExport = async ({ key }) => {
  // 判断是否为全部导出还是筛选导出
  const isAll = key === 'excel-all' || key === 'pdf-all'
  const exportType = key.includes('excel') ? 'excel' : 'pdf'

  // 显示加载提示
  message.loading({ content: '正在导出...', key: 'export' })
  try {
    // 构建导出参数
    const params = {
      format: exportType,
      scope: isAll ? 'all' : 'filtered'
    }

    // 如果是筛选导出，添加筛选条件
    if (!isAll) {
      params.questionIds = selectedRowKeys.value.join(',')
      if (filterDateRange.value && filterDateRange.value.length === 2) {
        params.startDate = filterDateRange.value[0].format('YYYY-MM-DD')
        params.endDate = filterDateRange.value[1].format('YYYY-MM-DD')
      }
      if (filterQuestionType.value) {
        params.questionType = filterQuestionType.value
      }
      if (filterClassLevel.value) {
        params.classLevel = filterClassLevel.value
      }
    }

    // 调用导出接口
    const response = await exportError(params)
    const blob = response.data
    // 创建下载链接
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    // 生成文件名
    const fileName = isAll
      ? `错题全部导出_${new Date().getTime()}.${exportType}`
      : `错题筛选导出_${new Date().getTime()}.${exportType}`

    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()

    // 清理
    link.parentNode.removeChild(link) // 删除链接节点
    window.URL.revokeObjectURL(url) // 释放URL对象

    message.success({ content: '导出成功', key: 'export' })
  } catch (error) {
    console.error('导出失败:', error)
    message.error({ content: '导出失败，请重试', key: 'export' })
  }
}

// 显示批量删除确认框
const showBatchDeleteConfirm = () => {
  if (selectedRowKeys.value.length === 0) {
    message.warning('请先选择要删除的题目')
    return
  }
  
  Modal.confirm({
    title: '确认批量删除',
    content: `确定要删除选中的 ${selectedRowKeys.value.length} 道题目吗？此操作不可恢复。`,
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      await handleBatchDelete()
    }
  })
}

// 执行批量删除
const handleBatchDelete = async () => {
  try {
    loading.value = true
    const res = await batchDeleteErrors(selectedRowKeys.value)

    if (res.code === 200) {
      message.success(res.msg || `成功删除 ${selectedRowKeys.value.length} 道题目`)
      // 清空选择
      selectedRowKeys.value = []
      selectedRows.value = []
      // 重新加载数据
      await loadData()
    } else {
      message.error(res.msg || '删除失败')
    }
  } catch (error) {
    console.error('删除失败:', error)
    message.error('删除失败，请重试')
  } finally {
    loading.value = false
  }
}

// 查看错题详情
const viewErrorDetail = async (record) => {
  loading.value = true
  try {
    const res = await getErrorDetail(record.questionId)
    if (res.code === 200) {
      selectedError.value = res.data
      detailModalVisible.value = true
    } else {
      message.error(res.msg || '获取题目详情失败')
    }
  } catch (error) {
    console.error('获取题目详情失败:', error)
    message.error('获取题目详情失败')
  } finally {
    loading.value = false
  }
}

// 删除错题（单个）
const deleteErrorItem = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除这道错题吗？此操作不可恢复。`,
    okText: '确认删除',
    okType: 'danger',
    cancelText: '取消',
    async onOk() {
      try {
        loading.value = true
        const res = await batchDeleteErrors([record.questionId])

        if (res.code === 200) {
          message.success(res.msg || '删除成功')
          // 从列表中移除
          errorList.value = errorList.value.filter(item => item.questionId !== record.questionId)
          // 重新加载数据
          await loadData()
        } else {
          message.error(res.msg || '删除失败')
        }
      } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 构建查询参数
    const params = {}

    // 时间范围
    if (filterDateRange.value && filterDateRange.value.length === 2) {
      const [start, end] = filterDateRange.value
      params.startDate = start.format('YYYY-MM-DD')
      params.endDate = end.format('YYYY-MM-DD')
    }

    // 题目类型
    if (filterQuestionType.value) {
      params.questionType = filterQuestionType.value
    }

    // 班级等级
    if (filterClassLevel.value) {
      params.classLevel = filterClassLevel.value
    }

    const res = await getErrorList(params)
    if (res.code === 200) {
      errorList.value = res.rows || []
    } else {
      message.error(res.msg || '获取题目列表失败')
    }
  } catch (error) {
    console.error('获取题目列表失败:', error)
    message.error('获取题目列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped src="./error-management.css"></style>
