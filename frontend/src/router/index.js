import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import VerifyOTP from '../views/VerifyOTP.vue'
import AdminHome from '../views/AdminHome.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/verify-otp',
    name: 'VerifyOTP',
    component: VerifyOTP,
    meta: { requiresGuest: true }
  },





    //Admin Routes
    {
      path: '/admin',
      name: 'AdminHome',
      component: AdminHome,
      meta: { requiresAuth: true, requiresAdmin: true }
  }

    

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const isAdmin = token ? JSON.parse(atob(token.split('.')[1])).role === 'admin' : false;

  if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login');
  } else if (to.meta.requiresAdmin && !isAdmin) {
      next('/home');
  } else if (to.meta.requiresGuest && isAuthenticated) {
      next(isAdmin ? '/admin' : '/home');
  } else {
      next();
  }
});

export default router