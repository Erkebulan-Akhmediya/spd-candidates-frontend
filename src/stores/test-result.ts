import { defineStore } from 'pinia'
import type { TestSessionResult } from '@/interfaces/test-result.ts'

export const useTestResultStore = defineStore('testResultStore', {
  state() {
    return {
      resultType: "" as string,
      testSessionResults: [] as TestSessionResult[],
    }
  },
})
