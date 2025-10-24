// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginRegister from '../components/LoginRegister.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import ResetPassword from '../components/ResetPassword.vue'
import HelloWorld from '../components/HelloWorld.vue'
import Fail from '../components/Fail.vue'

const routes = [
    { path: '/', name: 'LoginRegister', component: LoginRegister, meta: { public: true } },
    { path: '/login', name: 'Login', component: Login, meta: { public: true } },
    { path: '/register', name: 'Register', component: Register, meta: { public: true } },
    { path: '/reset-password', name: 'ResetPassword', component: ResetPassword, meta: { public: true } },
    // ✅ 用标准小写路径 + 兼容你现有的 /HelloWorld、/helloworld
    { path: '/hello', name: 'HelloWorld', component: HelloWorld, alias: ['/HelloWorld', '/helloworld'], meta: { requiresAuth: true } },
    { path: '/Fail', name: 'Fail', component: Fail, meta: { public: true } },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// ✅ 简易守卫：非公开路由需要 token
router.beforeEach((to, _from, next) => {
    console.log('路由守卫检查:', to.name, '是否公开:', to.meta?.public, '需要认证:', to.meta?.requiresAuth)
    
    // 如果是公开路由，直接通过
    if (to.meta?.public) {
        console.log('公开路由，直接通过')
        return next()
    }
    
    // 如果需要认证的路由，检查token
    if (to.meta?.requiresAuth) {
        const token = localStorage.getItem('jwt_token')
        console.log('需要认证的路由，检查token:', token ? '存在' : '不存在')
        if (!token) {
            console.log('没有token，跳转到登录页')
            return next({ name: 'Login' })
        }
        console.log('有token，允许访问')
    }
    
    next()
})

export default router
