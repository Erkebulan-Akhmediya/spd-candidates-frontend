import type { RouteRecordRaw } from 'vue-router'

export default new Array<RouteRecordRaw>(
  {
    path: 'test/constructor/all',
    component: () => import('@/views/TestsConstructor.vue')
  },
  {
    path: 'test/all',
    component: () => import('@/views/AllTests.vue')
  },
  {
    path: 'test/create',
    component: () => import('@/views/TestForm.vue'),
  },
  {
    path: 'test/:id',
    component: () => import('@/views/TestPassing.vue'),
  },
  {
    path: 'test/:id/evaluation',
    component: () => import('@/views/TestEvaluationForm.vue')
  },
);
