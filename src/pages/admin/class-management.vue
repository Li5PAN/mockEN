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
            :row-key="record => record.id"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'classLevel'">
                <a-tag :color="getLevelColor(record.classLevel)">
                  {{ record.classLevel }}级
                </a-tag>
              </template>
              <template v-else-if="column.key === 'action'">
                <a-space>
                  <a-button type="primary" size="small" @click="handleApprove(record)">
                    通过
                  </a-button>
                  <a-button danger size="small" @click="handleReject(record)">
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
            :row-key="record => record.id"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import SearchOutlined from '@ant-design/icons-vue/SearchOutlined'

// 当前激活的标签页
const activeTab = ref('review')

// 老师名字搜索
const teacherSearch = ref('')

// 班级审核列表
const reviewList = ref([])

// 班级管理列表
const managementList = ref([])

// 班级审核列表列定义
const reviewColumns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: '班级等级',
    dataIndex: 'classLevel',
    key: 'classLevel',
    width: 100
  },
  {
    title: '老师',
    dataIndex: 'teacher',
    key: 'teacher',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180
  },
  {
    title: '班级限定人数',
    dataIndex: 'maxStudents',
    key: 'maxStudents',
    width: 120
  },
  {
    title: '班级任务数',
    dataIndex: 'taskCount',
    key: 'taskCount',
    width: 120
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
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 150
  },
  {
    title: '班级等级',
    dataIndex: 'classLevel',
    key: 'classLevel',
    width: 100
  },
  {
    title: '老师',
    dataIndex: 'teacher',
    key: 'teacher',
    width: 120
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180
  },
  {
    title: '学生人数',
    dataIndex: 'studentCount',
    key: 'studentCount',
    width: 100
  },
  {
    title: '班级任务数',
    dataIndex: 'taskCount',
    key: 'taskCount',
    width: 120
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
    item.teacher.toLowerCase().includes(teacherSearch.value.toLowerCase())
  )
})

// 筛选后的管理列表
const filteredManagementList = computed(() => {
  if (!teacherSearch.value) {
    return managementList.value
  }
  return managementList.value.filter(item => 
    item.teacher.toLowerCase().includes(teacherSearch.value.toLowerCase())
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
  // 搜索逻辑已通过 computed 实现
}

// 处理通过审核
const handleApprove = (record) => {
  Modal.confirm({
    title: '确认通过',
    content: `确定通过 "${record.name}" 的班级创建申请吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      // 从审核列表移除
      reviewList.value = reviewList.value.filter(item => item.id !== record.id)
      // 添加到管理列表
      managementList.value.unshift(record)
      message.success('审核通过')
    }
  })
}

// 处理拒绝审核
const handleReject = (record) => {
  Modal.confirm({
    title: '确认拒绝',
    content: `确定拒绝 "${record.name}" 的班级创建申请吗？`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      reviewList.value = reviewList.value.filter(item => item.id !== record.id)
      message.warning('已拒绝该申请')
    }
  })
}

// 处理删除班级
const handleDelete = (record) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定删除班级 "${record.name}" 吗？此操作不可恢复。`,
    okText: '确认',
    cancelText: '取消',
    onOk() {
      managementList.value = managementList.value.filter(item => item.id !== record.id)
      message.success('删除成功')
    }
  })
}

// 随机生成60-100的整数
const randomTaskCount = () => Math.floor(Math.random() * 41) + 60

// 加载数据
const loadData = () => {
  // 模拟班级审核数据
  reviewList.value = [
    {
      id: 1,
      name: '高级英语强化班',
      classLevel: 'A',
      teacher: '张老师',
      createTime: '2024-02-10 10:30',
      maxStudents: 40,
      taskCount: randomTaskCount()
    },
    {
      id: 2,
      name: '中级英语提升班',
      classLevel: 'B',
      teacher: '李老师',
      createTime: '2024-02-10 14:20',
      maxStudents: 45,
      taskCount: randomTaskCount()
    },
    {
      id: 3,
      name: '初级英语入门班',
      classLevel: 'C',
      teacher: '王老师',
      createTime: '2024-02-11 09:15',
      maxStudents: 50,
      taskCount: randomTaskCount()
    }
  ]

  // 模拟班级管理数据
  managementList.value = [
    {
      id: 101,
      name: '高级英语班',
      classLevel: 'A',
      teacher: '张老师',
      createTime: '2024-01-15 10:30',
      studentCount: 40,
      taskCount: 80
    },
    {
      id: 102,
      name: '中级英语班',
      classLevel: 'B',
      teacher: '李老师',
      createTime: '2024-01-20 14:20',
      studentCount: 45,
      taskCount: 70
    },
    {
      id: 103,
      name: '初级英语班',
      classLevel: 'C',
      teacher: '王老师',
      createTime: '2024-02-01 09:15',
      studentCount: 50,
      taskCount: 65
    },
    {
      id: 104,
      name: '基础英语班',
      classLevel: 'D',
      teacher: '赵老师',
      createTime: '2024-02-05 16:45',
      studentCount: 35,
      taskCount: 60
    },
    {
      id: 105,
      name: 'A级进阶班',
      classLevel: 'A',
      teacher: '张老师',
      createTime: '2024-01-18 11:00',
      studentCount: 38,
      taskCount: 75
    },
    {
      id: 106,
      name: 'B级提高班',
      classLevel: 'B',
      teacher: '李老师',
      createTime: '2024-01-25 15:30',
      studentCount: 42,
      taskCount: 68
    },
    {
      id: 107,
      name: 'C级入门班',
      classLevel: 'C',
      teacher: '王老师',
      createTime: '2024-02-03 10:20',
      studentCount: 48,
      taskCount: 62
    },
    {
      id: 108,
      name: 'D级启蒙班',
      classLevel: 'D',
      teacher: '赵老师',
      createTime: '2024-02-08 14:00',
      studentCount: 32,
      taskCount: 58
    }
  ]
}

onMounted(() => {
  loadData()
})
</script>

<style scoped src="./class-management.css"></style>
