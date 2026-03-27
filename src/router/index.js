import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../view/LoginView.vue'
import RegisterView from '../view/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login',    component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/',         component: () => import('../view/HomeView.vue'),    meta: { requiresAuth: true } },
    { path: '/add',      component: () => import('../view/AddMealView.vue'), meta: { requiresAuth: true } },
    { path: '/log',      component: () => import('../view/LogView.vue'),     meta: { requiresAuth: true } },
    { path: '/report',   component: () => import('../view/ReportView.vue'),  meta: { requiresAuth: true } },
  ]
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const { useAuthStore } = await import('../stores/auth.js')
    const auth = useAuthStore()
    await auth.checkAuth()
    if (!auth.isLoggedIn) return '/login'
  }
})

export default router