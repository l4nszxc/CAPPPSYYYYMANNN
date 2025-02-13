import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'

const routes = [
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
  // ... other routes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router