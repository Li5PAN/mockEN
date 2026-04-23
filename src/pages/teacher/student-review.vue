<template>
  <div class="student-review-container">
    <a-tabs v-model:activeKey="activeTab" type="card" size="large">
      <!-- 入班申请 -->
      <a-tab-pane key="join" tab="入班申请">
        <a-table 
          :columns="joinColumns" 
          :data-source="joinApplications" 
          :loading="loading"
          :pagination="{ pageSize: 10 }"
          :row-key="record => record.applicationId"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="primary" size="small" @click="handleApprove(record, 'join')">
                  通过
                </a-button>
                <a-button danger size="small" @click="handleReject(record, 'join')">
                  拒绝
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-tab-pane>

      <!-- 换班申请 -->
      <a-tab-pane key="transfer" tab="换班申请">
        <a-table 
          :columns="transferColumns" 
          :data-source="transferApplications" 
          :loading="loading"
          :pagination="{ pageSize: 10 }"
          :row-key="record => record.applicationId"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="primary" size="small" @click="handleApprove(record, 'transfer')">
                  通过
                </a-button>
                <a-button danger size="small" @click="handleReject(record, 'transfer')">
                  拒绝
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-tab-pane>

      <!-- 退班申请 -->
      <a-tab-pane key="quit" tab="退班申请">
        <a-table 
          :columns="quitColumns" 
          :data-source="quitApplications" 
          :loading="loading"
          :pagination="{ pageSize: 10 }"
          :row-key="record => record.applicationId"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-space>
                <a-button type="primary" size="small" @click="handleApprove(record, 'quit')">
                  通过
                </a-button>
                <a-button danger size="small" @click="handleReject(record, 'quit')">
                  拒绝
                </a-button>
              </a-space>
            </template>
          </template>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <!-- 通过申请弹窗 -->
    <a-modal
      v-model:open="approveModalVisible"
      title="通过申请"
      ok-text="确认通过"
      cancel-text="取消"
      :ok-button-props="{ disabled: approveLoading }"
      :confirm-loading="approveLoading"
      @ok="confirmApprove"
      @cancel="approveModalVisible = false"
    >
      <div class="modal-form-item">
        <div class="modal-label">通过原因（选填）</div>
        <a-textarea
          v-model:value="currentReason"
          placeholder="请输入通过原因（可不填）"
          :rows="3"
          :maxlength="200"
          show-count
        />
      </div>
    </a-modal>

    <!-- 拒绝申请弹窗 -->
    <a-modal
      v-model:open="rejectModalVisible"
      title="拒绝申请"
      ok-text="确认拒绝"
      cancel-text="取消"
      :ok-button-props="{ disabled: rejectLoading || !currentReason.trim() }"
      :confirm-loading="rejectLoading"
      @ok="confirmReject"
      @cancel="rejectModalVisible = false"
    >
      <div class="modal-form-item">
        <div class="modal-label required">拒绝原因（必填）</div>
        <a-textarea
          v-model:value="currentReason"
          placeholder="请输入拒绝原因"
          :rows="3"
          :maxlength="200"
          show-count
        />
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
// 使用真实 API 服务
import {
  getApplications,
  approveApplication,
  rejectApplication
} from '@/services/teacher/teacherClass'

// 当前激活的标签页
const activeTab = ref('join')

// 加载状态
const loading = ref(false)

// 弹窗相关
const approveModalVisible = ref(false)
const rejectModalVisible = ref(false)
const approveLoading = ref(false)
const rejectLoading = ref(false)
const currentReason = ref('')
const currentRecord = ref(null)
const currentType = ref('')

// 入班申请列表列定义
const joinColumns = [
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
    width: 120
  },
  {
    title: '班级等级',
    key: 'classLevel',
    width: 100
  },
  {
    title: '申请进入班级',
    dataIndex: 'className',
    key: 'className',
    width: 180
  },
  {
    title: '发起申请时间',
    dataIndex: 'applicationTime',
    key: 'applicationTime',
    width: 180
  },
  {
    title: '申请理由',
    dataIndex: 'applicationReason',
    key: 'applicationReason',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]

// 换班申请列表列定义
const transferColumns = [
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
    width: 120
  },
  {
    title: '原班级等级',
    key: 'fromClassLevel',
    width: 110
  },
  {
    title: '原班级',
    dataIndex: 'fromClassName',
    key: 'fromClassName',
    width: 150
  },
  {
    title: '目标等级',
    key: 'toClassLevel',
    width: 100
  },
  {
    title: '申请转入班级',
    dataIndex: 'toClassName',
    key: 'toClassName',
    width: 150
  },
  {
    title: '发起申请时间',
    dataIndex: 'applicationTime',
    key: 'applicationTime',
    width: 180
  },
  {
    title: '转换理由',
    dataIndex: 'applicationReason',
    key: 'applicationReason',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]

// 退班申请列表列定义
const quitColumns = [
  {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
    width: 120
  },
  {
    title: '班级等级',
    key: 'classLevel',
    width: 100
  },
  {
    title: '退出班级',
    dataIndex: 'className',
    key: 'className',
    width: 180
  },
  {
    title: '发起申请时间',
    dataIndex: 'applicationTime',
    key: 'applicationTime',
    width: 180
  },
  {
    title: '申请理由',
    dataIndex: 'applicationReason',
    key: 'applicationReason',
    ellipsis: true
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]

// 入班申请数据
const joinApplications = ref([])

// 换班申请数据
const transferApplications = ref([])

// 退班申请数据
const quitApplications = ref([])

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

// 处理通过申请
const handleApprove = (record, type) => {
  currentRecord.value = record
  currentType.value = type
  currentReason.value = ''
  approveModalVisible.value = true
}

// 处理拒绝申请
const handleReject = (record, type) => {
  currentRecord.value = record
  currentType.value = type
  currentReason.value = ''
  rejectModalVisible.value = true
}

// 确认通过
const confirmApprove = async () => {
  const record = currentRecord.value
  const type = currentType.value
  const typeMap = {
    join: '入班',
    transfer: '换班',
    quit: '退班'
  }

  approveLoading.value = true
  try {
    const res = await approveApplication(record.applicationId, currentReason.value)
    if (res.code === 200) {
      message.success(`已通过 ${record.userName || record.studentName} 的${typeMap[type]}申请`)
      if (type === 'join') {
        joinApplications.value = joinApplications.value.filter(item => item.applicationId !== record.applicationId)
      } else if (type === 'transfer') {
        transferApplications.value = transferApplications.value.filter(item => item.applicationId !== record.applicationId)
      } else if (type === 'quit') {
        quitApplications.value = quitApplications.value.filter(item => item.applicationId !== record.applicationId)
      }
      approveModalVisible.value = false
    } else {
      message.error(res.msg || '操作失败')
    }
  } catch (error) {
    console.error('审核通过失败:', error)
    message.error('操作失败，请稍后重试')
  } finally {
    approveLoading.value = false
  }
}

// 确认拒绝
const confirmReject = async () => {
  const record = currentRecord.value
  const type = currentType.value
  const typeMap = {
    join: '入班',
    transfer: '换班',
    quit: '退班'
  }

  if (!currentReason.value.trim()) {
    message.error('请填写拒绝原因')
    return
  }

  rejectLoading.value = true
  try {
    const res = await rejectApplication(record.applicationId, currentReason.value)
    if (res.code === 200) {
      message.success(`已拒绝 ${record.userName || record.studentName} 的${typeMap[type]}申请`)
      if (type === 'join') {
        joinApplications.value = joinApplications.value.filter(item => item.applicationId !== record.applicationId)
      } else if (type === 'transfer') {
        transferApplications.value = transferApplications.value.filter(item => item.applicationId !== record.applicationId)
      } else if (type === 'quit') {
        quitApplications.value = quitApplications.value.filter(item => item.applicationId !== record.applicationId)
      }
      rejectModalVisible.value = false
    } else {
      message.error(res.msg || '操作失败')
    }
  } catch (error) {
    console.error('审核拒绝失败:', error)
    message.error('操作失败，请稍后重试')
  } finally {
    rejectLoading.value = false
  }
}

// 加载申请数据
const loadData = async () => {
  loading.value = true
  try {
    // 加载入班申请数据 (applicationType: 1)
    const joinRes = await getApplications({
      applicationType: 1,
      pageNum: 1,
      pageSize: 10
    })
    if (joinRes.code === 200) {
      joinApplications.value = ((joinRes.rows) || []).map(item => ({
        ...item,
        id: item.applicationId,
        userName: item.studentName,
        className: item.targetClassName,
        applicationReason: item.reason,
        applicationTime: item.createTime
      }))
    }

    // 加载换班申请数据 (applicationType: 3)
    const transferRes = await getApplications({
      applicationType: 3,
      pageNum: 1,
      pageSize: 10
    })
    if (transferRes.code === 200) {
      transferApplications.value = ((transferRes.rows) || []).map(item => ({
        ...item,
        id: item.applicationId,
        userName: item.studentName,
        fromClassName: item.sourceClassName,
        toClassName: item.targetClassName,
        applicationReason: item.reason,
        applicationTime: item.createTime
      }))
    }

    // 加载退班申请数据 (applicationType: 2)
    const quitRes = await getApplications({
      applicationType: 2,
      pageNum: 1,
      pageSize: 10
    })
    if (quitRes.code === 200) {
      quitApplications.value = ((quitRes.rows) || []).map(item => ({
        ...item,
        id: item.applicationId,
        userName: item.studentName,
        className: item.sourceClassName,
        applicationReason: item.reason,
        applicationTime: item.createTime
      }))
    }
  } catch (error) {
    console.error('加载申请数据失败:', error)
    message.error('加载申请数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped src="./student-review.css"></style>
