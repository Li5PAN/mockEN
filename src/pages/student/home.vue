<template>
  <div class="student-home">
    <!-- 第一层：学习概览 + 日历打卡 + 未完成任务 + 班级进度 -->
    <a-row :gutter="16">
      <!-- 学习概览 -->
      <a-col :span="6">
        <a-card title="学习概览" :bordered="false" class="overview-card">
          <div class="overview-item">
            <div class="overview-icon" style="background: #e6f7ff;">
              <BookOutlined style="color: #1890ff; font-size: 24px;" />
            </div>
            <div class="overview-content">
              <div class="overview-title">单词学习</div>
              <div class="overview-value">今日已学 <strong>{{ todayWords }}</strong> 个单词</div>
              <div class="overview-tip">继续学习，完成今日目标</div>
            </div>
          </div>

          <div class="overview-item">
            <div class="overview-icon" style="background: #fff1f0;">
              <FileTextOutlined style="color: #f5222d; font-size: 24px;" />
            </div>
            <div class="overview-content">
              <div class="overview-title">错题查看</div>
              <div class="overview-value">错题本共 <strong>{{ errorCount }}</strong> 道题目</div>
              <div class="overview-tip">复习错题，巩固记忆</div>
            </div>
          </div>

          <div class="overview-item">
            <div class="overview-icon" style="background: #f6ffed;">
              <TeamOutlined style="color: #52c41a; font-size: 24px;" />
            </div>
            <div class="overview-content">
              <div class="overview-title">我的班级</div>
              <div class="overview-value">班级排名 <strong>第{{ myRank }}名</strong></div>
              <div class="overview-tip">查看班级学习情况</div>
            </div>
          </div>

          <div class="overview-item">
            <div class="overview-icon" style="background: #fffbe6;">
              <CheckSquareOutlined style="color: #faad14; font-size: 24px;" />
            </div>
            <div class="overview-content">
              <div class="overview-title">我的任务</div>
              <div class="overview-value">待完成 <strong>{{ pendingTasksCount }}</strong> 个任务</div>
              <div class="overview-tip">完成任务，获得奖励</div>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- 日历打卡 -->
      <a-col :span="10">
        <a-card title="学习打卡" :bordered="false" class="calendar-card">
          <a-calendar 
            v-model:value="calendarValue"
            :fullscreen="false" 
            @select="onDateSelect"
            @panelChange="onPanelChange"
          >
            <template #dateFullCellRender="{ current }">
              <div 
                class="calendar-date-cell"
                :class="{
                  'checked-in': isCheckedInDate(current),
                  'not-checked-in': isCurrentMonth(current) && !isCheckedInDate(current) && isPastOrToday(current)
                }"
              >
                <span class="date-number">{{ dayjs(current).date() }}</span>
              </div>
            </template>
          </a-calendar>
          <div class="check-in-footer">
            <a-button 
              type="primary" 
              :disabled="isCheckedIn"
              @click="handleCheckIn"
              block
            >
              <template #icon>
                <CheckCircleOutlined v-if="isCheckedIn" />
                <ClockCircleOutlined v-else />
              </template>
              {{ isCheckedIn ? '今日已打卡' : '立即打卡' }}
            </a-button>
            <div class="check-stats">
              <span>连续打卡 <strong>{{ checkInStats.continuousDays }}</strong> 天</span>
              <span>累计打卡 <strong>{{ checkInStats.totalDays }}</strong> 天</span>
            </div>
          </div>
        </a-card>
      </a-col>

      <!-- 未完成任务列表 -->
      <a-col :span="8">
        <a-card title="未完成任务" :bordered="false" class="pending-tasks-card">
          <template #extra>
            <a @click="$router.push('/student/my-tasks')">查看全部</a>
          </template>
          <a-list :data-source="pendingTasksList" size="small" class="task-list">
            <template #renderItem="{ item }">
              <a-list-item class="task-item">
                <div class="task-content">
                  <div class="task-title-row">
                    <span class="task-title">{{ item.title }}</span>
                  </div>
                  <div class="task-info-row">
                    <span class="task-deadline">截止：{{ item.deadline }}</span>
                    <a-tag :color="getTaskUrgencyColor(item.deadline)" class="task-urgency-tag">
                      {{ getTaskUrgency(item.deadline) }}
                    </a-tag>
                  </div>
                </div>
              </a-list-item>
            </template>
          </a-list>
          
          <!-- 消息通知 - 班级申请审核结果 -->
          <a-divider style="margin: 12px 0;">消息通知</a-divider>
          <div class="notification-list">
            <div
              v-for="item in classNotifications"
              :key="item.id"
              class="notification-item"
              :class="item.status"
            >
              <div class="notification-header">
                <span class="notification-type">
                  <a-tag :color="getNotificationTagColor(item.type)">{{ getNotificationTypeText(item.type) }}</a-tag>
                </span>
                <span class="notification-time">{{ item.time }}</span>
              </div>
              <div class="notification-content">
                {{ item.content }}
              </div>
              <div class="notification-status">
                <a-tag v-if="item.status === 'approved'" color="success">
                  <template #icon><CheckCircleOutlined /></template>
                  已通过
                </a-tag>
                <a-tag v-else-if="item.status === 'rejected'" color="error">
                  <template #icon><CloseCircleOutlined /></template>
                  未通过
                </a-tag>
                <a-tag v-else color="processing">
                  <template #icon><ClockCircleOutlined /></template>
                  处理中
                </a-tag>
                <span v-if="item.reason" class="notification-reason">原因：{{ item.reason }}</span>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 第二层：每日任务完成图表 + 单词学习趋势图 -->
    <a-row :gutter="16" style="margin-top: 16px;">
      <!-- 每日任务完成题数统计 -->
      <a-col :span="12">
        <a-card title="近7天任务完成情况" :bordered="false">
          <div ref="taskChartRef" style="width: 100%; height: 350px;"></div>
        </a-card>
      </a-col>

      <!-- 单词学习趋势 -->
      <a-col :span="12">
        <a-card title="单词学习趋势" :bordered="false">
          <div ref="wordTrendChartRef" style="width: 100%; height: 350px;"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 第三层：快捷入口按钮 -->
    <a-row :gutter="16" style="margin-top: 16px;">
      <a-col :span="6">
        <a-button 
          type="primary" 
          size="large" 
          block 
          class="quick-btn"
          @click="$router.push('/student/word-learn')"
        >
          <BookOutlined />
          单词学习
        </a-button>
      </a-col>
      <a-col :span="6">
        <a-button 
          type="primary" 
          size="large" 
          block 
          class="quick-btn"
          danger
          @click="$router.push('/student/my-errors')"
        >
          <FileTextOutlined />
          错题查看
        </a-button>
      </a-col>
      <a-col :span="6">
        <a-button 
          type="primary" 
          size="large" 
          block 
          class="quick-btn"
          style="background: #52c41a; border-color: #52c41a;"
          @click="$router.push('/student/my-class')"
        >
          <TeamOutlined />
          我的班级
        </a-button>
      </a-col>
      <a-col :span="6">
        <a-button 
          type="primary" 
          size="large" 
          block 
          class="quick-btn"
          style="background: #faad14; border-color: #faad14;"
          @click="$router.push('/student/my-tasks')"
        >
          <CheckSquareOutlined />
          我的任务
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import {
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  CheckSquareOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons-vue'
import {
  getStudentOverview,
  getClockInStatus,
  clockIn,
  getWeeklyTasks,
  getWeeklyWords,
  getPendingTasks,
  getClassProgress,
  getClassNotifications
} from '../../services/student/sindex.js'
import { getCurrentWordCount } from '../../utils/wordCount.js'

// 打卡相关数据
const checkInStats = ref({
  continuousDays: 0,
  totalDays: 0,
})

// 今日是否已打卡
const isCheckedIn = ref(false)

// 打卡日期记录（从 localStorage 加载历史记录）
const checkedInDates = ref(JSON.parse(localStorage.getItem('clockInDates') || '[]'))

// 保存打卡日期到 localStorage
const saveCheckedInDates = () => {
  localStorage.setItem('clockInDates', JSON.stringify(checkedInDates.value))
}

// 当前日历显示的月份
const calendarValue = ref(dayjs())

// 判断某个日期是否已打卡
const isCheckedInDate = (date) => {
  const dateStr = dayjs(date).format('YYYY-MM-DD')
  const today = dayjs().format('YYYY-MM-DD')
  if (dateStr === today) return isCheckedIn.value
  return checkedInDates.value.includes(dateStr)
}

// 判断是否为日历当前显示的月份
const isCurrentMonth = (date) => {
  return dayjs(date).month() === calendarValue.value.month() && dayjs(date).year() === calendarValue.value.year()
}

// 判断是否为过去或今天的日期
const isPastOrToday = (date) => {
  return dayjs(date).startOf('day').isBefore(dayjs().endOf('day'))
}

// 日历面板变化（切换月份/年份）
const onPanelChange = (value) => {
  calendarValue.value = value
}

// 日期选择
const onDateSelect = (date) => {
  calendarValue.value = date
}

// 打卡功能
const handleCheckIn = async () => {
  try {
    const res = await clockIn()
    if (res && res.code === 200) {
      message.success('打卡成功！连续打卡' + res.data.consecutiveDays + '天')
      isCheckedIn.value = true
      checkInStats.value = res.data
    }
  } catch (error) {
    message.error('打卡失败，请重试')
  }
}

// 未完成任务列表
const pendingTasksList = ref([
  {
    id: 1,
    title: '第三单元单词测试',
    deadline: '2026-04-25',
    questionCount: 50,
  },
  {
    id: 2,
    title: '阅读理解练习',
    deadline: '2026-04-28',
    questionCount: 30,
  },
  {
    id: 3,
    title: '单词听写',
    deadline: '2026-04-30',
    questionCount: 40,
  },
  {
    id: 4,
    title: '语法练习',
    deadline: '2026-05-05',
    questionCount: 25,
  },
])

// 班级消息通知（入班/退班/换班审核结果）
const classNotifications = ref([])

const getNotificationTypeText = (type) => {
  const map = { '1': '入班申请', '2': '退班申请', '3': '换班申请' }
  return map[type] || type
}

const getNotificationTagColor = (type) => {
  const map = { '1': 'blue', '2': 'orange', '3': 'purple' }
  return map[type] || 'default'
}

// 获取班级申请审核通知
const fetchClassNotifications = async () => {
  try {
    const res = await getClassNotifications()
    if (res && res.code === 200 && res.data) {
      classNotifications.value = res.data.map(item => ({
        id: item.id,
        type: item.type,
        typeText: item.typeText,
        status: item.status,
        content: item.content,
        reason: item.reason,
        myReason: item.myReason,
        time: item.updateTime ? item.updateTime.slice(0, 16).replace('T', ' ') : item.createTime.slice(0, 16).replace('T', ' '),
      }))
    }
  } catch (error) {
    console.error('获取班级申请审核通知失败:', error)
  }
}

// 班级任务完成进度（整体）
const classProgress = ref({
  completed: 12,
  total: 18,
  rate: 67,
})

const classRanking = ref(3)
const totalClasses = ref(8)

const getProgressColor = (rate) => {
  if (rate >= 80) return '#52c41a'
  if (rate >= 50) return '#1890ff'
  return '#faad14'
}

const getTaskUrgency = (deadline) => {
  const today = new Date()
  const deadlineDate = new Date(deadline)
  const diffMilliseconds = deadlineDate - today
  const diffHours = diffMilliseconds / (1000 * 60 * 60)
  const diffDays = diffMilliseconds / (1000 * 60 * 60 * 24)
  
  if (diffHours < 12) return '紧急'
  if (diffDays <= 2) return '即将到期'
  if (diffDays <= 4) return '正常'
  return '充裕'
}

const getTaskUrgencyColor = (deadline) => {
  const urgency = getTaskUrgency(deadline)
  if (urgency === '紧急') return 'red'
  if (urgency === '即将到期') return 'orange'
  if (urgency === '正常') return 'green'
  return 'blue'
}

// 每日任务完成图表
const taskChartRef = ref(null)
const initTaskChart = async () => {
  let dates = []
  let counts = []
  try {
    const res = await getWeeklyTasks()
    if (res && res.data && res.data.length) {
      dates = res.data.map(item => item.date.slice(5))
      counts = res.data.map(item => item.completedCount)
    }
  } catch (error) {
    console.error('获取近7天任务完成情况失败:', error)
  }

  const chart = echarts.init(taskChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        interval: 0,
      },
    },
    yAxis: {
      type: 'value',
      name: '完成题数',
    },
    series: [
      {
        name: '完成题数',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' },
            ]),
          },
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}题',
        },
      },
    ],
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 单词学习趋势图表
const wordTrendChartRef = ref(null)
const initWordTrendChart = async () => {
  let dates = []
  let counts = []
  try {
    const res = await getWeeklyWords()
    if (res && res.data && res.data.length) {
      dates = res.data.map(item => item.date.slice(5))
      counts = res.data.map(item => item.masteredCount)
    }
  } catch (error) {
    console.error('获取单词学习趋势失败:', error)
  }

  const chart = echarts.init(wordTrendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates,
    },
    yAxis: {
      type: 'value',
      name: '学习单词数',
    },
    series: [
      {
        name: '学习单词数',
        type: 'line',
        data: counts,
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
        label: {
          show: true,
          position: 'top',
          formatter: '{c}',
        },
      },
    ],
  }
  chart.setOption(option)
  window.addEventListener('resize', () => chart.resize())
}

// 快捷功能数据
const todayWords = ref(getCurrentWordCount())
const errorCount = ref(0)
const myRank = ref(0)
const pendingTasksCount = ref(0)
const todayStudyMinutes = ref(0)
const todayTasksCompleted = ref(0)

// 获取未完成任务列表
const fetchPendingTasks = async () => {
  try {
    const res = await getPendingTasks()
    if (res && res.code === 200 && res.data) {
      pendingTasksList.value = res.data.map(task => ({
        id: task.id,
        title: task.title,
        deadline: task.deadline,
        questionCount: task.questionCount,
        urgency: task.urgency
      }))
    }
  } catch (error) {
    console.error('获取未完成任务列表失败:', error)
  }
}

// 获取班级任务完成进度
const fetchClassProgress = async () => {
  try {
    const res = await getClassProgress()
    if (res && res.code === 200 && res.data) {
      classProgress.value = {
        completed: res.data.completed,
        total: res.data.total,
        rate: res.data.rate
      }
      classRanking.value = res.data.ranking
      totalClasses.value = res.data.totalClasses
    }
  } catch (error) {
    console.error('获取班级任务完成进度失败:', error)
  }
}

// 获取学习概览数据
const fetchOverview = async () => {
  try {
    const res = await getStudentOverview()
    if (res && res.code === 200 && res.data) {
      errorCount.value = res.data.totalWrongQuestions ?? 0
      myRank.value = res.data.classRank ?? 0
      pendingTasksCount.value = res.data.pendingTasks ?? 0
      todayStudyMinutes.value = res.data.todayStudyMinutes ?? 0
      todayTasksCompleted.value = res.data.todayTasksCompleted ?? 0
    }
  } catch (error) {
    console.error('获取学习概览失败:', error)
  }
}

// 初始化打卡状态
const fetchClockInStatus = async () => {
  try {
    const res = await getClockInStatus()
    if (res && res.code === 200 && res.data) {
      isCheckedIn.value = res.data.clockedIn ?? false
      checkInStats.value.continuousDays = res.data.consecutiveDays ?? 0
      checkInStats.value.totalDays = res.data.totalDays ?? 0
      checkedInDates.value = res.data.clockInDates || []
      saveCheckedInDates()
    }
  } catch (error) {
    console.error('获取打卡状态失败:', error)
  }
}

// 刷新今日单词计数
const refreshTodayWords = () => {
  todayWords.value = getCurrentWordCount()
}

// 定时器ID
let refreshTimer = null

// 上次检查的日期（用于检测跨天）
let lastCheckedDate = dayjs().format('YYYY-MM-DD')

// 检测日期变化并刷新打卡状态
const checkDateChange = () => {
  const today = dayjs().format('YYYY-MM-DD')
  if (today !== lastCheckedDate) {
    lastCheckedDate = today
    fetchClockInStatus()
    fetchOverview()
  }
}

onMounted(() => {
  fetchOverview()
  fetchClockInStatus()
  fetchPendingTasks()
  fetchClassProgress()
  fetchClassNotifications()
  initTaskChart()
  initWordTrendChart()
  
  refreshTodayWords()
  
  // 每分钟检查一次日期变化
  refreshTimer = setInterval(() => {
    refreshTodayWords()
    checkDateChange()
  }, 60000) // 改为60秒，同时检查日期变化
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<style scoped src="./home.css"></style>
