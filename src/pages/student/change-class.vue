<template>
  <div class="change-class-container">
    <a-card title="换班中心">
      <template #extra>
        <a-button type="default" @click="goToMyClass">
          我的班级
        </a-button>
      </template>
      <!-- 当前班级信息 -->
      <a-alert
        message="当前班级信息"
        type="info"
        show-icon
        style="margin-bottom: 20px"
      >
        <template #description>
          <div style="margin-top: 8px">
            <div><strong>班级：</strong><a-tag :color="getLevelColor(currentClass.level)">{{ currentClass.level }}级</a-tag> {{ currentClass.name }}</div>
            <div style="margin-top: 8px">
              <strong>任务完成进度：</strong>
              <a-progress 
                :percent="currentClass.myCompletionRate" 
                :status="currentClass.myCompletionRate === 100 ? 'success' : 'exception'"
                style="max-width: 300px; display: inline-block; margin-left: 10px"
              />
              <span style="margin-left: 10px">{{ currentClass.completedTasks }}/{{ currentClass.totalTasks }} 个任务</span>
            </div>
          </div>
        </template>
      </a-alert>

      <!-- 任务未完成提示 -->
      <a-alert
        v-if="currentClass.myCompletionRate < 100"
        message="无法换班"
        :description="`您当前的任务完成率为 ${currentClass.myCompletionRate}%，需要完成当前班级 100% 的任务（${currentClass.totalTasks}个任务）才能申请换班。请继续努力完成任务！`"
        type="error"
        show-icon
        style="margin-bottom: 20px"
      />

      <!-- 可换班提示 -->
      <a-alert
        v-else
        message="恭喜！您已满足换班条件"
        description="您已完成当前班级的全部任务，可以选择同级或高一级的班级发起换班申请。"
        type="success"
        show-icon
        style="margin-bottom: 20px"
      />

      <!-- 可选班级列表 -->
      <a-divider>可选班级</a-divider>

      <div v-if="currentClass.myCompletionRate < 100" style="text-align: center; padding: 40px; color: #999">
        <a-empty description="完成当前班级全部任务后才能查看可换班级" />
      </div>

      <div v-else>
        <!-- 等级标签切换 -->
        <div style="margin-bottom: 20px">
          <a-space :size="6">
            <a-button 
              :type="selectedLevel === 'A' ? 'primary' : 'default'"
              size="large"
              @click="handleLevelChange('A')"
            >
              A级
            </a-button>
            <a-button 
              :type="selectedLevel === 'B' ? 'primary' : 'default'"
              size="large"
              @click="handleLevelChange('B')"
            >
              B级
            </a-button>
            <a-button 
              :type="selectedLevel === 'C' ? 'primary' : 'default'"
              size="large"
              @click="handleLevelChange('C')"
            >
              C级
            </a-button>
            <a-button 
              :type="selectedLevel === 'D' ? 'primary' : 'default'"
              size="large"
              @click="handleLevelChange('D')"
            >
              D级
            </a-button>
          </a-space>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" style="text-align: center; padding: 40px">
          <a-spin size="large" />
        </div>

        <a-row v-else :gutter="[16, 16]">
          <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="cls in filteredClasses" :key="cls.id">
            <a-card 
              hoverable 
              class="class-card"
              :class="{ 'current-class': cls.id === currentClass.id }"
            >
              <div class="class-header">
                <a-tag :color="getLevelColor(cls.level)" class="level-tag">{{ cls.level }}级</a-tag>
                <div class="class-name">{{ cls.name }}</div>
              </div>
              <a-divider style="margin: 12px 0" />
              <div class="class-info">
                <div class="info-item">
                  <UserOutlined class="info-icon" />
                  <span class="info-label">授课老师：</span>
                  <span class="info-value">{{ cls.teacher }}</span>
                </div>
                <div class="info-item">
                  <TeamOutlined class="info-icon" />
                  <span class="info-label">班级人数：</span>
                  <span class="info-value">{{ cls.studentCount }}人</span>
                </div>
                <div class="info-item">
                  <TrophyOutlined class="info-icon" />
                  <span class="info-label">任务数量：</span>
                  <span class="info-value">{{ cls.totalTasks }}个</span>
                </div>
              </div>
              <a-button 
                v-if="cls.id === currentClass.id"
                block 
                disabled
                style="margin-top: 12px"
              >
                当前班级
              </a-button>
              <a-button 
                v-else-if="!canChangeToClass(cls.level)"
                block 
                disabled
                style="margin-top: 12px"
              >
                等级过高
              </a-button>
              <a-button 
                v-else
                type="primary" 
                block 
                style="margin-top: 12px"
                @click="applyChangeClass(cls)"
              >
                申请换班
              </a-button>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </a-card>

    <!-- 换班申请确认弹窗 -->
    <a-modal
      v-model:open="changeModalVisible"
      title="确认换班申请"
      :confirm-loading="submitLoading"
      @ok="confirmChange"
      @cancel="changeModalVisible = false"
    >
      <p>您确定要申请换班到 <strong>{{ selectedClass?.name }}</strong> 吗？</p>
      <a-alert
        message="换班说明"
        type="warning"
        show-icon
        style="margin-top: 12px"
      >
        <template #description>
          <ul style="margin: 8px 0; padding-left: 20px">
            <li>提交后需要等待新班级老师审核</li>
            <li>审核通过后将自动离开当前班级</li>
            <li>换班后任务进度将重新计算</li>
          </ul>
          <div>
            申请理由:<input/>
          </div>
        </template>
      </a-alert>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons-vue'
import {
  mockGetMyClassInfo,
  mockGetClassList,
  mockApplyChangeClass
} from '../mockjson/myclass.js'

const router = useRouter()

// 选中的等级
const selectedLevel = ref('B')

// 加载状态
const loading = ref(false)

// 当前班级信息
const currentClass = ref({
  id: null,
  level: '',
  name: '',
  teacher: '',
  studentCount: 0,
  avgCompletionRate: 0,
  myCompletionRate: 0,
  totalTasks: 0,
  completedTasks: 0
})

// 所有班级数据
const allClasses = ref([])

// 加载可选班级列表
const fetchClassList = async (level) => {
  loading.value = true
  try {
    const res = await mockGetClassList(level)
    if (res.code === 200) {
      allClasses.value = res.rows.map(item => ({
        id: item.classId,
        level: item.classLevel,
        name: item.className,
        teacher: item.teacherName,
        studentCount: item.memberCount,
        totalTasks: item.taskCount
      }))
    }
  } catch (error) {
    console.error('获取班级列表失败:', error)
    message.error('获取班级列表失败')
  } finally {
    loading.value = false
  }
}

// 监听等级切换
const handleLevelChange = (level) => {
  selectedLevel.value = level
  fetchClassList(level)
}

// 加载我的班级信息
const loadMyClassInfo = async () => {
  try {
    const res = await mockGetMyClassInfo()
    if (res.code === 200 && res.data) {
      const data = res.data
      currentClass.value = {
        id: data.classId,
        level: data.classLevel || '',
        name: data.className || '',
        teacher: data.teacherName || '',
        studentCount: data.memberCount || 0,
        avgCompletionRate: data.classTaskCompletionRate || 0,
        myCompletionRate: data.myTaskCompletionRate || 0,
        totalTasks: data.totalTasks || 0,
        completedTasks: data.completedTasks || 0
      }
    }
  } catch (error) {
    console.error('获取班级信息失败:', error)
  }
}

// 组件挂载时
onMounted(async () => {
  await loadMyClassInfo()
  if (currentClass.value.level) {
    selectedLevel.value = currentClass.value.level
  }
  fetchClassList(selectedLevel.value)
})

// 等级排序
const levelOrder = { A: 4, B: 3, C: 2, D: 1 }

// 根据选中等级过滤班级
const filteredClasses = computed(() => {
  return allClasses.value.filter(cls => cls.level === selectedLevel.value)
})

// 判断是否可以换到该等级的班级
const canChangeToClass = (classLevel) => {
  const currentLevelValue = levelOrder[currentClass.value.level]
  const targetLevelValue = levelOrder[classLevel]
  
  return targetLevelValue <= currentLevelValue + 1
}

// 可换班级列表
const availableClasses = computed(() => {
  if (currentClass.value.myCompletionRate < 100) {
    return []
  }

  const levelOrderList = ['D', 'C', 'B', 'A']
  const currentLevelIndex = levelOrderList.indexOf(currentClass.value.level)
  
  return allClasses.value.filter(cls => {
    const clsLevelIndex = levelOrderList.indexOf(cls.level)
    return clsLevelIndex >= currentLevelIndex && clsLevelIndex <= currentLevelIndex + 1
  })
})

// 班级等级颜色
const getLevelColor = (level) => {
  const colors = { A: 'red', B: 'orange', C: 'blue', D: 'green' }
  return colors[level] || 'default'
}

const getLevelColorHex = (level) => {
  const colors = { A: '#f5222d', B: '#fa8c16', C: '#1890ff', D: '#52c41a' }
  return colors[level] || '#666'
}

// 换班申请相关
const changeModalVisible = ref(false)
const selectedClass = ref(null)
const submitLoading = ref(false)

const applyChangeClass = (cls) => {
  selectedClass.value = cls
  changeModalVisible.value = true
}

const confirmChange = async () => {
  if (!selectedClass.value) return
  
  submitLoading.value = true
  try {
    const res = await mockApplyChangeClass(selectedClass.value.id)
    if (res.code === 200) {
      message.success('换班申请提交成功，请等待老师审核')
      changeModalVisible.value = false
      
      setTimeout(() => {
        router.push('/student/my-class')
      }, 1500)
    } else {
      message.error(res.msg || '换班申请提交失败')
    }
  } catch (error) {
    console.error('提交换班申请失败:', error)
    message.error('提交换班申请失败，请稍后重试')
  } finally {
    submitLoading.value = false
  }
}

// 返回我的班级
const goToMyClass = () => {
  router.push('/student/my-class')
}
</script>

<style scoped src="./change-class.css"></style>
