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
                  <a-select-option value="choice">选择题</a-select-option>
                  <a-select-option value="fillBlank">填空题</a-select-option>
                  <a-select-option value="spelling">单词拼写</a-select-option>
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
              <a-button>搜索</a-button>
              <a-button>重置</a-button>
            </a-space>
          </a-col>
          <a-col :span="6">
            <a-statistic 
              title="错题总数" 
              :value="filteredErrors.length" 
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
        </a-space>
      </div>
    </div>

    <!-- 错题列表 -->
    <a-card style="margin-top: 16px;">
      <a-table 
        :columns="columns" 
        :data-source="filteredErrors" 
        :row-selection="rowSelection"
        :pagination="{ pageSize: 10 }"
        :row-key="record => record.id"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'question'">
            <div class="question-cell">
              <div class="question-content">{{ record.question }}</div>
              <!-- 选择题显示选项 -->
              <div v-if="record.questionType === 'choice' && record.options" class="options-preview">
                <div 
                  v-for="(option, index) in record.options" 
                  :key="index"
                  class="option-preview-item"
                >
                  <span>{{ String.fromCharCode(65 + index) }}. {{ option }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'questionType'">
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
        
        <a-upload
          v-model:file-list="fileList"
          :before-upload="beforeUpload"
          accept=".xlsx,.xls"
          :max-count="1"
        >
          <a-button>
            <template #icon><UploadOutlined /></template>
            选择文件
          </a-button>
        </a-upload>

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
      title="错题详情"
      :footer="null"
      width="800px"
    >
      <div v-if="selectedError" class="error-detail">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="题目内容">
            {{ selectedError.question }}
          </a-descriptions-item>
          <a-descriptions-item label="题目类型">
            <a-tag :color="getQuestionTypeColor(selectedError.questionType)">
              {{ getQuestionTypeLabel(selectedError.questionType) }}
            </a-tag>
          </a-descriptions-item>
          
          <!-- 选择题显示选项和正确答案 -->
          <a-descriptions-item label="选项" v-if="selectedError.questionType === 'choice' && selectedError.options">
            <div class="options-detail">
              <div 
                v-for="(option, index) in selectedError.options" 
                :key="index"
                class="option-detail-item"
              >
                <span :class="{ 'correct-option': selectedError.correctIndexes && selectedError.correctIndexes.includes(index) }">
                  {{ String.fromCharCode(65 + index) }}. {{ option }}
                  <a-tag 
                    v-if="selectedError.correctIndexes && selectedError.correctIndexes.includes(index)" 
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
            <span style="color: #cf1322; font-weight: bold;">{{ selectedError.errorCount }} 次</span>
          </a-descriptions-item>
          <a-descriptions-item label="任务名称">
            <a-tag :color="getLevelColor(selectedError.classLevel)">
              {{ selectedError.classLevel }}级
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="创建时间">
            {{ selectedError.lastErrorTime }}
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
import DownOutlined from '@ant-design/icons-vue/DownOutlined'

// 筛选条件
const filterDateRange = ref(null)
const filterQuestionType = ref('')
const filterClassLevel = ref('')

// 错题列表
const errorList = ref([])

// 选中的行
const selectedRowKeys = ref([])

// 导入弹窗
const importModalVisible = ref(false)
const fileList = ref([])

// 详情弹窗
const detailModalVisible = ref(false)
const selectedError = ref(null)

// 表格列定义
const columns = [
  {
    title: '题目内容',
    dataIndex: 'question',
    key: 'question',
    ellipsis: true,
    width: 300
  },
  {
    title: '题目类型',
    dataIndex: 'questionType',
    key: 'questionType',
    width: 120
  },
  {
    title: '错误次数',
    dataIndex: 'errorCount',
    key: 'errorCount',
    width: 100,
    sorter: (a, b) => a.errorCount - b.errorCount
  },
  {
    title: '任务名称',
    dataIndex: 'classLevel',
    key: 'classLevel',
    width: 100
  },
  {
    title: '创建时间',
    dataIndex: 'lastErrorTime',
    key: 'lastErrorTime',
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
  onChange: (keys) => {
    selectedRowKeys.value = keys
  }
}

// 筛选后的错题列表
const filteredErrors = computed(() => {
  let result = errorList.value

  // 时间筛选
  if (filterDateRange.value && filterDateRange.value.length === 2) {
    const [start, end] = filterDateRange.value
    result = result.filter(item => {
      const itemDate = new Date(item.lastErrorTime)
      return itemDate >= start && itemDate <= end
    })
  }

  // 题目类型筛选
  if (filterQuestionType.value) {
    result = result.filter(item => item.questionType === filterQuestionType.value)
  }

  // 班级等级筛选
  if (filterClassLevel.value) {
    result = result.filter(item => item.classLevel === filterClassLevel.value)
  }

  return result
})

// 获取题型颜色
const getQuestionTypeColor = (type) => {
  const colorMap = {
    choice: 'blue',
    fillBlank: 'green',
    spelling: 'orange'
  }
  return colorMap[type] || 'default'
}

// 获取题型标签
const getQuestionTypeLabel = (type) => {
  const typeMap = {
    choice: '选择题',
    fillBlank: '填空题',
    spelling: '单词拼写'
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

// 处理筛选变化
const handleFilterChange = () => {
  // 筛选逻辑已通过 computed 实现
}

// 显示导入弹窗
const showImportModal = () => {
  importModalVisible.value = true
}

// 文件上传前验证
const beforeUpload = (file) => {
  const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                  file.type === 'application/vnd.ms-excel'
  if (!isExcel) {
    message.error('只能上传 Excel 文件！')
  }
  return false // 阻止自动上传
}

// 处理导入
const handleImport = () => {
  if (fileList.value.length === 0) {
    message.warning('请选择要导入的文件')
    return
  }

  // 模拟导入
  message.success('错题导入成功！')
  importModalVisible.value = false
  fileList.value = []
  
  // 重新加载数据
  loadData()
}

// 取消导入
const handleCancelImport = () => {
  fileList.value = []
}

// 处理导出
const handleExport = ({ key }) => {
  const exportMap = {
    'excel-all': '导出全部错题（Excel格式）',
    'pdf-all': '导出全部错题（PDF格式）',
    'excel-filtered': `导出筛选结果（Excel格式，共 ${filteredErrors.value.length} 题）`,
    'pdf-filtered': `导出筛选结果（PDF格式，共 ${filteredErrors.value.length} 题）`
  }
  
  message.success(exportMap[key])
  console.log('导出操作:', key)
}

// 查看错题详情
const viewErrorDetail = (record) => {
  selectedError.value = record
  detailModalVisible.value = true
}

// 删除错题
const deleteError = (record) => {
  errorList.value = errorList.value.filter(item => item.id !== record.id)
  message.success('删除成功')
}

// 批量删除
const handleBatchDelete = () => {
  errorList.value = errorList.value.filter(item => !selectedRowKeys.value.includes(item.id))
  selectedRowKeys.value = []
  message.success('批量删除成功')
}

// 加载数据
const loadData = () => {
  // 模拟错题数据
  errorList.value = [
    {
      id: 1,
      question: 'What is the capital of France?',
      questionType: 'choice',
      options: ['London', 'Paris', 'Berlin', 'Madrid'],
      correctIndexes: [1],
      correctAnswer: 'B',
      errorCount: 15,
      classLevel: 'A',
      lastErrorTime: '2024-02-08 14:30'
    },
    {
      id: 2,
      question: 'The sky is ___.',
      questionType: 'fillBlank',
      correctAnswer: 'blue',
      errorCount: 8,
      classLevel: 'B',
      lastErrorTime: '2024-02-07 10:15'
    },
    {
      id: 3,
      question: '拼写单词：美丽的',
      questionType: 'spelling',
      correctAnswer: 'beautiful',
      errorCount: 22,
      classLevel: 'C',
      lastErrorTime: '2024-02-09 16:45'
    },
    {
      id: 4,
      question: 'Choose the correct tense: I ___ to school yesterday.',
      questionType: 'choice',
      options: ['go', 'went', 'going', 'goes'],
      correctIndexes: [1],
      correctAnswer: 'B',
      errorCount: 12,
      classLevel: 'A',
      lastErrorTime: '2024-02-08 09:20'
    },
    {
      id: 5,
      question: 'She ___ a teacher.',
      questionType: 'fillBlank',
      correctAnswer: 'is',
      errorCount: 5,
      classLevel: 'D',
      lastErrorTime: '2024-02-06 11:30'
    },
    {
      id: 6,
      question: 'Which of the following are fruits?',
      questionType: 'choice',
      options: ['Apple', 'Carrot', 'Banana', 'Potato', 'Orange'],
      correctIndexes: [0, 2, 4],
      correctAnswer: 'A,C,E',
      errorCount: 18,
      classLevel: 'B',
      lastErrorTime: '2024-02-09 10:20'
    },
    {
      id: 7,
      question: 'The book is ___ the table.',
      questionType: 'fillBlank',
      correctAnswer: 'on',
      errorCount: 9,
      classLevel: 'D',
      lastErrorTime: '2024-02-10 08:45'
    },
    {
      id: 8,
      question: '拼写单词：重要的',
      questionType: 'spelling',
      correctAnswer: 'important',
      errorCount: 25,
      classLevel: 'C',
      lastErrorTime: '2024-02-10 14:20'
    },
    {
      id: 9,
      question: 'Which sentence is correct?',
      questionType: 'choice',
      options: ['He go to school.', 'He goes to school.', 'He going to school.', 'He gone to school.'],
      correctIndexes: [1],
      correctAnswer: 'B',
      errorCount: 14,
      classLevel: 'A',
      lastErrorTime: '2024-02-11 09:30'
    },
    {
      id: 10,
      question: 'They ___ playing football now.',
      questionType: 'fillBlank',
      correctAnswer: 'are',
      errorCount: 7,
      classLevel: 'B',
      lastErrorTime: '2024-02-11 11:15'
    },
    {
      id: 11,
      question: '拼写单词：经验，体验',
      questionType: 'spelling',
      correctAnswer: 'experience',
      errorCount: 30,
      classLevel: 'A',
      lastErrorTime: '2024-02-12 10:00'
    },
    {
      id: 12,
      question: 'Select the past tense of "eat".',
      questionType: 'choice',
      options: ['eated', 'ate', 'eaten', 'eating'],
      correctIndexes: [1],
      correctAnswer: 'B',
      errorCount: 11,
      classLevel: 'B',
      lastErrorTime: '2024-02-12 15:40'
    },
    {
      id: 13,
      question: 'I have ___ finished my homework.',
      questionType: 'fillBlank',
      correctAnswer: 'already',
      errorCount: 16,
      classLevel: 'C',
      lastErrorTime: '2024-02-13 08:20'
    },
    {
      id: 14,
      question: 'Which words are adjectives?',
      questionType: 'choice',
      options: ['quickly', 'beautiful', 'happy', 'run', 'tall'],
      correctIndexes: [1, 2, 4],
      correctAnswer: 'B,C,E',
      errorCount: 20,
      classLevel: 'A',
      lastErrorTime: '2024-02-13 13:50'
    },
    {
      id: 15,
      question: '拼写单词：环境',
      questionType: 'spelling',
      correctAnswer: 'environment',
      errorCount: 28,
      classLevel: 'B',
      lastErrorTime: '2024-02-14 09:10'
    },
    {
      id: 16,
      question: 'She ___ not like coffee.',
      questionType: 'fillBlank',
      correctAnswer: 'does',
      errorCount: 6,
      classLevel: 'D',
      lastErrorTime: '2024-02-14 16:30'
    }
  ]
}

onMounted(() => {
  loadData()
})
</script>

<style scoped src="./error-management.css"></style>
