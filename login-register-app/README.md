# 登录注册界面应用

一个基于Vue 3的现代化登录注册界面，具有星空背景特效和响应式设计。

## 功能特性

- 🌟 **星空背景特效** - 动态星空背景，包含闪烁星星、月亮和云层动画
- 🔐 **用户认证** - 登录、注册、密码重置功能
- 📱 **响应式设计** - 适配各种屏幕尺寸
- 🎨 **现代化UI** - 毛玻璃效果、渐变背景、流畅动画
- ⚡ **Vue 3 + Vite** - 快速开发和构建
- 🎯 **Element Plus** - 丰富的UI组件库

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vue Router 4** - 官方路由管理器
- **Vite** - 下一代前端构建工具
- **Element Plus** - Vue 3 UI组件库
- **Axios** - HTTP客户端
- **CSS3** - 现代CSS特性（动画、渐变、毛玻璃效果）

## 项目结构

```
login-register-app/
├── public/                 # 静态资源
├── src/
│   ├── components/        # Vue组件
│   │   ├── LoginRegister.vue    # 登录注册组件
│   │   └── ResetPassword.vue    # 重置密码组件
│   ├── router/            # 路由配置
│   │   └── index.js
│   ├── assets/           # 资源文件
│   ├── App.vue           # 根组件
│   └── main.js           # 入口文件
├── index.html            # HTML模板
├── package.json          # 项目配置
├── vite.config.js        # Vite配置
└── README.md            # 项目说明
```

## 安装和运行

### 1. 安装依赖

```bash
cd C:\Users\Haruka\Studyyyyyyy\login-register-app
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:8000` 启动

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 页面功能

### 登录页面
- 用户名和密码输入
- 忘记密码链接
- 切换到注册页面

### 注册页面
- 邮箱地址输入
- 邮箱验证码发送（60秒倒计时）
- 手机号输入
- 密码和确认密码
- 切换到登录页面

### 重置密码页面
- 邮箱地址输入
- 邮箱验证码发送（60秒倒计时）
- 新密码设置
- 返回登录页面

## 后端接口

应用需要以下后端接口支持：

- `POST /person/login` - 用户登录
- `POST /person/register` - 用户注册
- `POST /person/send-verification` - 发送验证码
- `POST /person/reset-password` - 重置密码

## 样式特性

- **星空背景** - 多层背景效果，包含CSS星星和外部图片
- **月亮动画** - 发光效果和位置动画
- **毛玻璃效果** - 半透明背景和模糊效果
- **响应式布局** - 适配移动端和桌面端
- **流畅动画** - CSS3动画和过渡效果

## 浏览器支持

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 开发说明

- 使用Vue 3 Composition API
- 支持TypeScript（可选）
- 使用Vite进行快速热重载
- 集成Element Plus图标库
- 支持现代ES6+语法

## 许可证

MIT License



