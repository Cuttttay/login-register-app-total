<template>
  <div id="app">
    <!-- 星空背景 -->
    <div class="background-container">
      <div class="twinkling"></div>
      <div class="clouds"></div>
      <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/moon2.png" alt="月亮" class="moon" onerror="this.style.display='none'">
   
    </div>

    <div class="page-container">
      <!-- 重置密码面板 -->
      <div class="auth-panel reset-panel">
        <div class="left-panel">
          <h2>重置密码成功？</h2>
          <p @click="goToLogin" class="switch-link">返回登录</p>
        </div>
        <div class="right-panel">
          <h3>重置密码</h3>
          <form @submit.prevent="handleResetPassword" class="form">
            <div class="input-group">
              <i class="fa fa-envelope input-icon"></i>
              <label class="input-label">邮箱：</label>
              <input type="email" v-model="resetForm.email" placeholder="请输入邮箱地址" required>
            </div>
            
            <div class="verification-btn-container">
              <button
                type="button"
                @click="sendVerificationCode"
                class="verification-btn"
                :disabled="isCountingDown"
              >
                {{ isCountingDown ? `重新发送(${countdown}s)` : '收取邮件验证码' }}
              </button>
            </div>
            
            <div class="input-group">
              <i class="fa fa-key input-icon"></i>
              <label class="input-label">验证码：</label>
              <input type="text" v-model="resetForm.verificationCode" placeholder="请输入验证码" required>
            </div>
            
            <div class="input-group">
              <i class="fa fa-lock input-icon"></i>
              <label class="input-label">新密码：</label>
              <input type="password" v-model="resetForm.newPassword" placeholder="请输入新密码" autocomplete="new-password" required>
            </div>
            
            <div class="input-group">
              <i class="fa fa-lock input-icon"></i>
              <label class="input-label">确认密码：</label>
              <input type="password" v-model="resetForm.confirmPassword" placeholder="请再次输入新密码" autocomplete="new-password" required>
            </div>
            
            <button type="submit" class="submit-btn">重置密码</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  name: 'ResetPassword',
  setup() {
    const router = useRouter()
    const countdown = ref(0)
    const isCountingDown = ref(false)
    const showSuccess = ref(false)
    const resetForm = ref({
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: ''
    })

    const handleResetPassword = async () => {
      if (resetForm.value.newPassword !== resetForm.value.confirmPassword) {
        alert('两次输入的密码不一致')
        return
      }

      const payload = {
        email: resetForm.value.email,
        verificationCode: resetForm.value.verificationCode,
        newPassword: resetForm.value.newPassword
      }

      try {
        const response = await axios.post('http://localhost:8080/person/reset-password', payload, {
          headers: { 'Content-Type': 'application/json' }
        })
        
        if (response.data.success) {
          alert('重置密码成功！')
          router.push('/')
        } else {
          alert('重置失败：' + response.data.message)
        }
      } catch (error) {
        console.error('重置密码错误:', error)
        alert('重置失败，请检查网络连接')
      }
    }

    const sendVerificationCode = async () => {
      if (!resetForm.value.email) {
        alert('请先输入邮箱地址')
        return
      }

      try {
        const response = await axios.post('http://localhost:8080/person/send-verification', {
          email: resetForm.value.email
        })
        
        if (response.data.success) {
          alert('验证码已发送到您的邮箱')
          startCountdown()
        } else {
          alert('发送失败：' + response.data.message)
        }
      } catch (error) {
        console.error('发送验证码错误:', error)
        alert('发送失败，请检查网络连接')
      }
    }

    const startCountdown = () => {
      isCountingDown.value = true
      countdown.value = 60
      const timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          clearInterval(timer)
          isCountingDown.value = false
        }
      }, 1000)
    }

    const goToLogin = () => {
      router.push('/')
    }

    return {
      countdown,
      isCountingDown,
      showSuccess,
      resetForm,
      handleResetPassword,
      sendVerificationCode,
      goToLogin
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 星空背景容器 */
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: -1;
}

/* 星空背景 */
html {
  height: 100%;
  width: 100%;
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
  position: relative;
  overflow: hidden;
}

/* 备用星空背景 */
html::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000 url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/stars.png') repeat;
  z-index: -2;
  opacity: 0.8;
}

/* CSS星星 */
html::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, #eee, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, #fff, transparent),
    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  z-index: -1;
  opacity: 0.3;
  animation: twinkle 3s ease-in-out infinite alternate;
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
  animation: move-background 70s linear infinite, starTwinkle 2s ease-in-out infinite alternate;
}

/* 云层 */
.clouds {
  width: 10000px;
  height: 100%;
  background: transparent url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1231630/clouds_repeat.png") repeat;
  background-size: 1000px 1000px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 3;
  animation: move-background 200s linear infinite;
}

/* 月亮 */
.moon {
  position: absolute;
  top: 10px;
  right: 100px;
  width: 200px;
  height: 200px;
  z-index: 4;
  animation: moonGlow 3s ease-in-out infinite alternate;
}

/* 银色文字 */
.star-text {
  position: absolute;
  top: 300px;
  right: 120px;
  color: #C0C0C0;
  font-size: 16px;
  font-weight: 300;
  z-index: 5;
  text-shadow: 0 0 10px rgba(192, 192, 192, 0.5);
  animation: textGlow 2s ease-in-out infinite alternate;
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
  color: #333;
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

/* 验证码按钮容器 */
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

.success-message {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  padding: 20px;
  background: rgba(40, 167, 69, 0.1);
  border-radius: 8px;
  border: 1px solid rgba(40, 167, 69, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.success-message p {
  color: #28a745;
  font-size: 16px;
  margin-bottom: 15px;
}

.back-link {
  background: none;
  border: none;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: #333;
}

/* 动画 */
@keyframes starTwinkle {
  0% {
    opacity: 0.3;
    filter: brightness(0.8);
  }
  50% {
    opacity: 0.8;
    filter: brightness(1.2);
  }
  100% {
    opacity: 1;
    filter: brightness(1.5);
  }
}

@keyframes twinkle {
  0% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes moonGlow {
  0% {
    filter: brightness(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  }
  100% {
    filter: brightness(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.6));
  }
}

@keyframes textGlow {
  0% {
    text-shadow: 0 0 10px rgba(192, 192, 192, 0.5);
  }
  100% {
    text-shadow: 0 0 20px rgba(192, 192, 192, 0.8);
  }
}

@keyframes move-background {
  from {
    transform: translate3d(0, 0, 0);
  }
  to {
    transform: translate3d(-2000px, 0, 0);
  }
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
  
  .moon {
    width: 150px;
    height: 150px;
    top: 20px;
    right: 20px;
  }
  
  .star-text {
    top: 200px;
    right: 40px;
    font-size: 14px;
  }
}
</style>



