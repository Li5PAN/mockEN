<template>
  <div class="class-management-container">
    <!-- 筛选栏 -->
    <a-card style="margin-bottom: 16px;">
      <a-space :size="16">
        <span>老师名字：</span>
        <a-input
          v-model:value="teacherSearch"
          placeholder="请输入老师名字搜索"
          style="width: 250px"
          allow-clear
          @change="handleSearch"
        >
          <template #prefix>
            <SearchOutlined />
          </template>
        </a-input>
        <a-button type="primary" @click="handleSearch">
          <template #icon><SearchOutlined /></template>
          搜索
        </a-button>
      </a-space>
    </a-card>

    <!-- 标签切换 -->
    <a-card>
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="review">
          <template #tab>
            <span>
              班级审核
              <a-badge 
                v-if="filteredReviewList.length > 0" 
                :count="filteredReviewList.length" 
                :offset="[6, -2]"
                :number-style="{ backgroundColor: '#fa8c16' }"
              />
            </span>
          </template>
          <a-table 
            :columns="reviewColumns" 
            :data-source="filteredReviewList" 
            :pagination="{ pageSize: 10 }"
            :row-key="record => record.classId"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'classLevel'">
                <a-tag :color="getLevelColor(record.classLevel)">
                  {{ record.classLevel }}级
                </a-tag>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-space>
                  <a-button type="primary" size="small" @click="openReviewModal(record, 'approve')">
                    通过
                  </a-button>
                  <a-button danger size="small" @click="openReviewModal(record, 'reject')">
                    拒绝
                  </a-button>
                </a-space>
              </template>
            </template>
          </a-table>
          
          <!-- 空状态 -->
          <a-empty v-if="filteredReviewList.length === 0" description="暂无待审核班级" />
        </a-tab-pane>

        <a-tab-pane key="management" tab="班级管理">
          <a-table 
            :columns="managementColumns" 
            :data-source="filteredManagementList" 
            :pagination="{ pageSize: 10 }"
            :loading="managementLoading"
            :row-key="record => record.classId"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'classLevel'">
                <a-tag :color="getLevelColor(record.classLevel)">
                  {{ record.classLevel }}级
                </a-tag>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-button danger size="small" @click="handleDelete(record)">
                  删除
                </a-button>
              </template>
            </template>
          </a-table>
          
          <!-- 空状态 -->
          <a-empty v-if="filteredManagementList.length === 0" description="暂无班级数据" />
        </a-tab-pane>
      </a-tabs>
    </a-card>

    <!-- 审核操作弹窗 -->
    <a-modal
      v-model:open="modalState.visible"
      :title="modalState.title"
      :ok-text="modalState.okText"
      cancel-text="取消"
      :ok-button-props="{ disabled: modalState.action === 'reject' && !modalState.reason.trim() }"
      :confirm-loading="modalState.loading"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <div style="margin-bottom: 8px;">
        {{ modalState.content }}
      </div>
      <a-input
        v-model:value="modalState.reason"
        :placeholder="modalState.action === 'reject' ? '请输入拒绝原因（必填）' : '请输入通过原因（选填）'"
        :maxlength="200"
        show-count
      />
      <div v-if="modalState.action === 'reject'" style="margin-top: 8px; color: #ff4d4f; font-size: 12px;">
        * 拒绝原因必须填写
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined'
import { getAuditList, getManageList, approveClass, rejectClass, deleteClass } from '@/services/admin/aaclass'

// 当前激活的标签页
const activeTab = ref('review')

// 监听标签页切换
import { watch } from 'vue'
watch(activeTab, (newTab) => {
  if (newTab === 'management' && managementList.value.length === 0) {
    loadManagementList()
  }
})

// 老师名字搜索
const teacherSearch = ref('')

// 班级审核列表
const reviewList = ref([])

// 班级管理列表
const managementList = ref([])

// 加载状态
const managementLoading = ref(false)

// 审核操作弹窗状态
const modalState = ref({
  visible: false,
  action: '', // 'approve' | 'reject'
  title: '',
  content: '',
  okText: '',
  reason: '',
  loading: false,
  record: null
})

// 打开审核弹窗
const openReviewModal = (record, action) => {
  modalState.value = {
    visible: true,
    action,
    title: action === 'approve' ? '确认通过' : '确认拒绝',
    content: `确定${action === 'approve' ? '通过' : '拒绝'} "${record.className}" 的班级创建申请吗？`,
    okText: action === 'approve' ? '确认通过' : '确认拒绝',
    reason: '',
    loading: false,
    record
  }
}

// 弹窗确认
const handleModalOk = async () => {
  const { action, record, reason } = modalState.value
  modalState.value.loading = true
  try {
    if (action === 'approve') {
      await approveClass(record.classId, reason || null)
    } else {
      await rejectClass(record.classId, reason)
    }
    reviewList.value = reviewList.value.filter(item => item.classId !== record.classId)
    message.success(action === 'approve' ? '审核通过' : '已拒绝该申请')
    modalState.value.visible = false
  } catch (error) {
    message.error('操作失败')
  } finally {
    modalState.value.loading = false
  }
}

// 弹窗取消
const handleModalCancel = () => {
  modalState.value.visible = false
  modalState.value.reason = ''
}

// 班级审核列表列定义
const reviewColumns = [
  {
    title: '班级ID',
    dataIndex: 'classId',
    key: 'classId',
    width: 80
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className',
    width: 150
  },
  {
    title: '班级等级',
    dataIndex: 'classLevel',
    key: 'classLevel',
    width: 100
  },
  {
    title: '创建者',
    dataIndex: 'teacherName',
    key: 'teacherName',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180
  },
  {
    title: '最大学生数',
    dataIndex: 'maxStudents',
    key: 'maxStudents',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]

// 班级管理列表列定义
const managementColumns = [
  {
    title: '班级ID',
    dataIndex: 'classId',
    key: 'classId',
    width: 80
  },
  {
    title: '班级名称',
    dataIndex: 'className',
    key: 'className',
    width: 150
  },
  {
    title: '班级等级',
    dataIndex: 'classLevel',
    key: 'classLevel',
    width: 100
  },
  {
    title: '创建者',
    dataIndex: 'teacherName',
    key: 'teacherName',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180
  },
  {
    title: '当前学生数',
    dataIndex: 'currentStudents',
    key: 'currentStudents',
    width: 100
  },
  {
    title: '进行中任务',
    dataIndex: 'taskCount',
    key: 'taskCount',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    width: 100,
    fixed: 'right'
  }
]

// 筛选后的审核列表
const filteredReviewList = computed(() => {
  if (!teacherSearch.value) {
    return reviewList.value
  }
  return reviewList.value.filter(item =>
    item.teacherName.toLowerCase().includes(teacherSearch.value.toLowerCase())
  )
})

// 筛选后的管理列表
const filteredManagementList = computed(() => {
  if (!teacherSearch.value) {
    return managementList.value
  }
  return managementList.value.filter(item =>
    item.teacherName.toLowerCase().includes(teacherSearch.value.toLowerCase())
  )
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

// 处理搜索
const handleSearch = () => {
  loadData()
}

// 处理删除班级
const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定删除班级 "${record.name || record.className}" 吗？此操作不可恢复。`,
    okText: '确认',
    cancelText: '取消',
    async onOk() {
      try {
        await deleteClass(record.classId)
        managementList.value = managementList.value.filter(item => item.classId !== record.classId)
        message.success('删除成功')
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

// 加载数据
const loadData = async () => {
  try {
    const params = teacherSearch.value ? { teacherName: teacherSearch.value } : {}
    const response = await getAuditList(params)
    if (response.code === 200) {
      reviewList.value = response.rows || []
    }
  } catch (error) {
    console.error('加载审核列表失败:', error)
    message.error('加载数据失败')
  }
}

// 加载班级管理列表
const loadManagementList = async () => {
  managementLoading.value = true
  try {
    const params = teacherSearch.value ? { teacherName: teacherSearch.value } : {}
    const response = await getManageList(params)
    if (response.code === 200) {
      managementList.value = response.rows || []
    }
  } catch (error) {
    console.error('加载班级管理列表失败:', error)
    message.error('加载数据失败')
  } finally {
    managementLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped src="./class-management.css"></style>
