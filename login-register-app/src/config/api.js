// API配置文件
const getApiConfig = () => {
  // 检查是否在浏览器环境中
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    // 浏览器环境，使用import.meta.env
    const env = import.meta.env.MODE || 'development'
    return {
      baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || (env === 'production' ? 15000 : 10000),
      backendURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081'
    }
  } else {
    // Node.js环境（如Vite配置），使用process.env
    return {
      baseURL: process.env.VITE_API_BASE_URL || '/api',
      timeout: parseInt(process.env.VITE_API_TIMEOUT) || 10000,
      backendURL: process.env.VITE_BACKEND_URL || 'http://localhost:8081'
    }
  }
}

const apiConfig = getApiConfig()

export default apiConfig
