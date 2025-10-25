# 个人日程管理系统 🗓️

一个基于Vue 3 + Spring Boot的全栈个人日程管理应用，集成了用户认证、待办事项管理、纪念日提醒、生日管理和倒数日功能。

## ✨ 功能特性

### 🔐 用户认证系统
- **用户登录** - JWT Token认证，安全可靠
- **用户注册** - 邮箱验证码验证，支持手机号注册
- **密码重置** - 邮箱验证码重置密码
- **自动登录** - Token自动续期，提升用户体验
- **登出功能** - 安全退出，清除本地认证信息

### 📅 日历管理
- **月度视图** - 直观的月历显示，支持前后月份切换
- **实时时间** - 顶部显示当前时间和日期
- **响应式设计** - 适配各种屏幕尺寸
- **美观界面** - 星空背景，毛玻璃效果

### ✅ 待办事项管理 (Todo)
- **添加待办** - 按日期创建待办事项
- **颜色标记** - 15种颜色可选，方便分类
- **编辑功能** - 实时修改待办内容和颜色
- **删除管理** - 完成或删除不需要的待办
- **日历预览** - 在日历上直接显示当日待办

### 💖 纪念日管理 (Anniversary)
- **添加纪念日** - 记录重要的日子
- **日期管理** - 支持历史和未来日期
- **分类显示** - 按时间顺序排列
- **快速操作** - 一键添加和删除

### 🎂 生日管理 (Birthday)
- **生日记录** - 记录亲友生日信息
- **生日提醒** - 智能计算即将到来的生日
- **年龄计算** - 自动处理跨年生日提醒
- **今日生日** - 特别显示当天的生日

### ⏰ 倒数日管理 (Countdown)
- **目标设定** - 设置重要事件的目标日期
- **剩余天数** - 实时计算还有多少天
- **详情查看** - 点击查看倒数详情
- **状态分类** - 区分即将到来、今日、已过期的倒数

## 🛠️ 技术栈

### 前端技术
- **Vue 3** - 组合式API，响应式框架
- **Vite** - 快速构建工具，热重载开发
- **Pinia** - 状态管理，替代Vuex
- **Vue Router 4** - 前端路由管理
- **Element Plus** - UI组件库，丰富的组件
- **Axios** - HTTP客户端，API请求
- **SASS** - CSS预处理器
- **Font Awesome** - 图标库

### 后端集成
- **Spring Boot** - Java后端框架
- **JWT认证** - 无状态认证
- **MySQL数据库** - 数据持久化
- **RESTful API** - 标准化接口设计

## 📁 项目结构

```
login-register-app/
├── public/                     # 静态资源
├── src/
│   ├── components/            # Vue组件
│   │   ├── HelloWorld.vue          # 主应用界面
│   │   ├── Login.vue               # 登录组件
│   │   ├── Register.vue            # 注册组件
│   │   ├── LoginRegister.vue       # 登录注册切换
│   │   ├── ResetPassword.vue       # 重置密码
│   │   ├── TodoItem.vue            # 待办事项组件
│   │   ├── CalendarCell.vue        # 日历单元格
│   │   ├── ColorPicker.vue         # 颜色选择器
│   │   └── Fail.vue                # 错误页面
│   ├── stores/               # Pinia状态管理
│   │   ├── todoStore.js            # 待办事项状态
│   │   ├── anniversaryStore.js     # 纪念日状态
│   │   ├── birthdayStore.js        # 生日状态
│   │   └── countdownStore.js       # 倒数日状态
│   ├── services/             # API服务
│   │   └── api.js                  # 统一API接口
│   ├── config/               # 配置文件
│   │   └── api.js                  # API配置
│   ├── utils/                # 工具函数
│   │   └── auth.js                 # 认证工具
│   ├── router/               # 路由配置
│   │   └── index.js
│   ├── assets/               # 静态资源
│   ├── App.vue               # 根组件
│   └── main.js               # 应用入口
├── index.html                # HTML模板
├── package.json              # 项目配置
├── vite.config.js            # Vite配置
└── README.md                 # 项目说明
```

## 🚀 安装和运行

### 环境要求
- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **Java** >= 17 (后端)
- **MySQL** >= 8.0 (数据库)

### 1. 克隆项目
```bash
git clone <repository-url>
cd login-register-app/login-register-app
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
# 或使用批处理文件
./start-dev.bat
```

应用将在 `http://localhost:8000` 启动

### 4. 构建生产版本
```bash
npm run build
```

### 5. 预览生产版本
```bash
npm run preview
```

## 🔌 API接口

### 用户认证接口
- `POST /person/login` - 用户登录
- `POST /person/register` - 用户注册  
- `POST /person/send-verification` - 发送验证码
- `POST /person/reset-password` - 重置密码
- `GET /person/profile` - 获取用户信息
- `POST /person/logout` - 用户登出

### 待办事项接口
- `GET /api/todos` - 获取所有待办事项
- `POST /api/todos` - 创建待办事项
- `PUT /api/todos/{id}` - 更新待办事项
- `DELETE /api/todos/{id}` - 删除待办事项

### 纪念日接口
- `GET /api/anniversaries` - 获取所有纪念日
- `POST /api/anniversaries` - 创建纪念日
- `DELETE /api/anniversaries/{id}` - 删除纪念日

### 生日管理接口
- `GET /api/birthdays` - 获取所有生日
- `POST /api/birthdays` - 创建生日记录
- `DELETE /api/birthdays/{id}` - 删除生日记录

### 倒数日接口
- `GET /api/countdowns` - 获取所有倒数日
- `POST /api/countdowns` - 创建倒数日
- `DELETE /api/countdowns/{id}` - 删除倒数日

## 💡 使用指南

### 1. 用户注册登录
1. 访问应用首页，点击"注册"
2. 输入邮箱和手机号，获取验证码
3. 设置密码完成注册
4. 使用邮箱/手机号和密码登录

### 2. 日历使用
- 在主界面查看当月日历
- 点击日期可添加待办事项
- 使用左右箭头切换月份
- 日历上会显示当日的待办事项预览

### 3. 待办事项管理
1. 点击日历日期打开待办弹窗
2. 输入待办标题，选择颜色
3. 点击"添加"保存待办事项
4. 在列表中可以编辑或删除待办

### 4. 特殊日期管理
- 点击侧边栏的"纪念日"、"倒数日"、"生日"按钮
- 在弹窗中添加相应的日期信息
- 系统会自动排序和提醒

## 🎨 界面特色

### 视觉设计
- **星空背景** - 动态星空效果，营造沉浸式体验
- **毛玻璃效果** - 半透明背景，现代化设计风格
- **渐变色彩** - 丰富的色彩搭配，15种颜色可选
- **动画效果** - 流畅的过渡动画，提升交互体验

### 用户体验
- **响应式设计** - 完美适配桌面和移动设备
- **实时更新** - 数据实时同步，无需手动刷新
- **操作简便** - 直观的操作界面，易于上手
- **状态提示** - 清晰的加载和错误提示

## 📱 浏览器支持

- **Chrome** 88+
- **Firefox** 85+  
- **Safari** 14+
- **Edge** 88+
- **移动端浏览器** 完全支持

## 🔧 配置说明

### 环境变量
```bash
VITE_BACKEND_URL=http://localhost:8081  # 后端API地址
```

### 代理配置
开发环境自动代理 `/api` 请求到后端服务器

### JWT配置
- Token存储在localStorage中
- 自动在请求头中添加Authorization
- Token过期自动跳转登录页

## 🐛 常见问题

### Q: 登录后页面空白？
A: 检查后端服务是否正常运行，确认API地址配置正确

### Q: 验证码收不到？
A: 确认邮箱地址正确，检查垃圾邮件文件夹

### Q: 数据无法保存？
A: 确认网络连接正常，后端数据库服务运行正常

### Q: 页面样式异常？
A: 清除浏览器缓存，刷新页面重新加载资源

## 📈 更新日志

### v1.0.0 (当前版本)
- ✅ 完整的用户认证系统
- ✅ 待办事项管理功能
- ✅ 纪念日、生日、倒数日管理
- ✅ 响应式日历界面
- ✅ Pinia状态管理集成
- ✅ JWT认证机制
- ✅ 完整的CRUD操作

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

## 📄 许可证

MIT License

## 👥 联系方式

如有问题或建议，请通过以下方式联系：
- 创建Issue
- 提交Pull Request
- 发送邮件

---

**感谢使用个人日程管理系统！** 🎉
