<script lang="ts">
import { defineComponent } from 'vue'
import type { Region } from '@/interfaces/interfaces.ts'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'

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
    async fetchRegions() {
      try {
        const { data } = await this.axios.get('/region/all')
        this.regions = data
      } catch (e: unknown) {
        console.log(e)
        this.$emit('error', 'Не удалось вывести справочные данные по регоинам тестирования')
      }
    },

    getRegionName(region: Region): string {
      if (this.$i18n.locale === 'ru') return region.nameRus
      return region.nameKaz
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
    :item-title="getRegionName"
    v-model="candidate.testingRegionId"
    :disabled="disabled"
    :readonly="readonly"
  />
</template>

<style scoped></style>
