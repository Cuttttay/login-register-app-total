// 认证工具函数

/**
 * 保存JWT Token
 * @param {string} token - JWT token
 */
export const saveToken = (token) => {
  if (token) {
    localStorage.setItem('jwt_token', token)
    console.log('Token已保存:', token)
  }
}

/**
 * 获取JWT Token
 * @returns {string|null} JWT token
 */
export const getToken = () => {
  return localStorage.getItem('jwt_token')
}

/**
 * 移除JWT Token
 */
export const removeToken = () => {
  localStorage.removeItem('jwt_token')
  console.log('Token已移除')
}

/**
 * 检查是否已登录
 * @returns {boolean} 是否已登录
 */
export const isLoggedIn = () => {
  const token = getToken()
  if (!token) return false
  
  try {
    // 简单的token有效性检查（可以根据需要扩展）
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp > currentTime
  } catch (error) {
    console.error('Token解析失败:', error)
    removeToken()
    return false
  }
}

/**
 * 获取token中的用户信息
 * @returns {object|null} 用户信息
 */
export const getUserFromToken = () => {
  const token = getToken()
  if (!token) return null
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      username: payload.username || payload.sub,
      userId: payload.userId || payload.id,
      role: payload.role,
      exp: payload.exp
    }
  } catch (error) {
    console.error('Token解析失败:', error)
    return null
  }
}

/**
 * 登出
 */
export const logout = () => {
  removeToken()
  // 可以在这里添加其他清理逻辑
  console.log('用户已登出')
}
