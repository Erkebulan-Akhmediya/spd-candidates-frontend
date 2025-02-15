import { defineStore } from 'pinia'
import type { TestSessionForAssessment } from '@/interfaces/test-assessment.ts'

export const useTestAssessmentStore = defineStore('testAssessmentStore', {
  state() {
    return {
      testSession: null as TestSessionForAssessment | null,
    }
  },
})
