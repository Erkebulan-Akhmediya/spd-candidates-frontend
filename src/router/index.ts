import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalizedGeneric,
  type Router,
} from 'vue-router'
import candidateRoutes from './candidate.ts'

const router: Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/',
      component: () => import('@/templates/Main.vue'),
      children: [
        {
          path: 'employee/all',
          component: () => import('@/views/AllEmployees.vue'),
        },
        ...candidateRoutes,
      ],
    },
  ],
})

router.beforeEach((to: RouteLocationNormalizedGeneric) => {
  const token: string | null = sessionStorage.getItem('token')

  if (to.path !== '/login') {
    if (token === null) return { path: '/login' }
  } else {
    sessionStorage.removeItem('token')
  }
})

export default router
