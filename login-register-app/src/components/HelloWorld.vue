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
import { authAPI } from '../services/api.js'
import { getUserFromToken, isLoggedIn, logout as authLogout } from '../utils/auth.js'

export default {
  name: 'HelloWorld',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const userInfo = ref(null)

    onMounted(async () => {
      console.log('=== HelloWorld组件加载 ===')
      console.log('当前路由:', route.path)
      console.log('路由参数:', route.query)
      
      // 详细检查登录状态
      const token = localStorage.getItem('jwt_token')
      console.log('本地存储的token:', token)
      console.log('token存在:', !!token)
      
      const loginStatus = isLoggedIn()
      console.log('isLoggedIn()结果:', loginStatus)
      
      // 检查是否已登录
      if (!loginStatus) {
        console.log('❌ 未登录，跳转到登录页面')
        router.push('/login')
        return
      }

      console.log('✅ 已登录，继续处理')

      // 从路由参数获取用户信息
      if (route.query.user) {
        console.log('从路由参数获取用户信息:', route.query.user)
        userInfo.value = JSON.parse(decodeURIComponent(route.query.user))
        console.log('解析后的用户信息:', userInfo.value)
      }

      // 尝试从token获取用户信息
      const tokenUserInfo = getUserFromToken()
      if (tokenUserInfo) {
        console.log('从Token获取用户信息:', tokenUserInfo)
        if (!userInfo.value) {
          userInfo.value = tokenUserInfo
        }
      }

      // 尝试调用需要认证的API
      try {
        console.log('尝试调用用户信息API...')
        const response = await authAPI.getUserProfile()
        console.log('用户信息API响应:', response.data)
        if (response.data && response.data.success) {
          userInfo.value = response.data.data
        }
      } catch (error) {
        console.log('获取用户信息失败:', error.message)
        // 如果API调用失败，使用token中的信息
        if (tokenUserInfo && !userInfo.value) {
          userInfo.value = tokenUserInfo
        }
      }
      
      console.log('最终用户信息:', userInfo.value)
    })

    const logout = async () => {
      try {
        // 调用后端登出API
        await authAPI.logout()
      } catch (error) {
        console.log('登出API调用失败:', error.message)
      } finally {
        // 清除本地存储的token
        authLogout()
        // 跳转回登录页面
        router.push('/login')
      }
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


