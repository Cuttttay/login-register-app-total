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
        <!-- 侧边栏 - 特殊日期管理 -->
        <el-aside width="200px" class="app-aside">
          <div class="special-dates-section">
            <h3>特殊日期</h3>
            
            <!-- 功能按钮 -->
            <div class="function-buttons">
              <div class="function-btn" @click="openAnniversaryModal">
                <i class="fa fa-heart"></i>
                <span>纪念日</span>
                <span class="count">{{ anniversaries.length }}</span>
              </div>
              
              <div class="function-btn" @click="openCountdownModal">
                <i class="fa fa-clock"></i>
                <span>倒数日</span>
                <span class="count">{{ countdowns.length }}</span>
              </div>
              
              <div class="function-btn" @click="openBirthdayModal">
                <i class="fa fa-birthday-cake"></i>
                <span>生日</span>
                <span class="count">{{ birthdays.length }}</span>
              </div>
            </div>
          </div>
        </el-aside>
        
        <!-- 主内容区域 - 日历 -->
        <el-main class="app-main">
          <div class="calendar-container">
            <div class="calendar-header">
              <el-button @click="changeMonth(-1)" class="month-nav-btn">
                <i class="fa fa-chevron-left"></i> 上一月
              </el-button>
              <h2>{{ currentYear }}年{{ currentMonth + 1 }}月</h2>
              <el-button @click="changeMonth(1)" class="month-nav-btn">
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
                  @click.stop="openTodoModal(dateInfo)"
                >
                  <div class="day-number">{{ dateInfo.day }}</div>
                  <div class="todos-preview" v-if="getTodosForDate(dateInfo.formattedDate).length > 0">
                    <div 
                      v-for="(todo, todoIndex) in getTodosForDate(dateInfo.formattedDate).slice(0, 2)" 
                      :key="todoIndex"
                      class="todo-preview"
                      :style="{ backgroundColor: todo.color }"
                    >
                      {{ todo.title }}
                    </div>
                    <div v-if="getTodosForDate(dateInfo.formattedDate).length > 2" class="more-todos">
                      +{{ getTodosForDate(dateInfo.formattedDate).length - 2 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 待办事项管理模态框 -->
    <el-dialog
      v-model="todoModalVisible"
      :title="`${selectedDateInfo ? selectedDateInfo.day + '日' : ''} 待办事项`"
      width="600px"
      class="todo-modal"
    >
      <div class="todo-management">
        <!-- 添加新待办事项 -->
        <div class="add-todo-section">
          <h4>添加新待办事项</h4>
          <div class="add-todo-form">
            <el-input
              v-model="newTodo.title"
              placeholder="输入待办事项标题"
              class="todo-input"
            />
            <div class="todo-actions">
              <div class="color-picker-mini">
                <div
                  v-for="color in colorOptions"
                  :key="color"
                  class="color-option-mini"
                  :style="{ backgroundColor: color }"
                  :class="{ 'selected': newTodo.color === color }"
                  @click="newTodo.color = color"
                ></div>
              </div>
              <el-button type="primary" @click="addTodo" :disabled="!newTodo.title.trim()">
                添加
              </el-button>
            </div>
          </div>
        </div>

        <!-- 待办事项列表 -->
        <div class="todo-list-section">
          <h4>待办事项列表</h4>
          <div class="todo-list" v-if="getTodosForDate(selectedDateInfo?.formattedDate).length > 0">
            <div
              v-for="(todo, index) in getTodosForDate(selectedDateInfo?.formattedDate)"
              :key="index"
              class="todo-item"
            >
              <div class="todo-content">
                <div class="todo-color" :style="{ backgroundColor: todo.color }"></div>
                <span class="todo-title">{{ todo.title }}</span>
              </div>
              <div class="todo-actions">
                <el-button size="small" @click="editTodo(index)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteTodo(index)">删除</el-button>
              </div>
            </div>
          </div>
          <div v-else class="no-todos">
            暂无待办事项
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 编辑待办事项模态框 -->
    <el-dialog
      v-model="editModalVisible"
      title="编辑待办事项"
      width="400px"
    >
      <div class="edit-todo-form">
        <el-input
          v-model="editingTodo.title"
          placeholder="输入待办事项标题"
          class="todo-input"
        />
        <div class="color-picker-mini">
          <div
            v-for="color in colorOptions"
            :key="color"
            class="color-option-mini"
            :style="{ backgroundColor: color }"
            :class="{ 'selected': editingTodo.color === color }"
            @click="editingTodo.color = color"
          ></div>
        </div>
        <div class="edit-actions">
          <el-button @click="editModalVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 纪念日管理弹窗 -->
    <el-dialog
      v-model="anniversaryModalVisible"
      title="纪念日管理"
      width="500px"
      class="special-date-modal"
    >
      <div class="special-date-management">
        <div class="add-form">
          <h4>添加纪念日</h4>
          <el-input v-model="newAnniversary.name" placeholder="纪念日名称" />
          <el-date-picker 
            v-model="newAnniversary.date" 
            type="date" 
            placeholder="选择日期" 
            style="width: 100%; margin: 10px 0;"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
          />
          <el-button type="primary" @click="addAnniversary" :disabled="!newAnniversary.name.trim() || !newAnniversary.date">添加</el-button>
        </div>
        
        <div class="date-list">
          <h4>纪念日列表</h4>
          <div v-if="anniversaries.length > 0">
            <div v-for="(anniversary, index) in anniversaries" :key="index" class="date-item">
              <div class="date-info">
                <span class="date-name">{{ anniversary.name }}</span>
                <span class="date-value">{{ anniversary.date }}</span>
              </div>
              <el-button size="small" type="danger" @click="removeAnniversary(index)">删除</el-button>
            </div>
          </div>
          <div v-else class="no-data">暂无纪念日</div>
        </div>
      </div>
    </el-dialog>

    <!-- 倒数日管理弹窗 -->
    <el-dialog
      v-model="countdownModalVisible"
      title="倒数日管理"
      width="500px"
      class="special-date-modal"
    >
      <div class="special-date-management">
        <div class="add-form">
          <h4>添加倒数日</h4>
          <el-input v-model="newCountdown.name" placeholder="倒数日名称" />
          <el-date-picker 
            v-model="newCountdown.date" 
            type="date" 
            placeholder="选择目标日期" 
            style="width: 100%; margin: 10px 0;"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
          />
          <el-button type="primary" @click="addCountdown" :disabled="!newCountdown.name.trim() || !newCountdown.date">添加</el-button>
        </div>
        
        <div class="date-list">
          <h4>倒数日列表</h4>
          <div v-if="countdowns.length > 0">
            <div v-for="(countdown, index) in countdowns" :key="index" class="date-item">
              <div class="date-info" @click="showCountdownDetail(countdown)">
                <span class="date-name">{{ countdown.name }}</span>
                <span class="date-value">{{ countdown.date }}</span>
                <span class="click-hint">点击查看剩余天数</span>
              </div>
              <el-button size="small" type="danger" @click="removeCountdown(index)">删除</el-button>
            </div>
          </div>
          <div v-else class="no-data">暂无倒数日</div>
        </div>
      </div>
    </el-dialog>

    <!-- 生日管理弹窗 -->
    <el-dialog
      v-model="birthdayModalVisible"
      title="生日管理"
      width="500px"
      class="special-date-modal"
    >
      <div class="special-date-management">
        <div class="add-form">
          <h4>添加生日</h4>
          <el-input v-model="newBirthday.name" placeholder="姓名" />
          <el-date-picker 
            v-model="newBirthday.date" 
            type="date" 
            placeholder="选择生日" 
            style="width: 100%; margin: 10px 0;"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
          />
          <el-button type="primary" @click="addBirthday" :disabled="!newBirthday.name.trim() || !newBirthday.date">添加</el-button>
        </div>
        
        <div class="date-list">
          <h4>生日列表</h4>
          <div v-if="birthdays.length > 0">
            <div v-for="(birthday, index) in birthdays" :key="index" class="date-item">
              <div class="date-info">
                <span class="date-name">{{ birthday.name }}</span>
                <span class="date-value">{{ birthday.date }}</span>
              </div>
              <el-button size="small" type="danger" @click="removeBirthday(index)">删除</el-button>
            </div>
          </div>
          <div v-else class="no-data">暂无生日</div>
        </div>
      </div>
    </el-dialog>

    <!-- 倒数日详情弹窗 -->
    <el-dialog
      v-model="countdownDetailVisible"
      :title="selectedCountdown ? selectedCountdown.name : '倒数日详情'"
      width="400px"
      class="countdown-detail-modal"
    >
      <div class="countdown-detail" v-if="selectedCountdown">
        <div class="countdown-info">
          <h3>{{ selectedCountdown.name }}</h3>
          <div class="target-date">
            <span class="label">目标日期：</span>
            <span class="date">{{ formatDate(selectedCountdown.date) }}</span>
          </div>
          <div class="remaining-days">
            <div class="days-number">{{ calculateRemainingDays(selectedCountdown.date) }}</div>
            <div class="days-text">天</div>
          </div>
          <div class="progress-info">
            <span v-if="calculateRemainingDays(selectedCountdown.date) > 0">还有 {{ calculateRemainingDays(selectedCountdown.date) }} 天</span>
            <span v-else-if="calculateRemainingDays(selectedCountdown.date) === 0">就是今天！</span>
            <span v-else>已过期 {{ Math.abs(calculateRemainingDays(selectedCountdown.date)) }} 天</span>
          </div>
        </div>
      </div>
    </el-dialog>
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
    
    // 颜色选择器（保留用于待办事项）
    const selectedColor = ref('#ff6b6b')
    const colorOptions = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', 
      '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
      '#ff6348', '#2ed573', '#1e90ff', '#ffa502', '#ff3838'
    ]

    // 特殊日期管理
    const anniversaries = ref([])
    const countdowns = ref([])
    const birthdays = ref([])
    
    // 弹窗控制
    const anniversaryModalVisible = ref(false)
    const countdownModalVisible = ref(false)
    const birthdayModalVisible = ref(false)
    const countdownDetailVisible = ref(false)
    const selectedCountdown = ref(null)
    
    const newAnniversary = ref({
      name: '',
      date: null
    })
    
    const newCountdown = ref({
      name: '',
      date: null
    })
    
    const newBirthday = ref({
      name: '',
      date: null
    })

    // 待办事项相关状态
    const todos = ref({}) // 存储所有待办事项，key为日期字符串
    const todoModalVisible = ref(false)
    const editModalVisible = ref(false)
    const selectedDateInfo = ref(null)
    const newTodo = ref({
      title: '',
      color: '#ff6b6b'
    })
    const editingTodo = ref({
      title: '',
      color: '#ff6b6b',
      index: -1
    })

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
      
      // 加载待办事项数据
      loadTodos()
      
      // 加载特殊日期数据
      loadSpecialDates()
      
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

    // 待办事项管理方法
    const loadTodos = () => {
      const savedTodos = localStorage.getItem('calendar-todos')
      if (savedTodos) {
        try {
          todos.value = JSON.parse(savedTodos)
        } catch (e) {
          console.log('加载待办事项失败:', e)
          todos.value = {}
        }
      }
    }

    const saveTodos = () => {
      localStorage.setItem('calendar-todos', JSON.stringify(todos.value))
    }

    const getTodosForDate = (dateString) => {
      if (!dateString) return []
      return todos.value[dateString] || []
    }

    const openTodoModal = (dateInfo) => {
      selectedDateInfo.value = dateInfo
      todoModalVisible.value = true
      newTodo.value = {
        title: '',
        color: selectedColor.value
      }
    }

    const addTodo = () => {
      if (!newTodo.value.title.trim() || !selectedDateInfo.value) return
      
      const dateString = selectedDateInfo.value.formattedDate
      if (!todos.value[dateString]) {
        todos.value[dateString] = []
      }
      
      todos.value[dateString].push({
        id: Date.now(),
        title: newTodo.value.title.trim(),
        color: newTodo.value.color,
        createdAt: new Date().toISOString()
      })
      
      saveTodos()
      newTodo.value = {
        title: '',
        color: selectedColor.value
      }
    }

    const editTodo = (index) => {
      if (!selectedDateInfo.value) return
      
      const dateString = selectedDateInfo.value.formattedDate
      const todo = todos.value[dateString][index]
      
      editingTodo.value = {
        title: todo.title,
        color: todo.color,
        index: index
      }
      
      editModalVisible.value = true
    }

    const saveEdit = () => {
      if (!selectedDateInfo.value || editingTodo.value.index === -1) return
      
      const dateString = selectedDateInfo.value.formattedDate
      todos.value[dateString][editingTodo.value.index] = {
        ...todos.value[dateString][editingTodo.value.index],
        title: editingTodo.value.title.trim(),
        color: editingTodo.value.color
      }
      
      saveTodos()
      editModalVisible.value = false
    }

    const deleteTodo = (index) => {
      if (!selectedDateInfo.value) return
      
      const dateString = selectedDateInfo.value.formattedDate
      todos.value[dateString].splice(index, 1)
      
      if (todos.value[dateString].length === 0) {
        delete todos.value[dateString]
      }
      
      saveTodos()
    }

    // 特殊日期管理方法
    const loadSpecialDates = () => {
      const savedAnniversaries = localStorage.getItem('anniversaries')
      const savedCountdowns = localStorage.getItem('countdowns')
      const savedBirthdays = localStorage.getItem('birthdays')
      
      if (savedAnniversaries) {
        try {
          anniversaries.value = JSON.parse(savedAnniversaries)
        } catch (e) {
          console.log('加载纪念日失败:', e)
        }
      }
      
      if (savedCountdowns) {
        try {
          countdowns.value = JSON.parse(savedCountdowns)
        } catch (e) {
          console.log('加载倒数日失败:', e)
        }
      }
      
      if (savedBirthdays) {
        try {
          birthdays.value = JSON.parse(savedBirthdays)
        } catch (e) {
          console.log('加载生日失败:', e)
        }
      }
    }

    const saveSpecialDates = () => {
      localStorage.setItem('anniversaries', JSON.stringify(anniversaries.value))
      localStorage.setItem('countdowns', JSON.stringify(countdowns.value))
      localStorage.setItem('birthdays', JSON.stringify(birthdays.value))
    }

    const addAnniversary = () => {
      if (!newAnniversary.value.name.trim() || !newAnniversary.value.date) return
      
      anniversaries.value.push({
        id: Date.now(),
        name: newAnniversary.value.name.trim(),
        date: newAnniversary.value.date
      })
      
      saveSpecialDates()
      newAnniversary.value = { name: '', date: null }
    }

    const removeAnniversary = (index) => {
      anniversaries.value.splice(index, 1)
      saveSpecialDates()
    }

    const addCountdown = () => {
      if (!newCountdown.value.name.trim() || !newCountdown.value.date) return
      
      countdowns.value.push({
        id: Date.now(),
        name: newCountdown.value.name.trim(),
        date: newCountdown.value.date
      })
      
      saveSpecialDates()
      newCountdown.value = { name: '', date: null }
    }

    const removeCountdown = (index) => {
      countdowns.value.splice(index, 1)
      saveSpecialDates()
    }

    const addBirthday = () => {
      if (!newBirthday.value.name.trim() || !newBirthday.value.date) return
      
      birthdays.value.push({
        id: Date.now(),
        name: newBirthday.value.name.trim(),
        date: newBirthday.value.date
      })
      
      saveSpecialDates()
      newBirthday.value = { name: '', date: null }
    }

    const removeBirthday = (index) => {
      birthdays.value.splice(index, 1)
      saveSpecialDates()
    }

    // 打开弹窗方法
    const openAnniversaryModal = () => {
      anniversaryModalVisible.value = true
      newAnniversary.value = { name: '', date: null }
    }

    const openCountdownModal = () => {
      countdownModalVisible.value = true
      newCountdown.value = { name: '', date: null }
    }

    const openBirthdayModal = () => {
      birthdayModalVisible.value = true
      newBirthday.value = { name: '', date: null }
    }

    // 显示倒数日详情
    const showCountdownDetail = (countdown) => {
      selectedCountdown.value = countdown
      countdownDetailVisible.value = true
    }

    // 计算剩余天数
    const calculateRemainingDays = (targetDate) => {
      if (!targetDate) return 0
      
      const today = new Date()
      const target = new Date(targetDate)
      
      // 设置时间为当天开始（00:00:00）
      today.setHours(0, 0, 0, 0)
      target.setHours(0, 0, 0, 0)
      
      const diffTime = target - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      return diffDays
    }

    // 格式化日期显示
    const formatDate = (date) => {
      if (!date) return ''
      
      const d = new Date(date)
      return d.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
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
      changeMonth,
      // 待办事项相关
      todos,
      todoModalVisible,
      editModalVisible,
      selectedDateInfo,
      newTodo,
      editingTodo,
      getTodosForDate,
      openTodoModal,
      addTodo,
      editTodo,
      saveEdit,
      deleteTodo,
      // 特殊日期相关
      anniversaries,
      countdowns,
      birthdays,
      anniversaryModalVisible,
      countdownModalVisible,
      birthdayModalVisible,
      countdownDetailVisible,
      selectedCountdown,
      newAnniversary,
      newCountdown,
      newBirthday,
      addAnniversary,
      removeAnniversary,
      addCountdown,
      removeCountdown,
      addBirthday,
      removeBirthday,
      openAnniversaryModal,
      openCountdownModal,
      openBirthdayModal,
      showCountdownDetail,
      calculateRemainingDays,
      formatDate
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

.special-dates-section h3 {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
}

.function-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.function-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.function-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.function-btn i {
  color: #fff;
  font-size: 18px;
  width: 20px;
  text-align: center;
}

.function-btn span {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  flex: 1;
}

.function-btn .count {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

/* 特殊日期弹窗样式 */
.special-date-modal .el-dialog {
  background: #c0c0c0 !important;
  border: 1px solid #a8a8a8 !important;
}

.special-date-modal .el-dialog__header {
  background: #c0c0c0 !important;
  border-bottom: 1px solid #a8a8a8 !important;
}

.special-date-modal .el-dialog__body {
  background: #e8e8e8 !important;
}

.special-date-modal .el-dialog__title {
  color: #333 !important;
  font-weight: 600;
}

.special-date-modal .el-dialog__headerbtn .el-dialog__close {
  color: #333 !important;
}

.special-date-modal .el-dialog__headerbtn:hover {
  background: #a8a8a8 !important;
}

.special-date-management {
  color: #333;
}

.special-date-management h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
}

.add-form {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #a8a8a8;
}

.date-list h4 {
  margin-bottom: 15px;
}

.date-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
  margin-bottom: 10px;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.date-name {
  color: #333;
  font-size: 14px;
  font-weight: 500;
}

.date-value {
  color: #666;
  font-size: 12px;
}

.no-data {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

/* 倒数日详情弹窗样式 */
.countdown-detail-modal .el-dialog {
  background: #c0c0c0 !important;
  border: 1px solid #a8a8a8 !important;
}

.countdown-detail-modal .el-dialog__header {
  background: #c0c0c0 !important;
  border-bottom: 1px solid #a8a8a8 !important;
}

.countdown-detail-modal .el-dialog__body {
  background: #e8e8e8 !important;
}

.countdown-detail-modal .el-dialog__title {
  color: #333 !important;
  font-weight: 600;
}

.countdown-detail-modal .el-dialog__headerbtn .el-dialog__close {
  color: #333 !important;
}

.countdown-detail-modal .el-dialog__headerbtn:hover {
  background: #a8a8a8 !important;
}

.countdown-detail {
  color: #333;
  text-align: center;
}

.countdown-info h3 {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
}

.target-date {
  margin-bottom: 30px;
  font-size: 16px;
}

.target-date .label {
  color: #666;
  font-weight: 500;
}

.target-date .date {
  color: #333;
  font-weight: 600;
}

.remaining-days {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 20px;
}

.days-number {
  font-size: 48px;
  font-weight: 700;
  color: #ff6b6b;
  line-height: 1;
}

.days-text {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-left: 8px;
}

.progress-info {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.click-hint {
  color: #999;
  font-size: 11px;
  font-style: italic;
  display: block;
  margin-top: 4px;
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

/* 月份导航按钮样式 */
.month-nav-btn {
  background: #c0c0c0 !important;
  border-color: #c0c0c0 !important;
  color: #333 !important;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.month-nav-btn:hover {
  background: #a8a8a8 !important;
  border-color: #a8a8a8 !important;
  color: #000 !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.month-nav-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 60px;
  position: relative;
  padding: 8px 4px;
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

/* 待办事项预览样式 */
.todos-preview {
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.todo-preview {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.more-todos {
  background: rgba(255, 255, 255, 0.7);
  color: #333;
  font-size: 9px;
  padding: 1px 4px;
  border-radius: 3px;
  text-align: center;
  font-weight: 500;
}

/* 待办事项模态框样式 */
.todo-modal .el-dialog {
  background: #c0c0c0 !important;
  border: 1px solid #a8a8a8 !important;
}

.todo-modal .el-dialog__header {
  background: #c0c0c0 !important;
  border-bottom: 1px solid #a8a8a8 !important;
}

.todo-modal .el-dialog__body {
  background: #e8e8e8 !important;
}

.todo-modal .el-dialog__title {
  color: #333 !important;
  font-weight: 600;
}

.todo-modal .el-dialog__headerbtn .el-dialog__close {
  color: #333 !important;
}

.todo-modal .el-dialog__headerbtn:hover {
  background: #a8a8a8 !important;
}

.todo-management {
  color: #333;
}

.todo-management h4 {
  color: #333;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
}

.add-todo-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #a8a8a8;
}

.add-todo-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.todo-input {
  width: 100%;
}

.todo-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-picker-mini {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-option-mini {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.color-option-mini:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.color-option-mini.selected {
  border-color: #fff;
  transform: scale(1.2);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.todo-list-section h4 {
  margin-bottom: 15px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #d0d0d0;
}

.todo-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.todo-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.todo-title {
  color: #333;
  font-size: 14px;
}

.todo-actions {
  display: flex;
  gap: 8px;
}

.no-todos {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.edit-todo-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 编辑待办事项模态框样式 */
.el-dialog:not(.todo-modal) {
  background: #c0c0c0 !important;
  border: 1px solid #a8a8a8 !important;
}

.el-dialog:not(.todo-modal) .el-dialog__header {
  background: #c0c0c0 !important;
  border-bottom: 1px solid #a8a8a8 !important;
}

.el-dialog:not(.todo-modal) .el-dialog__body {
  background: #e8e8e8 !important;
}

.el-dialog:not(.todo-modal) .el-dialog__title {
  color: #333 !important;
  font-weight: 600;
}

.el-dialog:not(.todo-modal) .el-dialog__headerbtn .el-dialog__close {
  color: #333 !important;
}

.el-dialog:not(.todo-modal) .el-dialog__headerbtn:hover {
  background: #a8a8a8 !important;
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