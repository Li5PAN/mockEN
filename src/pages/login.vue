<template>
  <div class="login-container">
    <div class="login-box">
      <h2>英语学习系统</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>账号</label>
          <input v-model="loginForm.username" type="text" placeholder="请输入账号" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="loginForm.password" type="password" placeholder="请输入密码" required />
        </div>
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <button type="submit" class="btn-login" :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        <button type="button" class="btn-register" @click="goToRegister">注册</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import authService from '@/services/authService.js'

const router = useRouter()
const loginForm = ref({ username: '', password: '' })
const errorMsg = ref('')
const loading = ref(false)

// 角色类型映射路由
const roleMap = {
  'student': { route: '/student/home', roleName: 'student' },
  'teacher': { route: '/teacher/home', roleName: 'teacher' },
  'admin': { route: '/admin/home', roleName: 'admin' }
}

const handleLogin = async () => {
  errorMsg.value = ''
  const { username, password } = loginForm.value
  if (!username || !password) {
    errorMsg.value = '请输入账号和密码'
    return
  }

  loading.value = true

  try {
    // 调用真实登录接口
    const res = await authService.login({ username, password })

    // 登录成功后，authService 已经保存了 token
    // 这里获取用户信息并保存
    const userInfo = {
      userId: res.data?.userInfo?.id || res.data?.user?.id,
      username: res.data?.userInfo?.username || res.data?.user?.username,
      name: res.data?.userInfo?.name || res.data?.user?.name,
      role: res.data?.userInfo?.role || res.data?.user?.role,
      roles: res.data?.userInfo?.roles || res.data?.user?.roles,
      className: res.data?.userInfo?.className || res.data?.user?.className,
      classLevel: res.data?.userInfo?.classLevel || res.data?.user?.classLevel,
      teacherName: res.data?.userInfo?.teacherName || res.data?.user?.teacherName
    }
    localStorage.setItem('userInfo', JSON.stringify(userInfo))

    const roleInfo = roleMap[userInfo.role]
    if (!roleInfo) {
      errorMsg.value = '用户角色异常'
      return
    }
    message.success('登录成功')
    router.push(roleInfo.route)
  } catch (error) {
    errorMsg.value = error.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}

const goToRegister = () => router.push('/register')
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}
h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}
input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}
input:focus {
  outline: none;
  border-color: #667eea;
}
.error-msg {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}
button {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.btn-login {
  background: #667eea;
  color: white;
  margin-bottom: 10px;
}
.btn-login:hover:not(:disabled) {
  background: #5568d3;
}
.btn-register {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}
.btn-register:hover {
  background: #f5f7ff;
}
</style>
