<template>
  <div class="fail-page">
    <div class="fail-container">
      <h1>登录失败</h1>
      <p>用户名或密码错误，请重试</p>
      <button @click="goBack" class="retry-btn">返回登录</button>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'Fail',
  setup() {
    const router = useRouter()

    const goBack = () => {
      router.push('/')
    }

    return {
      goBack
    }
  }
}
</script>

<style scoped>
.fail-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.fail-container {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
  width: 90%;
}

.fail-container h1 {
  color: #dc3545;
  margin-bottom: 20px;
  font-size: 2rem;
}

.fail-container p {
  color: #6c757d;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.retry-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background: #0056b3;
}
</style>


