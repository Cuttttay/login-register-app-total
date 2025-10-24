import axios from 'axios'
import apiConfig from '../config/api.js'
import { removeToken } from '../utils/auth.js'

// 创建axios实例
const apiClient = axios.create({
  baseURL: apiConfig.backendURL, // 使用后端URL而不是baseURL
  timeout: apiConfig.timeout,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
  config => {
    // 添加token到请求头
    const token = localStorage.getItem('jwt_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // 添加调试信息
    console.log('发送请求:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    })
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
apiClient.interceptors.response.use(
  response => {
    console.log('收到响应:', {
      status: response.status,
      data: response.data
    })
    return response
  },
  error => {
    console.error('请求错误:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })
    
    if (error.response && error.response.status === 401) {
      // 处理未授权错误
      removeToken()
      console.log('Token已过期，请重新登录')
      // 这里需要导入router，但为了避免循环依赖，我们让组件处理跳转
    }
    return Promise.reject(error)
  }
)

// API服务对象
export const authAPI = {
  // 登录
  login: (credentials) => {
    return apiClient.post('/person/login', credentials)
  },
  
  // 注册
  register: (userData) => {
    return apiClient.post('/person/register', userData)
  },
  
  // 发送验证码
  sendVerification: (email) => {
    return apiClient.post('/person/send-verification', { email })
  },
  
  // 重置密码
  resetPassword: (resetData) => {
    return apiClient.post('/person/reset-password', resetData)
  },
  
  // 获取用户信息
  getUserProfile: () => {
    return apiClient.get('/person/profile')
  },
  
  // 登出
  logout: () => {
    return apiClient.post('/person/logout')
  }
}

export default apiClient
