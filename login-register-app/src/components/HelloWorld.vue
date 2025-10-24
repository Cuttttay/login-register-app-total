<template>
  <div class="calendar-app">
    <el-container class="app-container">
      <!-- 头部 -->
      <el-header class="app-header">
        <div class="header-content">
          <div class="time-info">
            <h2>{{ currentTime }}</h2>
            <p>{{ currentDate }}</p>
          </div>
          <div class="user-menu">
            <el-dropdown @command="handleCommand" trigger="click">
              <el-button type="text" class="user-dropdown-btn">
                <i class="fa fa-ellipsis-v"></i>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">
                    <i class="fa fa-sign-out"></i> 退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      
      <el-container>
        <!-- 侧边栏 - 颜色选择器 -->
        <el-aside width="200px" class="app-aside">
          <div class="color-picker-section">
            <h3>高亮颜色</h3>
            <div class="color-grid">
              <div
                v-for="color in colorOptions"
                :key="color"
                class="color-option"
                :style="{ backgroundColor: color }"
                :class="{ 'selected': selectedColor === color }"
                @click="selectColor(color)"
              ></div>
            </div>
          </div>
        </el-aside>
        
        <!-- 主内容区域 - 日历 -->
        <el-main class="app-main">
          <div class="calendar-container">
            <div class="calendar-header">
              <el-button @click="changeMonth(-1)" type="primary" plain>
                <i class="fa fa-chevron-left"></i> 上一月
              </el-button>
              <h2>{{ currentYear }}年{{ currentMonth + 1 }}月</h2>
              <el-button @click="changeMonth(1)" type="primary" plain>
                下一月 <i class="fa fa-chevron-right"></i>
              </el-button>
            </div>
            
            <div class="calendar-grid">
              <div class="week-header">
                <div v-for="day in weekDays" :key="day" class="week-day">{{ day }}</div>
              </div>
              <div class="calendar-days">
                <div
                  v-for="(dateInfo, index) in calendarDays"
                  :key="index"
                  class="calendar-day"
                  :class="{ 'current-month': dateInfo.isCurrentMonth }"
                >
                  <div class="day-number">{{ dateInfo.day }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUserFromToken, logout as authLogout } from '../utils/auth.js'

export default {
  name: 'HelloWorld',
  setup() {
    const router = useRouter()
    const userInfo = ref(null)
    
    // 日历相关状态
    const year = ref(new Date().getFullYear())
    const month = ref(new Date().getMonth())
    const weekDays = ['日', '一', '二', '三', '四', '五', '六']
    
    // 时间相关状态
    const currentTime = ref('')
    const currentDate = ref('')
    let timeInterval = null
    
    // 颜色选择器
    const selectedColor = ref('#ff6b6b')
    const colorOptions = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#ff6348', '#2ed573', '#1e90ff', '#ffa502', '#ff3838'
    ]

    // 更新时间
    const updateTime = () => {
      const now = new Date()
      currentTime.value = now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
      currentDate.value = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    }

    onMounted(() => {
      console.log('=== HelloWorld组件加载 ===')
      
      // 获取用户信息
      const cached = localStorage.getItem('user')
      if (cached) {
        try {
          userInfo.value = JSON.parse(cached)
          console.log('从缓存获取用户信息:', userInfo.value)
        } catch (e) {
          console.log('解析用户信息失败:', e)
        }
      }
      
      // 尝试从token获取用户信息
      const tokenUserInfo = getUserFromToken()
      if (tokenUserInfo && !userInfo.value) {
        userInfo.value = tokenUserInfo
        console.log('从Token获取用户信息:', tokenUserInfo)
      }
      
      // 启动时间更新
      updateTime()
      timeInterval = setInterval(updateTime, 1000)
      
      console.log('✅ HelloWorld组件加载完成')
    })

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval)
      }
    })

    const logout = () => {
      authLogout()
      router.push('/login')
    }
    
    const handleCommand = (command) => {
      if (command === 'logout') {
        logout()
      }
    }
    
    const selectColor = (color) => {
      selectedColor.value = color
      console.log('选择颜色:', color)
    }

    // 计算当月有多少天
    const getDaysInMonth = (year, month) => {
      return new Date(year, month + 1, 0).getDate()
    }

    // 计算当月第一天是星期几
    const getFirstDayOfMonth = (year, month) => {
      return new Date(year, month, 1).getDay()
    }

    // 生成当月日历格数据
    const calendarDays = computed(() => {
      const daysInMonth = getDaysInMonth(year.value, month.value)
      const firstDay = getFirstDayOfMonth(year.value, month.value)
      const days = []

      // 补全上月的天数
      for (let i = firstDay - 1; i >= 0; i--) {
        const day = getDaysInMonth(year.value, month.value - 1) - i
        const date = new Date(year.value, month.value - 1, day)
        days.push({
          day,
          formattedDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
          isCurrentMonth: false,
        })
      }

      // 当月天数
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year.value, month.value, i)
        days.push({
          day: i,
          formattedDate: `${year.value}-${String(month.value + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
          isCurrentMonth: true,
        })
      }

      // 补全下月的天数，使每行7个格子
      const remaining = 42 - days.length
      for (let i = 1; i <= remaining; i++) {
        const date = new Date(year.value, month.value + 1, i)
        days.push({
          day: i,
          formattedDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
          isCurrentMonth: false,
        })
      }

      return days
    })

    // 切换月份
    const changeMonth = (delta) => {
      const newMonth = month.value + delta
      let newYear = year.value

      if (newMonth < 0) {
        newYear = year.value - 1
        month.value = 11
      } else if (newMonth > 11) {
        newYear = year.value + 1
        month.value = 0
      } else {
        month.value = newMonth
      }
      
      year.value = newYear
    }

    return {
      userInfo,
      logout,
      handleCommand,
      selectColor,
      currentTime,
      currentDate,
      selectedColor,
      colorOptions,
      currentYear: computed(() => year.value),
      currentMonth: computed(() => month.value),
      weekDays,
      calendarDays,
      changeMonth
    }
  }
}
</script>

<style scoped>
/* 引入 Font Awesome 图标库 */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.calendar-app {
  height: 100vh;
  width: 100vw;
  background: #000;
  font-family: 'Microsoft YaHei', Arial, sans-serif;
  overflow: hidden;
}

.app-container {
  height: 100vh;
  width: 100vw;
  background: transparent;
}

/* 头部样式 */
.app-header {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 30px;
  display: flex;
  align-items: center;
  height: 80px !important;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.time-info h2 {
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.time-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin: 5px 0 0 0;
}

.user-menu {
  display: flex;
  align-items: center;
}

.user-dropdown-btn {
  color: #fff !important;
  font-size: 18px;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.user-dropdown-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

/* 侧边栏样式 */
.app-aside {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  height: calc(100vh - 80px);
  overflow-y: auto;
}

.color-picker-section h3 {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  margin: 0 auto;
}

.color-option:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.color-option.selected {
  border-color: #fff;
  transform: scale(1.2);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
}

/* 主内容区域样式 */
.app-main {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 30px;
  height: calc(100vh - 80px);
  overflow-y: auto;
}

.calendar-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 30px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.calendar-header h2 {
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

/* 日历网格 */
.calendar-grid {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.week-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.week-day {
  text-align: center;
  color: #fff;
  font-weight: 600;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 14px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  flex: 1;
}

.calendar-day {
  height: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 60px;
}

.calendar-day.current-month {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.calendar-day:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.day-number {
  font-size: 16px;
  font-weight: 500;
  color: #fff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    padding: 0 15px;
    height: 60px !important;
  }
  
  .time-info h2 {
    font-size: 18px;
  }
  
  .time-info p {
    font-size: 12px;
  }
  
  .app-aside {
    width: 150px !important;
    padding: 15px;
    height: calc(100vh - 60px);
  }
  
  .color-option {
    width: 30px;
    height: 30px;
  }
  
  .app-main {
    padding: 15px;
    height: calc(100vh - 60px);
  }
  
  .calendar-container {
    padding: 20px;
  }
  
  .calendar-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .calendar-header h2 {
    font-size: 20px;
  }
  
  .calendar-day {
    min-height: 50px;
  }
  
  .day-number {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .app-aside {
    width: 120px !important;
    padding: 10px;
    height: calc(100vh - 60px);
  }
  
  .color-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .color-option {
    width: 25px;
    height: 25px;
  }
  
  .app-main {
    height: calc(100vh - 60px);
  }
  
  .calendar-days {
    gap: 4px;
  }
  
  .week-header {
    gap: 4px;
  }
  
  .calendar-day {
    min-height: 40px;
  }
  
  .day-number {
    font-size: 12px;
  }
}
</style>