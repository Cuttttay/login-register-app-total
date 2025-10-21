import { createRouter, createWebHistory } from 'vue-router'
import LoginRegister from '../components/LoginRegister.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import ResetPassword from '../components/ResetPassword.vue'
import HelloWorld from '../components/HelloWorld.vue'
import Fail from '../components/Fail.vue'

const routes = [
  {
    path: '/',
    name: 'LoginRegister',
    component: LoginRegister
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword
  },
  {
    path: '/HelloWorld',
    name: 'HelloWorld',
    component: HelloWorld
  },
  {
    path: '/Fail',
    name: 'Fail',
    component: Fail
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router



