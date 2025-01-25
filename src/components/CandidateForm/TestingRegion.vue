<script lang="ts">
import { defineComponent } from 'vue'
import type { Region } from '@/interfaces/global.ts'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'
import { getTranslatedName } from '@/utils/Translate.ts'

export default defineComponent({
  name: 'TestingRegion',

  props: {
    disabled: Boolean,
    readonly: Boolean,
  },

  data() {
    return {
      regions: new Array<Region>(),
    }
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate']),
  },

  async created() {
    await this.fetchRegions()
  },

  methods: {
    getTranslatedName,
    async fetchRegions() {
      try {
        const { data } = await this.axios.get('/region/all')
        this.regions = data
      } catch (e: unknown) {
        console.log(e)
        this.$emit('error', 'Не удалось вывести справочные данные по регоинам тестирования')
      }
    },
  },
})
</script>

<template>
  <v-autocomplete
    label="Регион тестирования"
    variant="outlined"
    :items="regions"
    item-value="id"
    :item-title="getTranslatedName"
    v-model="candidate.testingRegionId"
    :disabled="disabled"
    :readonly="readonly"
  />
</template>

<style scoped></style>
