<template>
  <div class="class-data-container">
    <!-- 顶部筛选 -->
    <a-card style="margin-bottom: 16px;">
      <a-space :size="16">
        <span>选择班级：</span>
        <a-select 
          v-model:value="selectedClass" 
          placeholder="请选择班级" 
          style="width: 200px"
          @change="handleClassChange"
        >
          <a-select-option 
            v-for="cls in classList" 
            :key="cls.id" 
            :value="cls.id"
          >
            <a-tag :color="getLevelColor(cls.level)" size="small">{{ cls.level }}级</a-tag>
            {{ cls.name }}
          </a-select-option>
        </a-select>
      </a-space>
    </a-card>

    <!-- 图表区域 -->
    <a-row :gutter="[16, 16]">
      <!-- 班级任务完成对比图 -->
      <a-col :span="24">
        <a-card title="班级任务完成对比图" :bordered="false">
          <div ref="taskCompletionChart" style="width: 100%; height: 400px;"></div>
        </a-card>
      </a-col>

      <!-- 学生学习活跃分析图 -->
      <a-col :span="12">
        <a-card title="学生学习活跃分析图" :bordered="false">
          <div ref="studentActivityChart" style="width: 100%; height: 400px;"></div>
        </a-card>
      </a-col>

      <!-- 学生错题类型分析图 -->
      <a-col :span="12">
        <a-card title="学生错题类型分析图" :bordered="false">
          <div ref="errorTypeChart" style="width: 100%; height: 400px;"></div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
// 使用真实接口
import {
  getClassList,
  getTaskCompletionChart,
  getStudentActivityChart,
  getErrorTypeChart
} from '@/services/teacher/tmyclassdata'

// 选中的班级
const selectedClass = ref(null)

// 班级列表
const classList = ref([])

// 当前班级的图表数据
const chartData = ref({
  taskCompletion: null,
  studentActivity: null,
  errorType: null
})

// 图表实例
const taskCompletionChart = ref(null)
const studentActivityChart = ref(null)
const errorTypeChart = ref(null)

let taskChart = null
let activityChart = null
let errorChart = null

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

// 加载班级列表（使用真实接口）
const loadClassList = async () => {
  try {
    const res = await getClassList()
    if (res.code === 200) {
      classList.value = res.data
      // 设置默认选中第一个班级
      if (res.data.length > 0 && !selectedClass.value) {
        selectedClass.value = res.data[0].id
      }
    }
  } catch (error) {
    console.error('获取班级列表失败:', error)
  }
}

// 加载图表数据（使用真实接口）
const loadChartData = async () => {
  try {
    const classId = selectedClass.value

    // 加载任务完成数据
    const taskRes = await getTaskCompletionChart(classId)
    if (taskRes.code === 200) {
      chartData.value.taskCompletion = taskRes.data
    }

    // 加载学生活跃度数据
    const activityRes = await getStudentActivityChart(classId)
    if (activityRes.code === 200) {
      chartData.value.studentActivity = activityRes.data
    }

    // 加载错题类型分析数据
    const errorRes = await getErrorTypeChart(classId)
    if (errorRes.code === 200) {
      chartData.value.errorType = errorRes.data
    }
  } catch (error) {
    console.error('获取图表数据失败:', error)
  }
}

// 初始化班级任务完成对比图
const initTaskCompletionChart = () => {
  if (taskChart) {
    taskChart.dispose()
  }

  taskChart = echarts.init(taskCompletionChart.value)

  const data = chartData.value.taskCompletion
  const taskList = data?.taskList || []

  const taskNames = taskList.map(t => t.taskName)
  const completedData = taskList.map(t => t.completedCount)
  const uncompletedData = taskList.map(t => t.totalStudents - t.completedCount)

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: (params) => {
        const task = taskList[params[0].dataIndex]
        return `<strong>${task.taskName}</strong><br/>
                总人数: ${task.totalStudents}<br/>
                已完成: ${task.completedCount} (${task.completionRate}%)<br/>
                未完成: ${task.totalStudents - task.completedCount} (${100 - task.completionRate}%)`
      }
    },
    legend: {
      data: ['已完成', '未完成'],
      bottom: 0,
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: taskNames
    },
    yAxis: {
      type: 'value',
      name: '人数'
    },
    series: [
      {
        name: '已完成',
        type: 'bar',
        stack: 'total',
        data: completedData,
        itemStyle: {
          color: '#52c41a'
        },
        label: {
          show: true,
          formatter: (params) => {
            const task = taskList[params.dataIndex]
            return `${task.completionRate}%`
          }
        }
      },
      {
        name: '未完成',
        type: 'bar',
        stack: 'total',
        data: uncompletedData,
        itemStyle: {
          color: '#ff4d4f'
        }
      }
    ]
  }

  taskChart.setOption(option)
}

// 初始化学生学习活跃分析图
const initStudentActivityChart = () => {
  if (activityChart) {
    activityChart.dispose()
  }

  activityChart = echarts.init(studentActivityChart.value)

  const data = chartData.value.studentActivity || {}
  const days = data.days || []
  const completedTasks = data.completedTasks || []
  const exercises = data.exercises || []
  const studyDuration = data.studyDuration || []

  const option = {
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        let result = `<strong>${params[0].axisValue}</strong><br/>`
        params.forEach(item => {
          const unit = item.seriesName === '学习时长' ? '分钟' : '次'
          result += `${item.marker} ${item.seriesName}: ${item.value}${unit}<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['完成任务数', '练习次数', '学习时长'],
      bottom: 0,
      left: 'center'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: days
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '完成任务数',
        type: 'line',
        data: completedTasks,
        smooth: true,
        itemStyle: {
          color: '#52c41a'
        }
      },
      {
        name: '练习次数',
        type: 'line',
        data: exercises,
        smooth: true,
        itemStyle: {
          color: '#faad14'
        }
      },
      {
        name: '学习时长',
        type: 'bar',
        yAxisIndex: 0,
        data: studyDuration,
        itemStyle: {
          color: '#1890ff'
        }
      }
    ]
  }

  activityChart.setOption(option)
}

// 初始化学生错题类型分析图
const initErrorTypeChart = () => {
  if (errorChart) {
    errorChart.dispose()
  }

  errorChart = echarts.init(errorTypeChart.value)

  const data = chartData.value.errorType || {}
  const errorTypes = data.errorTypes || []

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.seriesType === 'pie') {
          return `<strong>${params.name}</strong><br/>
                  错题数: ${params.value} 题<br/>
                  占比: ${params.percent}%`
        }
        return params.name + ': ' + params.value
      }
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: errorTypes.map(e => e.type)
    },
    series: [
      {
        name: '错题分布',
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
          formatter: '{b}: {c}题 ({d}%)'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data: errorTypes.map(e => ({
          name: e.type,
          value: e.count
        }))
      }
    ]
  }

  errorChart.setOption(option)
}

// 处理班级切换（使用真实接口）
const handleClassChange = async () => {
  // 重新加载图表数据
  await loadChartData()
  initTaskCompletionChart()
  initStudentActivityChart()
  initErrorTypeChart()
}

// 窗口大小变化时重新渲染图表
const handleResize = () => {
  taskChart?.resize()
  activityChart?.resize()
  errorChart?.resize()
}

onMounted(async () => {
  // 加载班级列表
  await loadClassList()

  // 加载图表数据
  await loadChartData()

  nextTick(() => {
    initTaskCompletionChart()
    initStudentActivityChart()
    initErrorTypeChart()

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
})
</script>

<style scoped src="./class-data.css"></style>
