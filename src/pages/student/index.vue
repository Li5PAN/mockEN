<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider :width="200" style="background: #fff">
      <div class="logo">
        <h3>学生端</h3>
      </div>
      <a-menu
        v-model:selectedKeys="selectedKeys"
        :open-keys="openKeys"
        mode="inline"
        theme="light"
        :items="items"
        @click="handleMenuClick"
        @openChange="onOpenChange"
      />
    </a-layout-sider>
    
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0 24px; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="margin: 0;">{{ pageTitle }}</h2>
        <div style="display: flex; align-items: center; gap: 16px;">
          <span style="cursor: pointer; color: #1890ff;" @click="showProfileModal">欢迎，{{ userInfo.name || userInfo.username }}</span>
          <a-button type="primary" danger @click="logout">退出登录</a-button>
        </div>
      </a-layout-header>
      
      <a-layout-content style="margin: 16px; padding: 24px; background: #fff; min-height: 280px;">
        <router-view />
      </a-layout-content>
    </a-layout>

    <!-- 个人信息弹窗 -->
    <a-modal
      v-model:open="profileModalVisible"
      title="个人信息"
      :footer="null"
      width="500px"
    >
      <div style="padding: 10px 0;">
        <div style="margin-bottom: 16px; display: flex; align-items: center;">
          <span style="font-weight: 500; width: 120px;">姓名：</span>
          <span>{{ userInfo.name || userInfo.username }}</span>
        </div>
        
        <div style="margin-bottom: 16px; display: flex; align-items: center;">
          <span style="font-weight: 500; width: 120px;">班级：</span>
          <span>{{ userInfo.className || '未加入班级' }}</span>
        </div>
        
        <div style="margin-bottom: 16px; display: flex; align-items: center;">
          <span style="font-weight: 500; width: 120px;">班级等级：</span>
          <span>{{ userInfo.classLevel || '-' }}</span>
        </div>
        
        <div style="margin-bottom: 16px; display: flex; align-items: center;">
          <span style="font-weight: 500; width: 120px;">当前班级教师：</span>
          <span>{{ userInfo.teacherName || '暂未加入班级' }}</span>
        </div>
      </div>
    </a-modal>
  </a-layout>
</template>

<script setup>
import { ref, onMounted, computed, shallowRef } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HomeOutlined from '@ant-design/icons-vue/HomeOutlined'
import BookOutlined from '@ant-design/icons-vue/BookOutlined'
import TeamOutlined from '@ant-design/icons-vue/TeamOutlined'
import CarryOutOutlined from '@ant-design/icons-vue/CarryOutOutlined'
import BarChartOutlined from '@ant-design/icons-vue/BarChartOutlined'

const router = useRouter()
const route = useRoute()

const selectedKeys = ref(['home'])
const openKeys = ref([])
const userInfo = ref({})

// 菜单项配置函数
function getItem(label, key, icon, children) {
  return {
    key,
    icon: icon ? shallowRef(icon) : undefined,
    children,
    label,
  }
}

// 菜单配置
const items = [
  getItem('首页', 'home', HomeOutlined),
  getItem('单词学习', 'word-learn', BookOutlined),
  getItem('我的班级', 'my-class', CarryOutOutlined),
  getItem('我的任务', 'my-tasks', CarryOutOutlined),
  getItem('我的错题', 'my-errors', TeamOutlined),
  getItem('我的学情', 'my-progress', BarChartOutlined),
]

// 一级菜单的 keys（用于手风琴效果）
const rootSubmenuKeys = []

const menuTitles = {
  home: '首页',
  'word-learn': '单词学习',
  'my-class': '我的班级',
  'my-tasks': '我的任务',
  'my-errors': '我的错题',
  'my-progress': '我的学情'
}

const pageTitle = computed(() => {
  return menuTitles[selectedKeys.value[0]] || '首页'
})

// 手风琴效果：一次只展开一个子菜单
const onOpenChange = (keys) => {
  const latestOpenKey = keys.find((key) => openKeys.value.indexOf(key) === -1)
  if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
    openKeys.value = keys
  } else {
    openKeys.value = latestOpenKey ? [latestOpenKey] : []
  }
}

onMounted(() => {
  const info = localStorage.getItem('userInfo')
  if (info) {
    userInfo.value = JSON.parse(info)
  } else {
    router.push('/login')
  }
  
  // 根据当前路由设置选中的菜单
  const path = route.path
  if (path.includes('word-learn')) {
    selectedKeys.value = ['word-learn']
    openKeys.value = []
  } else if (path.includes('my-errors')) {
    selectedKeys.value = ['my-errors']
    openKeys.value = []
  } else if (path.includes('my-class')) {
    selectedKeys.value = ['my-class']
    openKeys.value = []
  } else if (path.includes('my-tasks')) {
    selectedKeys.value = ['my-tasks']
    openKeys.value = []
  } else if (path.includes('my-progress')) {
    selectedKeys.value = ['my-progress']
    openKeys.value = []
  } else {
    selectedKeys.value = ['home']
    openKeys.value = []
  }
})

const handleMenuClick = ({ key }) => {
  const routes = {
    home: '/student/home',
    'word-learn': '/student/word-learn',
    'my-errors': '/student/my-errors',
    'my-class': '/student/my-class',
    'my-tasks': '/student/my-tasks',
    'my-progress': '/student/my-progress'
  }
  
  if (routes[key]) {
    router.push(routes[key])
  }
}

// 个人信息弹窗
const profileModalVisible = ref(false)
const showProfileModal = () => {
  profileModalVisible.value = true
}

const logout = () => {
  localStorage.removeItem('userInfo')
  userInfo.value = {}
  router.replace('/login')
}
</script>

<style scoped src="./index.css"></style>
