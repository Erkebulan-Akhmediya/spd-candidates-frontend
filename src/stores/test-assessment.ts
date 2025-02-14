import { defineStore } from 'pinia'

export const useTestAssessmentStore = defineStore('testAssessmentStore', {
  state() {
    return {
      tab: 'unchecked' as 'unchecked' | 'checked',
    }
  },
})
