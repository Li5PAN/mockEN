<template>
  <div class="user-management-container">
    <!-- 顶部筛选 -->
    <a-card style="margin-bottom: 16px;">
      <a-space :size="16">
        <span>身份筛选：</span>
        <a-select 
          v-model:value="roleFilter" 
          placeholder="请选择身份" 
          style="width: 200px"
          @change="handleFilterChange"
        >
          <a-select-option value="">全部</a-select-option>
          <a-select-option value="teacher">老师</a-select-option>
          <a-select-option value="student">学生</a-select-option>
        </a-select>
      </a-space>
    </a-card>

    <!-- 人员表格 -->
    <a-card>
      <a-table 
        :columns="columns" 
        :data-source="filteredUserList" 
        :pagination="{ pageSize: 10 }"
        :row-key="record => record.userId"
        :loading="loading"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">
              {{ getRoleLabel(record.role) }}
            </a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="showDetail(record)">
                详情
              </a-button>
              <a-button type="link" danger size="small" @click="handleDelete(record)">
                删除
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
      
      <!-- 空状态 -->
      <a-empty v-if="filteredUserList.length === 0" description="暂无人员数据" />
    </a-card>

    <!-- 详情弹窗 -->
    <a-modal
      v-model:open="detailModalVisible"
      title="人员详情"
      :footer="null"
      width="600px"
    >
      <div v-if="selectedUser" class="user-detail">
        <a-descriptions :column="1" bordered>
          <a-descriptions-item label="姓名">
            {{ selectedUser.nickName }}
          </a-descriptions-item>
          <a-descriptions-item label="账号">
            {{ selectedUser.userName }}
          </a-descriptions-item>
          <a-descriptions-item label="身份">
            <a-tag :color="getRoleColor(selectedUser.roleType)">
              {{ getRoleLabel(selectedUser.roleType) }}
            </a-tag>
          </a-descriptions-item>
          <a-descriptions-item label="当前班级" v-if="selectedUser.roleType === 'student'">
            <span v-if="selectedUser.className">
              <a-tag :color="getLevelColor(selectedUser.classLevel)" size="small">
                {{ selectedUser.classLevel }}级
              </a-tag>
              {{ selectedUser.className }}
            </span>
            <span v-else style="color: #999;">暂无班级</span>
          </a-descriptions-item>
          <a-descriptions-item label="邮箱" v-if="selectedUser.email">
            {{ selectedUser.email || '暂无' }}
          </a-descriptions-item>
          <a-descriptions-item label="手机号" v-if="selectedUser.phonenumber">
            {{ selectedUser.phonenumber || '暂无' }}
          </a-descriptions-item>
          <a-descriptions-item label="创建时间" v-if="selectedUser.createTime">
            {{ formatDate(selectedUser.createTime) }}
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { getUserList, getUserDetail, deleteUser } from '@/services/admin/aperson'

// 身份筛选
const roleFilter = ref('')

// 人员列表
const userList = ref([])

// 详情弹窗
const detailModalVisible = ref(false)
const selectedUser = ref(null)

// 加载状态
const loading = ref(false)

// 表格列定义
const columns = [
  {
    title: '姓名',
    dataIndex: 'nickName',
    key: 'nickName',
    width: 120
  },
  {
    title: '账号',
    dataIndex: 'userName',
    key: 'userName',
    width: 150
  },
  {
    title: '身份',
    dataIndex: 'roleType',
    key: 'roleType',
    width: 100
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right'
  }
]

// 筛选后的人员列表
const filteredUserList = computed(() => {
  if (!roleFilter.value) {
    return userList.value
  }
  return userList.value.filter(item => item.roleType === roleFilter.value)
})

// 获取身份颜色
const getRoleColor = (role) => {
  const colorMap = {
    teacher: 'green',
    student: 'blue',
    admin: 'orange'
  }
  return colorMap[role] || 'default'
}

// 获取身份标签
const getRoleLabel = (role) => {
  const labelMap = {
    teacher: '老师',
    student: '学生',
    admin: '管理员'
  }
  return labelMap[role] || '未知'
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

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

// 处理筛选变化
const handleFilterChange = () => {
  // 筛选逻辑已通过 computed 实现
}

// 显示详情
const showDetail = async (record) => {
  try {
    const res = await getUserDetail(record.userId)
    if (res.code === 200) {
      selectedUser.value = res.data
      detailModalVisible.value = true
    } else {
      message.error(res.msg || '获取详情失败')
    }
  } catch (error) {
    message.error('获取详情失败')
  }
}

// 处理删除
const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定删除用户 "${record.nickName}" (${record.userName}) 吗？此操作不可恢复。`,
    okText: '确认',
    cancelText: '取消',
    onOk: async () => {
      try {
        const res = await deleteUser(record.userId)
        if (res.code === 200) {
          userList.value = userList.value.filter(item => item.userId !== record.userId)
          message.success('删除成功')
        } else {
          message.error(res.msg || '删除失败')
        }
      } catch (error) {
        message.error('删除失败')
      }
    }
  })
}

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    const res = await getUserList(roleFilter.value)
    if (res.code === 200) {
      userList.value = res.rows || []
    } else {
      message.error(res.msg || '获取列表失败')
    }
  } catch (error) {
    message.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped src="./user-management.css"></style>
