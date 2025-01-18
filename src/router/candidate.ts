import type { RouteRecordRaw } from 'vue-router'

export default new Array<RouteRecordRaw>(
  {
    path: 'candidate/all',
    component: () => import('@/views/AllCandidates.vue')
  },
  {
    path: 'candidate/create',
    component: () => import('@/views/CandidateForm.vue'),
    props: {
      tab: 'create'
    }
  },
  {
    path: 'candidate/:id',
    component: () => import('@/views/CandidateForm.vue'),
    props: {
      tab: 'new'
    }
  },
  {
    path: 'candidate/:id/security',
    component: () => import('@/views/CandidateForm.vue'),
    props: {
      tab: 'security'
    }
  },
  {
    path: 'candidate/:id/approval',
    component: () => import('@/views/CandidateForm.vue'),
    props: {
      tab: 'approval'
    }
  },
  {
    path: 'candidate/:id/approved',
    component: () => import('@/views/CandidateForm.vue'),
    props: {
      tab: 'approved'
    }
  },
  {
    path: 'candidate/:id/rejected',
    component: () => import('@/views/CandidateForm.vue'),
    props: {
      tab: 'rejected'
    }
  }
);
