<template>
  <div class="background-container">
    <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png" alt="月亮" class="moon" onerror="this.style.display='none'">
    <div class="stars"></div>
    <div class="twinkling"></div>
    <div class="clouds"></div>
  </div>
  
  <div class="page-container">
    <!-- 登录面板 -->
    <div class="auth-panel login-panel">
      <div class="left-panel">
        <h2>没有账号？</h2>
        <p @click="switchToRegister" class="switch-link">立即注册</p>
      </div>
      <div class="right-panel">
        <h3>登录</h3>
        <form @submit.prevent="handleLogin" class="form">
          <div class="input-group">
            <i class="fa fa-user input-icon"></i>
            <label class="input-label">账号：</label>
            <input type="text" v-model="loginForm.username" placeholder="请输入账号" required>
          </div>
          
          <div class="input-group">
            <i class="fa fa-lock input-icon"></i>
            <label class="input-label">密码：</label>
            <input type="password" v-model="loginForm.password" placeholder="请输入密码" autocomplete="current-password" required>
          </div>
          <button type="submit" class="submit-btn">登录</button>
          <div class="forgot-password">
            <router-link to="/reset-password" class="forgot-link">忘记密码？</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'LoginRegister',
  setup() {
    const router = useRouter()
    const loginForm = ref({ username: '', password: '' })

    const switchToRegister = () => { 
      router.push('/register')
    }

    const handleLogin = async () => {
      const payload = { username: loginForm.value.username, password: loginForm.value.password }
      try {
        const response = await axios.post('http://localhost:8000/person/login', payload, { headers: { 'Content-Type': 'application/json' } })
        if (response.data && response.data.code === '200') {
          if (response.data.token) window.localStorage.setItem('jwt_token', response.data.token)
          router.push({ path: '/HelloWorld', query: { user: response.data.data } })
        } else {
          router.push({ path: '/Fail' })
        }
      } catch (error) {
        router.push({ path: '/Fail' })
      }
    }

    return { loginForm, switchToRegister, handleLogin }
  }
}
</script>

<style>
/* 引入 Font Awesome 图标库 */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  height: 100%;
  width: 100%;
  background: #000;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 背景容器 */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
}

/* 星空背景 */
.stars {
  background: black url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png) repeat;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: block;
  z-index: 0;
}

/* 闪烁星星 */
.twinkling {
  width: 10000px;
  height: 100%;
  background: transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/twinkling.png") repeat;
  background-size: 1000px 1000px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  -moz-animation: move-background 70s linear infinite;
  -ms-animation: move-background 70s linear infinite;
  -o-animation: move-background 70s linear infinite;
  -webkit-animation: move-background 70s linear infinite;
  animation: move-background 70s linear infinite;
}

/* 云层 */
.clouds {
  width: 100%;
  height: 100%;
  background: transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png") repeat;
  background-size: 1000px 1000px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 3;
}

/* 月亮 */
.moon {
  height: 200vh;
  width: 200vh;
  position: absolute;
  z-index: 4;
  right: -100vh;
  top: -50vh;
  opacity: 0.8;
  object-fit: cover;
  display: block;
}

/* 背景移动动画 */
@keyframes move-background {
  from {
    -webkit-transform: translate3d(0px, 0px, 0px);
  }
  to {
    -webkit-transform: translate3d(1000px, 0px, 0px);
  }
}

@-webkit-keyframes move-background {
  from {
    -webkit-transform: translate3d(0px, 0px, 0px);
  }
  to {
    -webkit-transform: translate3d(1000px, 0px, 0px);
  }
}

@-moz-keyframes move-background {
  from {
    -webkit-transform: translate3d(0px, 0px, 0px);
  }
  to {
    -webkit-transform: translate3d(1000px, 0px, 0px);
  }
}

/* 页面容器 */
.page-container {
  width: 600px;
  height: 440px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  display: flex;
  overflow: hidden;
}

/* 认证面板 */
.auth-panel {
  width: 100%;
  height: 100%;
  display: flex;
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* 左侧面板 */
.left-panel {
  width: 40%;
  height: 440px;
  background: rgba(51, 51, 51, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 15px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.left-panel h2 {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  text-align: center;
}

.switch-link {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-size: 14px;
  color: #fff;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s ease;
}

.switch-link:hover {
  color: #eee;
}

/* 右侧面板 */
.right-panel {
  width: 60%;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.right-panel h3 {
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* 表单样式 */
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  position: relative;
}

.input-icon {
  width: 24px;
  height: 24px;
  color: #999;
  margin-right: 8px;
  flex-shrink: 0;
}

.input-label {
  font-size: 10px;
  color: #fff;
  font-weight: 500;
  margin-right: 10px;
  min-width: 45px;
  flex-shrink: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.input-group input {
  flex: 1;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  font-size: 10px;
  color: #333;
  padding: 0 6px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.input-group input:focus {
  outline: none;
  border-color: #666;
  box-shadow: 0 0 5px rgba(102, 102, 102, 0.2);
  transform: translateY(-2px);
}

.input-group input::placeholder {
  color: #aaa;
}

/* 验证码输入组 */
.verification-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.verification-btn-container {
  width: 100%;
  margin-bottom: 12px;
  display: flex;
  justify-content: flex-start;
}

.verification-btn {
  width: 100%;
  height: 26px;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%) !important;
  border: 1px solid #d0d0d0 !important;
  border-radius: 4px;
  font-size: 7px;
  font-weight: 500;
  color: #555 !important;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.verification-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #e8e8e8 0%, #d8d8d8 100%) !important;
  border-color: #b8b8b8 !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.verification-btn:disabled {
  background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%) !important;
  border-color: #c0c0c0 !important;
  color: #999 !important;
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  height: 28px;
  background-color: #555;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.submit-btn:hover {
  background-color: #444;
}

.submit-btn:active {
  transform: scale(0.99);
}

/* 忘记密码链接 */
.forgot-password {
  text-align: center;
  margin-top: 8px;
}

.forgot-link {
  font-size: 8px;
  color: #666;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #333;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .page-container {
    width: 500px;
    height: 350px;
  }
  
  .left-panel {
    width: 35%;
    height: 350px;
    padding: 25px 12px;
  }
  
  .right-panel {
    width: 65%;
    padding: 25px;
  }
  
  .left-panel h2 {
    font-size: 20px;
  }
  
  .switch-link {
    font-size: 14px;
  }
  
  .right-panel h3 {
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .page-container {
    width: 90%;
    height: auto;
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
    height: auto;
    padding: 20px;
  }
  
  .right-panel {
    width: 100%;
    padding: 20px;
  }
  
  .left-panel h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .switch-link {
    font-size: 14px;
  }
  
  .right-panel h3 {
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  .input-group input {
    height: 36px;
  }
  
  .submit-btn {
    height: 38px;
  }
  
  .verification-btn {
    height: 36px;
  }
}
</style>