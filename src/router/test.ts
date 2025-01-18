import type { RouteRecordRaw } from 'vue-router'

export default new Array<RouteRecordRaw>(
  {
    path: 'test/all',
    component: () => import('@/views/AllTests.vue')
  },
  {
    path: 'test/create',
    component: () => import('@/views/TestForm.vue'),
  },
);
