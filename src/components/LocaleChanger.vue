<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useRegionStore } from '@/stores/region.ts'
import RegionService from '@/services/RegionService.ts'

export default defineComponent({
  name: 'LocaleChanger',

  data() {
    return {
      currentLocale: this.$i18n.locale,
      availableLocales: this.$i18n.availableLocales,
    }
  },

  computed: {
    ...mapWritableState(useRegionStore, ['regions']),
    regionService(): RegionService {
      return RegionService.getInstance(this.$http)
    },
  },

  methods: {
    onLocaleChange(newLocale: string) {
      this.$i18n.locale = newLocale
      sessionStorage.setItem('locale', this.$i18n.locale)
      this.regions = this.regionService.sort(this.regions)
    },
  },
})
</script>

<template>
  <v-select
    class="mt-5"
    @update:model-value="onLocaleChange"
    v-model="currentLocale"
    :items="availableLocales"
    dense
  />
</template>

<style scoped></style>
