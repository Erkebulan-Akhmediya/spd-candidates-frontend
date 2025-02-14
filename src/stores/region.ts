import { defineStore } from 'pinia'
import type { Region } from '@/interfaces/global.ts'

export const useRegionStore = defineStore('region', {
  state: () => {
    return {
      regions: new Array<Region>(),
      selectedRegionId: [-1],
    }
  },
})
