<template>
  <div class="my-progress-container">
    <!-- 顶部数据展示 -->
    <a-row :gutter="16" style="margin-bottom: 20px">
      <a-col :xs="24" :sm="8">
        <a-card>
          <a-statistic
            title="累计查词量"
            :value="statistics.totalWords"
            suffix="个"
          >
            <template #prefix>
              <BookOutlined style="color: #1890ff" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card>
          <a-statistic
            title="任务完成数"
            :value="statistics.completedTasks"
            suffix="个"
          >
            <template #prefix>
              <ClockCircleOutlined style="color: #52c41a" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="8">
        <a-card>
          <a-statistic
            title="总错题数"
            :value="statistics.totalErrors"
            suffix="个"
          >
            <template #prefix>
              <FieldTimeOutlined style="color: #faad14" />
            </template>
          </a-statistic>
        </a-card>
      </a-col>
    </a-row>

    <!-- 中间可视化图表 -->
    <a-row :gutter="16" style="margin-bottom: 20px">
      <!-- 每日学习数据折线图 -->
      <a-col :xs="24" :lg="12">
        <a-card title="每日学习数据" :bodyStyle="{ padding: '20px' }">
          <div ref="dailyChartRef" style="width: 100%; height: 350px"></div>
        </a-card>
      </a-col>

      <!-- 班级 vs 个人完成率走势 -->
      <a-col :xs="24" :lg="12">
        <a-card title="班级 vs 个人完成率走势" :bodyStyle="{ padding: '20px' }">
          <div ref="compareChartRef" style="width: 100%; height: 350px"></div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 底部班级排名 -->
    <a-card>
      <template #title>
        <div class="card-title-wrapper">
          <span class="title-text">班级排名</span>
          <a-space :size="5" class="title-buttons">
            <a-button 
              :type="rankType === 'time' ? 'primary' : 'default'"
              @click="rankType = 'time'"
            >
              按学习时长
            </a-button>
            <a-button 
              :type="rankType === 'words' ? 'primary' : 'default'"
              @click="rankType = 'words'"
            >
              按掌握单词量
            </a-button>
          </a-space>
        </div>
      </template>

      <a-table
        :columns="rankColumns"
        :data-source="rankList"
        :pagination="{ pageSize: 10, showTotal: (total) => `共 ${total} 名学生`, total: rankTotal }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'rank'">
            <a-tag v-if="record.rank === 1" color="gold">
              🥇 {{ record.rank }}
            </a-tag>
            <a-tag v-else-if="record.rank === 2" color="silver">
              🥈 {{ record.rank }}
            </a-tag>
            <a-tag v-else-if="record.rank === 3" color="bronze">
              🥉 {{ record.rank }}
            </a-tag>
            <span v-else :style="{ fontWeight: record.isMe ? 'bold' : 'normal' }">
              {{ record.rank }}
            </span>
          </template>
          <template v-if="column.key === 'name'">
            <span :style="{ fontWeight: record.isMe ? 'bold' : 'normal', color: record.isMe ? '#1890ff' : '' }">
              {{ record.name }} {{ record.isMe ? '(我)' : '' }}
            </span>
          </template>
          <template v-if="column.key === 'studyTime'">
            <a-progress
              :percent="(record.studyTime / maxStudyTime) * 100"
              :show-info="false"
              :stroke-color="record.isMe ? '#1890ff' : '#52c41a'"
            />
            <span style="margin-left: 10px">{{ record.studyTime }}小时</span>
          </template>
          <template v-if="column.key === 'masteredWords'">
            <a-progress
              :percent="(record.masteredWords / maxWords) * 100"
              :show-info="false"
              :stroke-color="record.isMe ? '#1890ff' : '#52c41a'"
            />
            <span style="margin-left: 10px">{{ record.masteredWords }}个</span>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import {
  BookOutlined,
  ClockCircleOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons-vue'
import { getStatistics, getDailyStudy, getCompareRate, getRanking } from '@/services/student/mydata'

// 顶部统计数据
const statistics = ref({
  totalWords: 0,
  completedTasks: 0,
  totalErrors: 0,
})

// 获取学情统计数据
const fetchStats = async () => {
  try {
    const res = await getStatistics()
    if (res.code === 200 && res.data) {
      const data = res.data
      statistics.value = {
        totalWords: data.totalWords || 0,
        completedTasks: data.completedTasks || 0,
        totalErrors: data.totalErrors || 0,
      }
    }
  } catch (error) {
    console.error('获取学情统计失败:', error)
  }
}

// 图表实例
const dailyChartRef = ref(null)
const compareChartRef = ref(null)
let dailyChart = null
let compareChart = null

// 每日学习数据
const dailyData = ref({
  dates: [],
  wordCounts: [],
  taskCounts: [],
  errorCounts: [],
  studyMinutes: [],
})

// 班级vs个人完成率数据
const compareData = ref({
  weeks: [],
  classRate: [],
  myRate: [],
})

// 获取每日学习数据
const fetchDailyStudy = async () => {
  try {
    const res = await getDailyStudy()
    if (res.code === 200 && res.data) {
      dailyData.value = res.data
      // 更新图表
      if (dailyChart) {
        dailyChart.setOption({
          xAxis: { data: res.data.dates },
          series: [
            { data: res.data.wordCounts },
            { data: res.data.taskCounts },
            { data: res.data.errorCounts },
          ]
        })
      }
    }
  } catch (error) {
    console.error('获取每日学习数据失败:', error)
  }
}

// 获取完成率对比数据
const fetchCompareRate = async () => {
  try {
    const res = await getCompareRate()
    if (res.code === 200 && res.data) {
      compareData.value = res.data
      // 更新图表
      if (compareChart) {
        compareChart.setOption({
          xAxis: { data: res.data.weeks },
          series: [
            { data: res.data.classRate },
            { data: res.data.myRate },
          ]
        })
      }
    }
  } catch (error) {
    console.error('获取完成率对比数据失败:', error)
  }
}

// 排名类型
const rankType = ref('time')

// 排名数据
const rankList = ref([])
const maxStudyTime = ref(0)
const maxWords = ref(0)
const rankTotal = ref(0)

// 获取排名数据
const fetchRanking = async (type) => {
  try {
    const res = await getRanking(type)
    if (res.code === 200 && res.data) {
      rankList.value = res.data.list || []
      maxStudyTime.value = res.data.maxStudyTime || 0
      maxWords.value = res.data.maxWords || 0
      rankTotal.value = res.data.total || 0
    }
  } catch (error) {
    console.error('获取排名数据失败:', error)
  }
}

// 监听排名类型切换
watch(rankType, (newType) => {
  fetchRanking(newType)
})

// 排名表格列
const rankColumns = [
  { title: '排名', dataIndex: 'rank', key: 'rank', width: 100 },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 150 },
  { title: '学习时长', key: 'studyTime', width: 300 },
  { title: '掌握单词', key: 'masteredWords', width: 300 },
]

// 初始化每日学习数据图表
const initDailyChart = () => {
  if (!dailyChartRef.value) return

  dailyChart = echarts.init(dailyChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: ['查词量', '完成任务', '错题数'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dailyData.value.dates,
    },
    yAxis: [
      {
        type: 'value',
        name: '数量',
        position: 'left',
        axisLabel: {
          formatter: '{value}',
        },
      },
    ],
    series: [
      {
        name: '查词量',
        type: 'line',
        smooth: true,
        data: dailyData.value.wordCounts,
        itemStyle: {
          color: '#1890ff',
        },
      },
      {
        name: '完成任务',
        type: 'line',
        smooth: true,
        data: dailyData.value.taskCounts,
        itemStyle: {
          color: '#52c41a',
        },
      },
      {
        name: '错题数',
        type: 'line',
        smooth: true,
        data: dailyData.value.errorCounts,
        itemStyle: {
          color: '#faad14',
        },
      },
    ],
  }

  dailyChart.setOption(option)
}

// 初始化对比图表
const initCompareChart = () => {
  if (!compareChartRef.value) return

  compareChart = echarts.init(compareChartRef.value)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['班级平均', '我的完成率'],
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: compareData.value.weeks,
    },
    yAxis: {
      type: 'value',
      name: '完成率(%)',
      max: 100,
      axisLabel: {
        formatter: '{value}%',
      },
    },
    series: [
      {
        name: '班级平均',
        type: 'line',
        smooth: true,
        data: compareData.value.classRate,
        itemStyle: {
          color: '#faad14',
        },
        lineStyle: {
          type: 'dashed',
        },
      },
      {
        name: '我的完成率',
        type: 'line',
        smooth: true,
        data: compareData.value.myRate,
        itemStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          opacity: 0.3,
        },
      },
    ],
  }

  compareChart.setOption(option)
}

// 窗口大小改变时重新渲染图表
const handleResize = () => {
  dailyChart?.resize()
  compareChart?.resize()
}

onMounted(async () => {
  await Promise.all([
    fetchStats(),
    fetchDailyStudy(),
    fetchCompareRate(),
    fetchRanking(rankType.value)
  ])
  initDailyChart()
  initCompareChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  dailyChart?.dispose()
  compareChart?.dispose()
})
</script>

<style scoped src="./my-progress.css"></style>
