import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/Register.vue'
import Login from '../views/Login.vue'
import Home from '../views/user/Home.vue'
import VerifyOTP from '../views/VerifyOTP.vue'
import AdminHome from '../views/admin/AdminHome.vue'
import RecruitStaff from '../views/admin/RecruitStaff.vue'
import StaffHome from '../views/staff/StaffHome.vue'
import Profile from '../views/user/Profile.vue'
import ForgotPassword from '../views/ForgotPassword.vue' 
import Products from '../views/user/Products.vue' 
import InsertProducts from '../views/admin/InsertProducts.vue'
import Cart from '../views/user/Cart.vue'
import OrderHistory from '../views/user/OrderHistory.vue'
import ViewOrder from '../views/user/ViewOrder.vue'

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
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresGuest: true }
 },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/products', // Add the products route
    name: 'Products',
    component: Products,
    meta: { requiresAuth: true }
  },
  {
    path: '/verify-otp',
    name: 'VerifyOTP',
    component: VerifyOTP,
    meta: { requiresGuest: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
    meta: { requiresAuth: true }
  },
  {
    path: '/order-history',
    name: 'OrderHistory',
    component: OrderHistory,
    meta: { requiresAuth: true }
  },
  {
    path: '/view-orders',
    name: 'ViewOrder',
    component: ViewOrder,
    meta: { requiresAuth: true }
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
    {
      path: '/admin/users',
      name: 'AllUsers',
      component: () => import('../views/admin/UsersList.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/insert-products',
      name: 'InsertProducts',
      component: InsertProducts,
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/admin/products',
      name: 'AllProducts',
      component: () => import('../views/admin/AllProducts.vue')
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