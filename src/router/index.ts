import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalizedGeneric,
  type Router,
} from 'vue-router'

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
        },
        {
          path: 'candidate/create',
          component: () => import('@/views/CandidateForm.vue'),
          props: {
            tab: 'create'
          },
        },
        {
          path: 'candidate/:id',
          component: () => import('@/views/CandidateForm.vue'),
          props: {
            tab: 'new'
          },
        },
        {
          path: 'candidate/:id/security',
          component: () => import('@/views/CandidateForm.vue'),
          props: {
            tab: 'security'
          },
        },
        {
          path: 'candidate/:id/approval',
          component: () => import('@/views/CandidateForm.vue'),
          props: {
            tab: 'approval'
          },
        },
        {
          path: 'candidate/:id/approved',
          component: () => import('@/views/CandidateForm.vue'),
          props: {
            tab: 'approved'
          },
        },
        {
          path: 'candidate/:id/rejected',
          component: () => import('@/views/CandidateForm.vue'),
          props: {
            tab: 'rejected'
          },
        },
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
