<script lang="ts">
import { defineComponent } from 'vue'
import { getTranslatedName } from '@/utils/Translate.ts'
import { mapWritableState } from 'pinia'
import { useRegionStore } from '@/stores/region.ts'
import hasRole from '@/utils/HasRole.ts'

export default defineComponent({
  name: 'RegionSideBar',

  computed: {
    ...mapWritableState(useRegionStore, ['regions', 'selectedRegionId']),
  },

  methods: {
    hasRole,
    getTranslatedName,
  },
})
</script>

<template>
  <v-navigation-drawer permanent v-if="!hasRole('hr')">
    <v-list v-model:selected="selectedRegionId" density="compact">
      <v-list-item
        v-for="region in regions"
        :key="region.id"
        :title="getTranslatedName(region)"
        :value="region.id"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>
