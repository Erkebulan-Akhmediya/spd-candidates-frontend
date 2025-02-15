import { defineStore } from 'pinia'
import type { TestSessionForAssessment } from '@/interfaces/test-assessment.ts'

export const useTestAssessmentStore = defineStore('testAssessmentStore', {
  state() {
    return {
      tab: 'unchecked' as 'unchecked' | 'checked',
      testSession: null as TestSessionForAssessment | null,
    }
  },
})
