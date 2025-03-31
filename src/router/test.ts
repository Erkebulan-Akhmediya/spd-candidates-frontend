import type { RouteRecordRaw } from 'vue-router'

export default new Array<RouteRecordRaw>(
  {
    path: 'test/all',
    component: () => import('@/views/AllTests.vue')
  },
  {
    path: 'test/constructor/all',
    component: () => import('@/views/TestsConstructor.vue')
  },
  {
    path: 'test/constructor/essay',
    component: () => import('@/views/EssayTopics.vue')
  },
  {
    path: 'test/assessment/all',
    component: () => import('@/views/AllTestAssessments.vue')
  },
  {
    path: 'test/result/all',
    component: () => import('@/views/AllTestResults.vue')
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
    path: 'test/:test_session_id/assessment',
    component: () => import('@/views/TestAssessment.vue'),
  },
  {
    path: 'test/:test_session_id/result',
    component: () => import('@/views/TestResult.vue'),
  }
);
