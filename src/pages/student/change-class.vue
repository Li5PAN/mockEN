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
      <a-divider v-if="!hasPendingChangeApplication">可选班级</a-divider>

      <!-- 有待审核申请时不显示班级列表 -->
      <div v-if="hasPendingChangeApplication" style="text-align: center; padding: 20px; color: #999">
        <a-alert
          message="您有正在审核中的换班申请"
          description="请等待审核结果后再进行其他操作"
          type="info"
          show-icon
          style="max-width: 500px; margin: 0 auto"
        />
      </div>

      <div v-else-if="currentClass.myCompletionRate < 100" style="text-align: center; padding: 40px; color: #999">
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
                @click="showChangeClassModal(cls)"
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
      @cancel="handleModalCancel"
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
            <li>提交后需要目标班级老师和当前班级老师共同审核</li>
            <li>双方老师都审核通过后才能成功换班</li>
            <li>换班后任务进度将重新计算</li>
          </ul>
        </template>
      </a-alert>
      <a-form style="margin-top: 16px">
        <a-form-item label="申请理由" required>
          <a-textarea
            v-model:value="changeReason"
            placeholder="请填写换班申请理由，这将同时发送给当前班级和目标班级的老师"
            :rows="3"
            :maxlength="200"
            show-count
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 换班申请状态提示（当有待审核的换班申请时显示） -->
    <a-card v-if="hasPendingChangeApplication" title="换班申请状态" style="margin-top: 20px">
      <a-alert
        type="info"
        show-icon
        style="margin-bottom: 16px"
      >
        <template #message>
          <span style="font-weight: bold;">您有正在审核中的换班申请</span>
        </template>
        <template #description>
          <div style="margin-top: 8px">
            <p>目标班级：<strong>{{ pendingChangeApplication.targetClassName }}</strong></p>
            <p>申请时间：{{ pendingChangeApplication.createTime }}</p>
            <p>申请理由：{{ pendingChangeApplication.reason }}</p>
          </div>
        </template>
      </a-alert>

      <a-divider>审核进度</a-divider>

      <a-steps :current="changeApprovalStep" size="small" style="margin: 20px 0">
        <a-step title="提交申请" :description="pendingChangeApplication.createTime" />
        <a-step
          title="当前班级审核"
          :status="pendingChangeApplication.sourceApproved === 2 ? 'error' : (pendingChangeApplication.sourceApproved === 1 ? 'finish' : 'wait')"
          :description="pendingChangeApplication.sourceApproved === 1 ? '已通过' : (pendingChangeApplication.sourceApproved === 2 ? '已拒绝' : '待审核')"
        />
        <a-step
          title="目标班级审核"
          :status="pendingChangeApplication.targetApproved === 2 ? 'error' : (pendingChangeApplication.targetApproved === 1 ? 'finish' : 'wait')"
          :description="pendingChangeApplication.targetApproved === 1 ? '已通过' : (pendingChangeApplication.targetApproved === 2 ? '已拒绝' : '待审核')"
        />
        <a-step title="换班完成" :status="changeApprovalStep === 3 ? 'finish' : 'wait'" />
      </a-steps>

      <!-- 被拒绝提示 -->
      <a-alert
        v-if="pendingChangeApplication.sourceApproved === 2 || pendingChangeApplication.targetApproved === 2"
        type="error"
        message="换班申请已被拒绝"
        :description="pendingChangeApplication.sourceApproved === 2 ? '当前班级老师拒绝了您的换班申请' : '目标班级老师拒绝了您的换班申请'"
        show-icon
        style="margin-top: 16px"
      />

      <div style="text-align: center; margin-top: 20px">
        <a-space>
          <a-button @click="handleCancelChangeApplication">撤回申请</a-button>
          <a-button type="primary" @click="goToMyClass">返回我的班级</a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Modal } from 'ant-design-vue'
import { UserOutlined, TeamOutlined, TrophyOutlined } from '@ant-design/icons-vue'
import {
  getMyClassInfo,
  getClassList,
  getClassStatus,
  applyChangeClass,
  cancelApplication
} from '@/services/student/smyclass.js'

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

// ========== 换班申请状态相关 ==========
const hasPendingChangeApplication = ref(false)
const pendingChangeApplication = ref({
  applicationId: null,
  targetClassId: null,
  targetClassName: '',
  reason: '',
  createTime: '',
  sourceApproved: 0,  // 0-待审核 1-已同意 2-已拒绝
  targetApproved: 0,   // 0-待审核 1-已同意 2-已拒绝
  status: 0
})

// 换班申请步骤计算
const changeApprovalStep = computed(() => {
  if (!hasPendingChangeApplication.value) return 0
  const app = pendingChangeApplication.value

  // 如果任一被拒绝
  if (app.sourceApproved === 2 || app.targetApproved === 2) {
    return app.sourceApproved === 2 ? 1 : 2
  }

  // 如果都通过了
  if (app.sourceApproved === 1 && app.targetApproved === 1) {
    return 3
  }

  // 第一个审核完成
  if (app.sourceApproved === 1 || app.targetApproved === 1) {
    return 2
  }

  return 1
})

// 换班申请理由
const changeReason = ref('')

// 加载可选班级列表
const fetchClassList = async (level) => {
  loading.value = true
  try {
    const res = await getClassList(level)
    if (res.code === 200) {
      allClasses.value = res.rows.map(item => ({
        id: item.classId || item.id,
        level: item.level,
        name: item.name,
        teacher: item.teacherName,
        studentCount: item.memberCount || item.studentCount,
        totalTasks: item.totalTasks || item.taskCount
      }))
    }
  } catch (error) {
    console.error('获取班级列表失败:', error)
    message.error('获取班级列表失败')
  } finally {
    loading.value = false
  }
}

// 加载换班申请状态
const loadChangeApplicationStatus = async () => {
  try {
    const res = await getClassStatus()
    if (res.code === 200 && res.data) {
      const data = res.data

      // 如果有待审核的换班申请
      if (data.status === 4 && data.pendingApplication) {
        hasPendingChangeApplication.value = true
        pendingChangeApplication.value = {
          applicationId: data.pendingApplication.applicationId,
          targetClassId: data.pendingApplication.targetClassId || data.pendingApplication.classId,
          targetClassName: data.pendingApplication.className || data.pendingApplication.targetClassName || '',
          reason: data.pendingApplication.reason || '',
          createTime: data.pendingApplication.createTime || '',
          sourceApproved: data.pendingApplication.sourceApproved ?? 0,
          targetApproved: data.pendingApplication.targetApproved ?? 0,
          status: data.pendingApplication.status ?? 0
        }
      } else {
        hasPendingChangeApplication.value = false
      }
    }
  } catch (error) {
    console.error('获取换班申请状态失败:', error)
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
    const res = await getMyClassInfo()
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
  // 加载换班申请状态
  await loadChangeApplicationStatus()
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

// 显示换班确认弹窗
const showChangeClassModal = (cls) => {
  // 如果有待审核的换班申请，不允许再次申请
  if (hasPendingChangeApplication.value) {
    message.warning('您有待审核的换班申请，请等待审核结果后再操作')
    return
  }

  selectedClass.value = cls
  changeReason.value = ''
  changeModalVisible.value = true
}

// 确认换班
const confirmChange = async () => {
  if (!selectedClass.value) return

  // 验证申请理由
  if (!changeReason.value || changeReason.value.trim() === '') {
    message.warning('请填写换班申请理由')
    return
  }

  if (changeReason.value.trim().length < 5) {
    message.warning('申请理由至少需要5个字符')
    return
  }

  submitLoading.value = true
  try {
    const res = await applyChangeClass(selectedClass.value.id, changeReason.value.trim())
    if (res.code === 200) {
      message.success('换班申请提交成功，需要双方老师共同审核')
      changeModalVisible.value = false

      // 刷新申请状态
      await loadChangeApplicationStatus()
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

// 取消换班申请
const handleCancelChangeApplication = () => {
  Modal.confirm({
    title: '确认撤回申请',
    content: '确定要撤回此次换班申请吗？撤回后可以重新提交申请。',
    okText: '确认撤回',
    cancelText: '取消',
    async onOk() {
      try {
        const res = await cancelApplication(pendingChangeApplication.value.applicationId)
        if (res.code === 200) {
          message.success('换班申请已撤回')
          hasPendingChangeApplication.value = false
        } else {
          message.error(res.msg || '撤回申请失败')
        }
      } catch (error) {
        console.error('撤回申请失败:', error)
        message.error('撤回申请失败，请稍后重试')
      }
    }
  })
}

// 处理弹窗取消
const handleModalCancel = () => {
  changeModalVisible.value = false
  changeReason.value = ''
}

// 返回我的班级
const goToMyClass = () => {
  router.push('/student/my-class')
}
</script>

<style scoped src="./change-class.css"></style>
