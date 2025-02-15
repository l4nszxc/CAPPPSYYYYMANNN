import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Home from '../views/user/Home.vue'
import VerifyOTP from '../views/VerifyOTP.vue'
import AdminHome from '../views/admin/AdminHome.vue'
import RecruitStaff from '../views/admin/RecruitStaff.vue'
import StaffHome from '../views/staff/StaffHome.vue'

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
  },
  {
    path: '/admin/recruit-staff',
    name: 'RecruitStaff',
    component: RecruitStaff,
    meta: { requiresAuth: true, requiresAdmin: true }
  },



    //Staff Routes
    {
      path: '/staff',
      name: 'StaffHome',
      component: StaffHome,
      meta: { requiresAuth: true, requiresStaff: true }
  }
    

    

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;
  const userRole = token ? JSON.parse(atob(token.split('.')[1])).role : null;

  if (to.meta.requiresAuth && !isAuthenticated) {
      next('/login');
  } else if (to.meta.requiresAdmin && userRole !== 'admin') {
      next('/home');
  } else if (to.meta.requiresStaff && userRole !== 'staff') {
      next('/home');
  } else if (to.meta.requiresGuest && isAuthenticated) {
      if (userRole === 'admin') {
          next('/admin');
      } else if (userRole === 'staff') {
          next('/staff');
      } else {
          next('/home');
      }
  } else {
      next();
  }
});

export default router