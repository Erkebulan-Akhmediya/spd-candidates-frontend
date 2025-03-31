import { defineStore } from 'pinia'

export const useIrohaStore = defineStore('iroha', {
  state() {
    return {
      irohasMode: false,
    }
  }
})
