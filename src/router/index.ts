import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
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
          path: '',
          component: () => import('@/views/Home.vue'),
        },
        {
          path: 'employee/all',
          component: () => import('@/views/AllEmployees.vue'),
        },
        {
          path: 'candidate/all',
          component: () => import('@/views/AllCandidates.vue'),
        }
      ],
    }
  ],
})

export default router
