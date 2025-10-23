<template>
  <div class="hello-world">
    <h1>欢迎！</h1>
    <p>登录成功！</p>
    <div class="user-info" v-if="userInfo">
      <h3>用户信息：</h3>
      <p>用户名：{{ userInfo.username || '未知' }}</p>
      <p>邮箱：{{ userInfo.email || '未知' }}</p>
    </div>
    <button @click="logout" class="logout-btn">退出登录</button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'HelloWorld',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userInfo = ref(null)

    onMounted(() => {
      // 从路由参数获取用户信息
      if (route.query.user) {
        userInfo.value = JSON.parse(decodeURIComponent(route.query.user))
      }
    })

    const logout = () => {
      // 清除本地存储的token
      localStorage.removeItem('jwt_token')
      // 跳转回登录页面
      router.push('/')
    }

    return {
      userInfo,
      logout
    }
  }
}
</script>

<style scoped>
.hello-world {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.hello-world h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.user-info {
  margin: 20px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 5px;
  text-align: left;
}

.user-info h3 {
  color: #495057;
  margin-bottom: 10px;
}

.user-info p {
  margin: 5px 0;
  color: #6c757d;
}

.logout-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.logout-btn:hover {
  background: #c82333;
}
</style>


