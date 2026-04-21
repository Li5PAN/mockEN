<template>
  <div class="register-container">
    <div class="register-box">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>账号</label>
          <input 
            v-model="registerForm.username" 
            type="text" 
            placeholder="请输入账号"
            required
          />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="请输入密码"
            required
          />
        </div>
        <div class="form-group">
          <label>身份</label>
          <select v-model="registerForm.code" required>
            <option value="" disabled>请选择身份</option>
            <option value="student">学生</option>
            <option value="teacher">教师</option>
          </select>
        </div>
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>
        <button type="submit" class="btn-register" :disabled="loading">注册</button>
        <button type="button" class="btn-back" @click="goToLogin">返回登录</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { mockRegister } from '@/pages/mockjson/auth.js'

const router = useRouter()

const registerForm = ref({
  username: '',
  password: '',
  code: ''
})

const errorMsg = ref('')
const successMsg = ref('')
const loading = ref(false)

const handleRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  
  const { username, password, code } = registerForm.value
  
  if (!username || !password || !code) {
    errorMsg.value = '请填写完整信息'
    return
  }
  
  if (username.length < 3) {
    errorMsg.value = '账号长度至少3个字符'
    return
  }
  
  if (password.length < 6) {
    errorMsg.value = '密码长度至少6个字符'
    return
  }

  loading.value = true
  
  try {
    // 使用模拟注册
    const res = await mockRegister(username, password, code)
    
    if (res.code === 200) {
      successMsg.value = '注册成功！2秒后跳转到登录页...'
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } else {
      errorMsg.value = res.msg || '注册失败，请重试'
    }
  } catch (error) {
    errorMsg.value = error.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-box {
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

input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
  background-color: white;
}

input:focus, select:focus {
  outline: none;
  border-color: #667eea;
}

.error-msg {
  color: #f56c6c;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

.success-msg {
  color: #67c23a;
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

.btn-register {
  background: #667eea;
  color: white;
  margin-bottom: 10px;
}

.btn-register:hover:not(:disabled) {
  background: #5568d3;
}

.btn-register:disabled {
  background: #a09fd6;
  cursor: not-allowed;
}

.btn-back {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-back:hover {
  background: #f5f7ff;
}
</style>
