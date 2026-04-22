<template>
  <div class="my-class-container">
    <!-- 页面整体加载中 -->
    <div v-if="pageLoading" style="text-align: center; padding: 80px 0;">
      <a-spin size="large" tip="加载班级状态中..." />
    </div>

    <!-- 未入班状态：显示A/B/C/D级班级列表 -->
    <div v-else-if="!hasClass && currentStatus !== 1">
      <!-- 待审核申请提示 -->
      <div v-if="hasValidPendingApplication" class="pending-review-card">
        <div class="pending-review-icon">
          <a-avatar :size="56" style="background-color: #faad14">
            <template #icon><ClockCircleOutlined style="font-size: 28px" /></template>
          </a-avatar>
        </div>
        <div class="pending-review-content">
          <div class="pending-review-title">入班申请已提交，等待老师审核</div>
          <div class="pending-review-info">
            您已申请加入 <strong>{{ pendingApplication.className || '该班级' }}</strong>，
            请耐心等待班级老师审核，审核结果会通过系统通知您。
          </div>
          <div class="pending-review-time" v-if="pendingApplication.createTime">
            申请时间：{{ pendingApplication.createTime }}
          </div>
        </div>
        <div class="pending-review-tip">
          <a-alert
            message="温馨提示"
            description="在老师审核期间，您无法申请其他班级。请耐心等待审核结果。"
            type="info"
            show-icon
            style="margin-top: 8px"
          />
        </div>
      </div>

      <a-card v-else title="选择班级">
        <a-alert
          v-if="isFirstJoin"
          message="首次入班提示"
          description="您还未加入任何班级，请从以下班级中选择一个提交入班申请，等待老师审核。首次入班仅可选择D级班级。"
          type="info"
          show-icon
          style="margin-bottom: 20px"
        />
        <a-alert
          v-else-if="lastClassLevel"
          message="重新入班提示"
          :description="`您上次的班级等级为${lastClassLevel}级，只能选择${lastClassLevel}级或更低等级的班级。`"
          type="warning"
          show-icon
          style="margin-bottom: 20px"
        />
        <a-alert
          v-else
          message="选择班级"
          description="请从以下班级中选择一个提交入班申请，等待老师审核。"
          type="info"
          show-icon
          style="margin-bottom: 20px"
        />

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

        <a-row :gutter="[16, 16]">
          <a-col :span="24" v-if="loading" style="text-align: center; padding: 40px">
            <a-spin size="large" />
          </a-col>
          <a-col :span="24" v-else-if="filteredClasses.length === 0" style="text-align: center; padding: 40px; color: #999">
            <a-empty description="该等级暂无班级" />
          </a-col>
          <a-col :xs="24" :sm="12" :md="8" :lg="6" v-for="cls in filteredClasses" :key="cls.classId">
            <a-card hoverable class="class-card" @click="applyToClass(cls)">
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
                type="primary"
                block
                style="margin-top: 12px"
                :disabled="!canApplyClass(cls.level)"
              >
                {{ getApplyButtonText(cls.level) }}
              </a-button>
            </a-card>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <!-- 已入班状态：显示班级详情 -->
    <div v-else-if="hasClass && currentClassId">
      <a-card title="我的班级">
        <template #extra>
          <a-space>
            <a-button
              type="default"
              danger
              style="background-color: #fffbe6; border-color: #ffe58f; color: #d48806"
              @click="showExitModal"
            >
              退出班级
            </a-button>
            <a-button
              type="primary"
              @click="goToChangeClass"
            >
              班级中心
            </a-button>
          </a-space>
        </template>

        <a-descriptions bordered :column="3">
          <a-descriptions-item label="班级名称"> {{ currentClass.name }}</a-descriptions-item>
          <a-descriptions-item label="班级等级"> <a-tag :color="getLevelColor(currentClass.level)">{{ currentClass.level }}级</a-tag></a-descriptions-item>
          <a-descriptions-item label="授课老师">{{ currentClass.teacher }}</a-descriptions-item>
          <a-descriptions-item label="班级任务总数">{{ currentClass.taskCount }}</a-descriptions-item>
          <a-descriptions-item label="班级总人数">{{ currentClass.studentCount }}人</a-descriptions-item>
          <a-descriptions-item label="个人班级排名">第{{ currentClass.myRank }}名</a-descriptions-item>
          <a-descriptions-item label="班级任务平均完成率">{{ currentClass.avgCompletionRate }}%</a-descriptions-item>
          <a-descriptions-item label="我的任务完成率">
            <a-progress
              :percent="currentClass.myCompletionRate"
              :status="currentClass.myCompletionRate === 100 ? 'success' : 'active'"
            />
          </a-descriptions-item>
        </a-descriptions>

        <a-alert
          v-if="currentClass.myCompletionRate < 100"
          message="换班提示"
          :description="`您当前的任务完成率为 ${currentClass.myCompletionRate}%，需要完成 100% 的班级任务才能申请换班。`"
          type="warning"
          show-icon
          style="margin-top: 16px"
        />

        <a-divider>班级学习趋势（近8周）</a-divider>

        <a-row :gutter="16">
          <a-col :span="24">
            <div ref="trendChartRef" style="width: 100%; height: 350px;"></div>
          </a-col>
        </a-row>

        <a-divider>班级排行榜 Top 15</a-divider>

        <div class="rank-table-container">
          <a-table
            :columns="rankColumns"
            :data-source="topRankData"
            :pagination="false"
            size="middle"
            :scroll="{ y: 400 }"
            class="scrolling-table"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'rank'">
                <a-tag v-if="record.rank === 1" color="gold">&#x1F947; {{ record.rank }}</a-tag>
                <a-tag v-else-if="record.rank === 2" color="silver">&#x1F948; {{ record.rank }}</a-tag>
                <a-tag v-else-if="record.rank === 3" color="bronze">&#x1F949; {{ record.rank }}</a-tag>
                <span v-else>{{ record.rank }}</span>
              </template>
              <template v-if="column.key === 'name'">
                <span :style="{ fontWeight: record.isMe ? 'bold' : 'normal', color: record.isMe ? '#1890ff' : '' }">
                  {{ record.name }} {{ record.isMe ? '(我)' : '' }}
                </span>
              </template>
            </template>
          </a-table>
        </div>
      </a-card>
    </div>

    <!-- 入班申请确认弹窗 -->
    <a-modal
      v-model:open="applyModalVisible"
      title="确认入班申请"
      :confirm-loading="applyLoading"
      @ok="confirmApply"
      @cancel="handleApplyModalCancel"
      ok-text="提交申请"
      cancel-text="取消"
    >
      <p>您确定要申请加入 <strong>{{ selectedClass?.name }}</strong> 吗？</p>
      <a-alert
        message="入班说明"
        description="提交后需要等待目标班级老师审核通过才能正式入班。"
        type="info"
        show-icon
        style="margin: 12px 0"
      />
      <a-form style="margin-top: 16px">
        <a-form-item
          :label="isFirstJoin && selectedClass?.level === 'D' ? '申请理由（选填）' : '申请理由'"
          :required="!(isFirstJoin && selectedClass?.level === 'D')"
        >
          <a-textarea
            v-model:value="applyReason"
            :placeholder="isFirstJoin && selectedClass?.level === 'D' ? '首次加入D级班级可不填写理由' : '请填写入班申请理由'"
            :rows="3"
            :maxlength="200"
            show-count
          />
          <div style="color: #999; font-size: 12px; margin-top: 4px" v-if="isFirstJoin && selectedClass?.level === 'D'">
            提示：首次加入D级班级可不填写申请理由，其他情况必须填写
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 退出班级确认弹窗 -->
    <a-modal
      v-model:open="exitModalVisible"
      title="确认退出班级"
      :confirm-loading="exitLoading"
      @ok="confirmExit"
      @cancel="handleExitModalCancel"
      ok-text="提交退班申请"
      cancel-text="取消"
    >
      <a-alert
        message="退班说明"
        description="退出班级需要当前班级老师审核通过后才能生效。退出后您的学习进度将被清空，需要重新申请入班。"
        type="warning"
        show-icon
        style="margin-bottom: 16px"
      />
      <p>当前班级：<strong>{{ currentClass.name }}</strong></p>
      <a-form style="margin-top: 16px">
        <a-form-item label="退班原因" required>
          <a-textarea
            v-model:value="exitReason"
            placeholder="请填写退班原因，这将发送给当前班级的老师"
            :rows="3"
            :maxlength="200"
            show-count
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 待审核的退班/换班申请状态提示 -->
    <a-card v-if="hasPendingApplication && currentStatus !== 2" title="申请状态" style="margin-top: 20px">
      <!-- 退班申请状态 -->
      <template v-if="currentStatus === 3">
        <a-alert
          type="info"
          show-icon
          style="margin-bottom: 16px"
        >
          <template #message>
            <span style="font-weight: bold;">您有正在审核中的退班申请</span>
          </template>
          <template #description>
            <div style="margin-top: 8px">
              <p>申请时间：{{ pendingApplication.createTime }}</p>
              <p>退班原因：{{ pendingApplication.reason }}</p>
            </div>
          </template>
        </a-alert>

        <a-divider>审核进度</a-divider>

        <a-steps :current="1" size="small" style="margin: 20px 0">
          <a-step title="提交申请" :description="pendingApplication.createTime" />
          <a-step
            title="老师审核"
            :status="pendingApplication.teacherApproved === 1 ? 'finish' : (pendingApplication.teacherApproved === 2 ? 'error' : 'wait')"
            :description="pendingApplication.teacherApproved === 1 ? '已通过' : (pendingApplication.teacherApproved === 2 ? '已拒绝' : '待审核')"
          />
          <a-step title="退班完成" status="wait" />
        </a-steps>

        <!-- 被拒绝提示 -->
        <a-alert
          v-if="pendingApplication.teacherApproved === 2"
          type="error"
          message="退班申请已被拒绝"
          description="老师拒绝了您的退班申请，您可以继续在当前班级学习或再次提交退班申请"
          show-icon
          style="margin-top: 16px"
        />

        <div style="text-align: center; margin-top: 20px">
          <a-space>
            <a-button @click="handleCancelApplication">撤回申请</a-button>
          </a-space>
        </div>
      </template>

      <!-- 换班申请状态 -->
      <template v-else-if="currentStatus === 4">
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
              <p>目标班级：<strong>{{ pendingApplication.className }}</strong></p>
              <p>申请时间：{{ pendingApplication.createTime }}</p>
              <p>换班原因：{{ pendingApplication.reason }}</p>
            </div>
          </template>
        </a-alert>

        <a-divider>审核进度</a-divider>

        <a-steps :current="changeApprovalStep" size="small" style="margin: 20px 0">
          <a-step title="提交申请" :description="pendingApplication.createTime" />
          <a-step
            title="当前班级审核"
            :status="pendingApplication.sourceApproved === 2 ? 'error' : (pendingApplication.sourceApproved === 1 ? 'finish' : 'wait')"
            :description="pendingApplication.sourceApproved === 1 ? '已通过' : (pendingApplication.sourceApproved === 2 ? '已拒绝' : '待审核')"
          />
          <a-step
            title="目标班级审核"
            :status="pendingApplication.targetApproved === 2 ? 'error' : (pendingApplication.targetApproved === 1 ? 'finish' : 'wait')"
            :description="pendingApplication.targetApproved === 1 ? '已通过' : (pendingApplication.targetApproved === 2 ? '已拒绝' : '待审核')"
          />
          <a-step title="换班完成" :status="changeApprovalStep === 3 ? 'finish' : 'wait'" />
        </a-steps>

        <!-- 被拒绝提示 -->
        <a-alert
          v-if="pendingApplication.sourceApproved === 2 || pendingApplication.targetApproved === 2"
          type="error"
          message="换班申请已被拒绝"
          :description="pendingApplication.sourceApproved === 2 ? '当前班级老师拒绝了您的换班申请' : '目标班级老师拒绝了您的换班申请'"
          show-icon
          style="margin-top: 16px"
        />

        <div style="text-align: center; margin-top: 20px">
          <a-space>
            <a-button @click="handleCancelApplication">撤回申请</a-button>
            <a-button type="primary" @click="goToChangeClass">查看详情</a-button>
          </a-space>
        </div>
      </template>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, TeamOutlined, TrophyOutlined, ClockCircleOutlined } from '@ant-design/icons-vue'
import * as echarts from 'echarts'
import {
  getClassStatus,
  getClassList,
  getMyClassInfo,
  getClassRanking,
  getClassTrend,
  applyJoinClass,
  quitClass,
  cancelApplication
} from '@/services/student/smyclass.js'

const router = useRouter()

// 是否已加入班级
const hasClass = ref(false)

// 是否是首次入班（首次入班只能选D级）
const isFirstJoin = ref(true)

// 上一次班级等级
const lastClassLevel = ref(null)

// 选中的等级
const selectedLevel = ref('D')

// 加载状态
const loading = ref(false)

// 页面整体加载状态（用于状态判断期间）
const pageLoading = ref(true)

// 所有班级列表
const allClasses = ref([])

// 加载可选班级列表
const fetchClassList = async (level) => {
  loading.value = true
  try {
    const res = await getClassList(level)
    if (res.code === 200) {
      allClasses.value = res.rows.map(item => ({
        id: item.classId,
        level: item.level,
        name: item.name,
        teacher: item.teacherName,
        studentCount: item.memberCount,
        totalTasks: item.taskCount
      }))
    }
  } catch (error) {
    console.error('获取班级列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 监听等级切换，重新获取班级列表
const handleLevelChange = (level) => {
  selectedLevel.value = level
  fetchClassList(level)
}

// 根据选中等级过滤班级
const filteredClasses = computed(() => {
  return allClasses.value.filter(cls => cls.level === selectedLevel.value)
})

// D级班级列表
const dLevelClasses = computed(() => {
  return allClasses.value.filter(cls => cls.level === 'D')
})

// 当前班级信息
const currentClass = ref({
  level: '',
  name: '',
  teacher: '',
  studentCount: 0,
  myRank: 0,
  taskCount: 0,
  avgCompletionRate: 0,
  myCompletionRate: 0,
  totalTasks: 0,
  completedTasks: 0
})

// 班级状态枚举
const ClassStatus = {
  NO_CLASS: 0,
  JOINED: 1,
  APPLYING_JOIN: 2,
  APPLYING_QUIT: 3,
  APPLYING_CHANGE: 4
}

// 加载学生班级状态
const loadClassStatus = async () => {
  try {
    const res = await getClassStatus()
    if (res.code === 200 && res.data) {
      const data = res.data
      const status = data.status
      currentStatus.value = status
      isFirstJoin.value = data.isFirstJoin
      lastClassLevel.value = data.lastClassLevel || null

      if (status === 1 && data.currentClassId) {
        hasClass.value = true
        currentClassId.value = data.currentClassId
        currentClassName.value = data.currentClassName
        await loadMyClassInfo()
      } else if (status === 2) {
        hasClass.value = false
        currentClassId.value = null
        currentClassName.value = null
        pendingApplication.value = data.pendingApplication || null
      } else if (status === 3) {
        hasClass.value = true
        await loadMyClassInfo()
        pendingApplication.value = data.pendingApplication || null
      } else if (status === 4) {
        hasClass.value = true
        await loadMyClassInfo()
        pendingApplication.value = data.pendingApplication || null
      } else {
        hasClass.value = false
        currentClassId.value = null
        currentClassName.value = null
        pendingApplication.value = null
      }
      pageLoading.value = false
    }
  } catch (error) {
    console.error('获取班级状态失败:', error)
    pageLoading.value = false
  }
}

// 当前班级ID
const currentClassId = ref(null)
const currentClassName = ref(null)

// 当前状态原始值（用于精确判断）
const currentStatus = ref(0)

// 加载我的班级信息
const loadMyClassInfo = async () => {
  try {
    const res = await getMyClassInfo()
    if (res.code === 200 && res.data) {
      const data = res.data
      currentClass.value = {
        level: data.classLevel || '',
        name: data.className || '',
        teacher: data.teacherName || '',
        studentCount: data.memberCount || 0,
        myRank: data.myRank || 0,
        taskCount: data.totalTasks || 0,
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

// 是否可以换班
const canChangeClass = computed(() => currentClass.value.myCompletionRate === 100)

// 待审核申请信息
const pendingApplication = ref(null)

// 是否有有效的待审核申请（对象存在且有 classId）
const hasValidPendingApplication = computed(() => {
  return pendingApplication.value && pendingApplication.value.classId
})

// 是否有待审核的退班/换班申请
const hasPendingApplication = computed(() => {
  return currentStatus.value === 3 || currentStatus.value === 4
})

// 换班申请步骤计算
const changeApprovalStep = computed(() => {
  if (!pendingApplication.value) return 0
  const app = pendingApplication.value
  if (app.sourceApproved === 2 || app.targetApproved === 2) {
    return app.sourceApproved === 2 ? 1 : 2
  }
  if (app.sourceApproved === 1 && app.targetApproved === 1) {
    return 3
  }
  if (app.sourceApproved === 1 || app.targetApproved === 1) {
    return 2
  }
  return 1
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

// 等级排序
const levelOrder = { A: 4, B: 3, C: 2, D: 1 }

// 判断是否可以申请该班级
const canApplyClass = (classLevel) => {
  if (isFirstJoin.value) {
    return classLevel === 'D'
  }

  if (lastClassLevel.value) {
    return levelOrder[classLevel] <= levelOrder[lastClassLevel.value]
  }

  return true
}

// 获取申请按钮文字
const getApplyButtonText = (classLevel) => {
  if (isFirstJoin.value && classLevel !== 'D') {
    return '首次仅可选D级'
  }

  if (lastClassLevel.value && levelOrder[classLevel] > levelOrder[lastClassLevel.value]) {
    return '等级不符'
  }

  return '申请入班'
}

// 排行榜列配置
const rankColumns = [
  { title: '排名', dataIndex: 'rank', key: 'rank', width: 80 },
  { title: '姓名', dataIndex: 'name', key: 'name' },
  { title: '任务完成率', dataIndex: 'completionRate', key: 'completionRate', width: 120 },
  { title: '做题数', dataIndex: 'questionCount', key: 'questionCount', width: 100 },
]

// 排行榜数据
const topRankData = ref([])

// 获取当前用户ID
const getCurrentUserId = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    return userInfo.userId
  }
  return null
}

// 加载班级排行榜
const loadClassRanking = async () => {
  try {
    const res = await getClassRanking()
    if (res.code === 200 && res.data) {
      const currentUserId = getCurrentUserId()
      topRankData.value = res.data.map((item, index) => ({
        key: String(index + 1),
        rank: item.rank || index + 1,
        name: item.name || '',
        completionRate: item.taskCompletionRate !== undefined ? `${item.taskCompletionRate}%` : '0%',
        questionCount: item.questionCount || 0,
        userId: item.userId,
        isMe: item.isMe || (item.userId && currentUserId && item.userId === currentUserId)
      }))
    }
  } catch (error) {
    console.error('获取班级排行榜失败:', error)
  }
}

// 轮播相关
const currentIndex = ref(0)
const itemsPerPage = 5
let carouselTimer = null
let scrollTimer = null

// 趋势图表
const trendChartRef = ref(null)

// 趋势数据
const trendData = ref({
  weeks: [],
  classAvg: [],
  myData: [],
  wrongCount: []
})

// 加载班级学习趋势
const loadClassTrend = async () => {
  try {
    const res = await getClassTrend()
    if (res.code === 200 && res.data) {
      trendData.value = {
        weeks: res.data.weeks || [],
        classAvg: res.data.classAvg || [],
        myData: res.data.myData || [],
        wrongCount: res.data.wrongCount || []
      }
    }
  } catch (error) {
    console.error('获取学习趋势失败:', error)
  }
}

// 初始化趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) return

  const chart = echarts.init(trendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['班级平均做题数', '我的做题数', '班级错题数'],
      bottom: 0,
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.value.weeks.length > 0 ? trendData.value.weeks : ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
    },
    yAxis: {
      type: 'value',
      name: '题数',
    },
    series: [
      {
        name: '班级平均做题数',
        type: 'line',
        data: trendData.value.classAvg.length > 0 ? trendData.value.classAvg : [45, 52, 58, 63, 70, 75, 82, 88],
        smooth: true,
        itemStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' },
          ]),
        },
      },
      {
        name: '我的做题数',
        type: 'line',
        data: trendData.value.myData.length > 0 ? trendData.value.myData : [50, 58, 65, 72, 80, 88, 95, 102],
        smooth: true,
        itemStyle: {
          color: '#52c41a',
        },
      },
      {
        name: '班级错题数',
        type: 'line',
        data: trendData.value.wrongCount.length > 0 ? trendData.value.wrongCount : [12, 15, 18, 20, 22, 25, 28, 30],
        smooth: true,
        itemStyle: {
          color: '#ff4d4f',
        },
      },
    ],
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 当前显示的数据
const displayRankData = computed(() => {
  const data = []
  for (let i = 0; i < itemsPerPage; i++) {
    const index = (currentIndex.value + i) % topRankData.value.length
    data.push(topRankData.value[index])
  }
  return data
})

// 启动表格自动滚动
const startTableScroll = () => {
  nextTick(() => {
    const tableBody = document.querySelector('.scrolling-table .ant-table-body')
    if (!tableBody) return

    let scrollTop = 0
    const scrollStep = 1
    const scrollInterval = 50

    scrollTimer = setInterval(() => {
      scrollTop += scrollStep
      tableBody.scrollTop = scrollTop

      if (tableBody.scrollTop >= tableBody.scrollHeight - tableBody.clientHeight) {
        scrollTop = 0
        tableBody.scrollTop = 0
      }
    }, scrollInterval)
  })
}

// 启动轮播
const startCarousel = () => {
  carouselTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % topRankData.value.length
  }, 3000)
}

// 停止轮播
const stopCarousel = () => {
  if (carouselTimer) {
    clearInterval(carouselTimer)
    carouselTimer = null
  }
}

// 停止表格滚动
const stopTableScroll = () => {
  if (scrollTimer) {
    clearInterval(scrollTimer)
    scrollTimer = null
  }
}

// 入班申请相关
const applyModalVisible = ref(false)
const applyLoading = ref(false)
const selectedClass = ref(null)
const applyReason = ref('')

const applyToClass = (cls) => {
  if (hasValidPendingApplication.value) {
    message.warning('您有待审核的申请，请等待审核结果后再操作')
    return
  }

  if (!canApplyClass(cls.level)) {
    message.warning('您当前的条件不符合进入该班级')
    return
  }

  selectedClass.value = cls
  applyReason.value = ''
  applyModalVisible.value = true
}

const handleApplyModalCancel = () => {
  applyModalVisible.value = false
  applyReason.value = ''
}

const confirmApply = async () => {
  if (!selectedClass.value) return

  // 验证申请理由（非首次入D级班级必须填写）
  const isFirstJoinD = isFirstJoin.value && selectedClass.value.level === 'D'
  if (!isFirstJoinD) {
    if (!applyReason.value || applyReason.value.trim() === '') {
      message.warning('请填写入班申请理由')
      return
    }
    if (applyReason.value.trim().length < 5) {
      message.warning('申请理由至少需要5个字符')
      return
    }
  }

  applyLoading.value = true
  try {
    const res = await applyJoinClass(
      selectedClass.value.classId || selectedClass.value.id,
      applyReason.value.trim(),
      isFirstJoinD
    )
    if (res.code === 200) {
      message.success('入班申请已提交，请耐心等待老师审核！')
      applyModalVisible.value = false

      // 刷新班级状态，不自动切换到已入班视图
      await loadClassStatus()
    } else {
      message.error(res.msg || '入班申请提交失败')
    }
  } catch (error) {
    console.error('入班申请失败:', error)
    message.error('入班申请失败，请稍后重试')
  } finally {
    applyLoading.value = false
  }
}

// 退出班级相关
const exitModalVisible = ref(false)
const exitLoading = ref(false)
const exitReason = ref('')

const showExitModal = () => {
  exitReason.value = ''
  exitModalVisible.value = true
}

const handleExitModalCancel = () => {
  exitModalVisible.value = false
  exitReason.value = ''
}

const confirmExit = async () => {
  if (!exitReason.value || exitReason.value.trim() === '') {
    message.warning('请填写退班原因')
    return
  }
  if (exitReason.value.trim().length < 5) {
    message.warning('退班原因至少需要5个字符')
    return
  }
  exitLoading.value = true
  try {
    const res = await quitClass(exitReason.value.trim())
    if (res && (res.code === 200 || res.code === '200')) {
      message.success('退班申请已提交，请等待老师审核')
      exitModalVisible.value = false
      await loadClassStatus()
    } else {
      message.error(res?.msg || '退班申请提交失败')
    }
  } catch (error) {
    console.error('退班申请失败:', error)
    message.error('退班申请失败，请稍后重试')
  } finally {
    exitLoading.value = false
  }
}

const handleCancelApplication = async () => {
  if (!pendingApplication.value || !pendingApplication.value.applicationId) {
    message.warning('无法取消申请')
    return
  }
  try {
    const res = await cancelApplication(pendingApplication.value.applicationId)
    if (res.code === 200) {
      message.success('申请已撤回')
      pendingApplication.value = null
      await loadClassStatus()
    } else {
      message.error(res.msg || '撤回申请失败')
    }
  } catch (error) {
    console.error('撤回申请失败:', error)
    message.error('撤回申请失败，请稍后重试')
  }
}

// 跳转到换班中心
const goToChangeClass = () => {
  router.push('/student/change-class')
}

// 生命周期
onMounted(async () => {
  await loadClassStatus()

  if (hasClass.value) {
    // 加载排行榜和图表
    await loadClassRanking()
    await loadClassTrend()
    initTrendChart()
    startTableScroll()
  } else {
    await fetchClassList(selectedLevel.value)
  }
})

onUnmounted(() => {
  stopCarousel()
  stopTableScroll()
})
</script>

<style scoped src="./my-class.css"></style>
