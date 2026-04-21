<template>
  <div class="teacher-home-container">
    <!-- 核心数据统计卡片 -->
    <div class="statistics-section">
      <a-row :gutter="16">
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable>
            <a-statistic 
              title="学生总人数" 
              :value="statistics.totalStudents" 
              suffix="人"
              :value-style="{ color: '#1890ff' }"
            >
              <template #prefix>
                <TeamOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable>
            <a-statistic 
              title="班级总数" 
              :value="statistics.totalClasses" 
              suffix="个"
              :value-style="{ color: '#52c41a' }"
            >
              <template #prefix>
                <HomeOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable class="pending-card">
            <a-statistic 
              title="待审核申请数" 
              :value="statistics.pendingReviews" 
              suffix="个"
              :value-style="{ color: '#cf1322' }"
            >
              <template #prefix>
                <BellOutlined />
              </template>
            </a-statistic>
            <a-badge :count="statistics.pendingReviews" :offset="[10, -10]" />
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :md="6">
          <a-card hoverable>
            <a-statistic 
              title="待完成任务数" 
              :value="statistics.pendingTasks" 
              suffix="个"
              :value-style="{ color: '#faad14' }"
            >
              <template #prefix>
                <FileTextOutlined />
              </template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>
    </div>

    <!-- 快捷操作入口 -->
    <div class="quick-actions-section">
      <a-card title="快捷操作" :bordered="false">
        <a-row :gutter="16">
          <a-col :xs="24" :sm="8">
            <div class="action-card" @click="goToPublishTask">
              <div class="action-icon" style="background: #1890ff;">
                <PlusCircleOutlined />
              </div>
              <div class="action-content">
                <h3>快速发布任务</h3>
                <p>为班级发布新的学习任务</p>
              </div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="8">
            <div class="action-card" @click="goToReview">
              <div class="action-icon" style="background: #cf1322;">
                <CheckCircleOutlined />
              </div>
              <div class="action-content">
                <div class="action-title-wrapper">
                  <h3>查看待审核申请</h3>
                  <a-badge :count="statistics.pendingReviews" />
                </div>
                <p>处理学生的入班、换班申请</p>
              </div>
            </div>
          </a-col>
          <a-col :xs="24" :sm="8">
            <div class="action-card" @click="goToErrors">
              <div class="action-icon" style="background: #faad14;">
                <WarningOutlined />
              </div>
              <div class="action-content">
                <h3>查看最近错题</h3>
                <p>分析学生的错题情况</p>
              </div>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <!-- 图表可视化区域 -->
    <div class="charts-section">
      <a-row :gutter="[16, 16]">
        <!-- 各班级任务完成率对比 -->
        <a-col :xs="24" :lg="12">
          <a-card title="各班级任务完成率对比" :bordered="false">
            <div ref="taskCompletionChart" style="width: 100%; height: 350px;"></div>
          </a-card>
        </a-col>

        <!-- 学生活跃度趋势 -->
        <a-col :xs="24" :lg="12">
          <a-card title="学生活跃度趋势（最近7天）" :bordered="false">
            <div ref="activityTrendChart" style="width: 100%; height: 350px;"></div>
          </a-card>
        </a-col>

        <!-- 错题类型分布 -->
        <a-col :xs="24" :lg="12">
          <a-card title="错题类型分布" :bordered="false">
            <div ref="errorTypeChart" style="width: 100%; height: 350px;"></div>
          </a-card>
        </a-col>

        <!-- 班级等级分布 -->
        <a-col :xs="24" :lg="12">
          <a-card title="班级等级分布" :bordered="false">
            <div ref="classLevelChart" style="width: 100%; height: 350px;"></div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { message } from 'ant-design-vue'
import TeamOutlined from '@ant-design/icons-vue/TeamOutlined'
import HomeOutlined from '@ant-design/icons-vue/HomeOutlined'
import BellOutlined from '@ant-design/icons-vue/BellOutlined'
import FileTextOutlined from '@ant-design/icons-vue/FileTextOutlined'
import PlusCircleOutlined from '@ant-design/icons-vue/PlusCircleOutlined'
import CheckCircleOutlined from '@ant-design/icons-vue/CheckCircleOutlined'
import WarningOutlined from '@ant-design/icons-vue/WarningOutlined'
// 使用真实接口
import {
  getTeacherDashboard,
  getLevelDistribution,
  getTaskCompletion,
  getActivityTrend,
  getErrorTypeDistribution
} from '@/services/teacher/ttindex'

const router = useRouter()

// 核心统计数据
const statistics = reactive({
  totalStudents: 0,
  totalClasses: 0,
  pendingReviews: 0,
  pendingTasks: 0
})

// 获取教师首页数据
const fetchDashboardData = async () => {
  try {
    const res = await getTeacherDashboard()
    if (res && res.code === 200) {
      statistics.totalStudents = res.data.totalStudents || 0
      statistics.totalClasses = res.data.totalClasses || 0
      statistics.pendingReviews = res.data.pendingApplications || 0
      statistics.pendingTasks = res.data.pendingTasks || 0
    }
  } catch (error) {
    console.error('获取教师首页数据失败:', error)
    message.error('获取首页数据失败')
  }
}

// 获取班级等级分布数据
const fetchLevelDistribution = async () => {
  try {
    const res = await getLevelDistribution()
    if (res && res.code === 200 && Array.isArray(res.data)) {
      return res.data
    }
    return []
  } catch (error) {
    console.error('获取班级等级分布数据失败:', error)
    return []
  }
}

// 获取任务完成率数据
const fetchTaskCompletion = async () => {
  try {
    const res = await getTaskCompletion()
    if (res && res.code === 200) {
      return {
        classNames: res.data.classNames || [],
        completionRates: res.data.completionRates || []
      }
    }
    return { classNames: [], completionRates: [] }
  } catch (error) {
    console.error('获取任务完成率数据失败:', error)
    return { classNames: [], completionRates: [] }
  }
}

// 获取学生活跃度趋势数据
const fetchActivityTrend = async () => {
  try {
    const res = await getActivityTrend()
    if (res && res.code === 200) {
      return {
        days: res.data.days || [],
        completedTasks: res.data.completedTasks || [],
        exercises: res.data.exercises || []
      }
    }
    return { days: [], completedTasks: [], exercises: [] }
  } catch (error) {
    console.error('获取学生活跃度趋势数据失败:', error)
    return { days: [], completedTasks: [], exercises: [] }
  }
}

// 获取错题类型分布数据
const fetchErrorTypeDistribution = async () => {
  try {
    const res = await getErrorTypeDistribution()
    if (res && res.code === 200 && Array.isArray(res.data)) {
      return res.data
    }
    return []
  } catch (error) {
    console.error('获取错题类型分布数据失败:', error)
    return []
  }
}

// 图表实例引用
const taskCompletionChart = ref(null)
const activityTrendChart = ref(null)
const errorTypeChart = ref(null)
const classLevelChart = ref(null)

let taskChart = null
let activityChart = null
let errorChart = null
let levelChart = null

// 初始化各班级任务完成率对比图
// 数据来源: /teacher-home/task-completion 接口
const initTaskCompletionChart = (taskData = { classNames: [], completionRates: [] }) => {
  if (taskChart) {
    taskChart.dispose()
  }

  taskChart = echarts.init(taskCompletionChart.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['完成率'],
      bottom: 0,
      left: 'center',
      itemGap: 20
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '40px',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: taskData.classNames.length > 0 ? taskData.classNames : ['暂无数据'],
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: '完成率(%)',
      max: 100
    },
    series: [
      {
        name: '完成率',
        type: 'bar',
        data: taskData.completionRates.length > 0 ? taskData.completionRates : [0],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%'
        }
      }
    ]
  }

  taskChart.setOption(option)
}

// 初始化学生活跃度趋势图
// 数据来源: /teacher-home/activity-trend 接口
const initActivityTrendChart = (activityData = { days: [], completedTasks: [], exercises: [] }) => {
  if (activityChart) {
    activityChart.dispose()
  }

  activityChart = echarts.init(activityTrendChart.value)

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['完成任务数', '练习题数'],
      bottom: 0,
      left: 'center',
      itemGap: 20
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '40px',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: activityData.days.length > 0 ? activityData.days : ['暂无数据']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '完成任务数',
        type: 'line',
        data: activityData.completedTasks.length > 0 ? activityData.completedTasks : [0],
        smooth: true,
        itemStyle: {
          color: '#52c41a'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
            { offset: 1, color: 'rgba(82, 196, 26, 0.1)' }
          ])
        }
      },
      {
        name: '练习题数',
        type: 'line',
        data: activityData.exercises.length > 0 ? activityData.exercises : [0],
        smooth: true,
        itemStyle: {
          color: '#faad14'
        }
      }
    ]
  }

  activityChart.setOption(option)
}

// 初始化错题类型分布图
// 数据来源: /teacher-home/error-type-distribution 接口
const initErrorTypeChart = (errorData = []) => {
  if (errorChart) {
    errorChart.dispose()
  }

  errorChart = echarts.init(errorTypeChart.value)

  // 错题类型对应的颜色
  const typeColors = {
    '选择题': '#1890ff',
    '填空题': '#52c41a',
    '单词拼写': '#faad14'
  }

  // 转换数据格式
  const chartData = errorData.map(item => ({
    value: item.count,
    name: item.type,
    itemStyle: { color: typeColors[item.type] || '#999' }
  }))

  const legendData = errorData.map(item => item.type)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}题 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: legendData.length > 0 ? legendData : ['选择题', '填空题', '单词拼写']
    },
    series: [
      {
        name: '错题类型',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{c}题 ({d}%)'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: chartData.length > 0 ? chartData : [
          { value: 0, name: '选择题', itemStyle: { color: '#1890ff' } },
          { value: 0, name: '填空题', itemStyle: { color: '#52c41a' } },
          { value: 0, name: '单词拼写', itemStyle: { color: '#faad14' } }
        ]
      }
    ]
  }

  errorChart.setOption(option)
}

// 初始化班级等级分布图
// 数据来源: /teacher/dashboard/level-distribution 接口
const initClassLevelChart = (levelData = []) => {
  if (levelChart) {
    levelChart.dispose()
  }

  levelChart = echarts.init(classLevelChart.value)

  // 等级对应的颜色
  const levelColors = {
    'A': '#ff4d4f',
    'B': '#ff7a45',
    'C': '#1890ff',
    'D': '#52c41a'
  }

  // 将接口数据转换为图表需要的格式
  const chartData = levelData.map(item => ({
    value: item.classCount,
    name: `${item.classLevel}级`,
    itemStyle: { color: levelColors[item.classLevel] || '#999' }
  }))

  // 获取所有等级名称用于图例
  const legendData = levelData.map(item => `${item.classLevel}级`)

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}个班级 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: legendData.length > 0 ? legendData : ['A级', 'B级', 'C级', 'D级']
    },
    series: [
      {
        name: '班级等级',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{c}个 ({d}%)'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: chartData.length > 0 ? chartData : [
          { value: 0, name: 'A级', itemStyle: { color: '#ff4d4f' } },
          { value: 0, name: 'B级', itemStyle: { color: '#ff7a45' } },
          { value: 0, name: 'C级', itemStyle: { color: '#1890ff' } },
          { value: 0, name: 'D级', itemStyle: { color: '#52c41a' } }
        ]
      }
    ]
  }

  levelChart.setOption(option)
}

// 快捷操作跳转
const goToPublishTask = () => {
  router.push('/teacher/my-classes')
}

const goToReview = () => {
  router.push('/teacher/student-review')
}

const goToErrors = () => {
  router.push('/teacher/error-management')
}

// 窗口大小变化时重新渲染图表
const handleResize = () => {
  taskChart?.resize()
  activityChart?.resize()
  errorChart?.resize()
  levelChart?.resize()
}

onMounted(() => {
  nextTick(async () => {
    // 获取首页数据
    await fetchDashboardData()

    // 并行获取所有图表数据
    const [levelData, taskData, activityData, errorData] = await Promise.all([
      fetchLevelDistribution(),
      fetchTaskCompletion(),
      fetchActivityTrend(),
      fetchErrorTypeDistribution()
    ])

    // 初始化图表
    initTaskCompletionChart(taskData)
    initActivityTrendChart(activityData)
    initErrorTypeChart(errorData)
    initClassLevelChart(levelData)

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)
  })
})

// 组件卸载时清理
onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  taskChart?.dispose()
  activityChart?.dispose()
  errorChart?.dispose()
  levelChart?.dispose()
})
</script>

<style scoped src="./home.css"></style>
