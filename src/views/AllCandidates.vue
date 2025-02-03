<script lang="ts">
import { defineComponent } from 'vue'
import AllCandidatesMain from '@/components/AllCandidates/AllCandidatesMain.vue'
import type { Region } from '@/interfaces/global.ts'
import { getTranslatedName } from '@/utils/Translate.ts'

export default defineComponent({
  name: `Candidate`,
  components: { AllCandidatesMain },

  data() {
    return {
      regions: new Array<Region>(),
      selectedRegionId: [-1],
    }
  },

  async created(): Promise<void> {
    await this.getAllRegions()
  },

  methods: {
    getTranslatedName,

    async getAllRegions(): Promise<void> {
      try {
        this.regions = await this.$http.get<Region[]>('/region/all')
        this.regions.unshift({
          id: -1,
          nameRus: 'Все регионы',
          nameKaz: 'Барлық аумақтар',
        })
      } catch (e: unknown) {
        console.log(e)
      }
    },
  },
})
</script>

<template>
  <v-container fluid>
    <v-navigation-drawer permanent>
      <v-list v-model:selected="selectedRegionId" density="compact">
        <v-list-item
          v-for="region in regions"
          :key="region.id"
          :title="getTranslatedName(region)"
          :value="region.id"
        />
      </v-list>
    </v-navigation-drawer>

    <v-container fluid class="pa-0 ma-0">
      <all-candidates-main :region-id="selectedRegionId[0]" />
    </v-container>
  </v-container>
</template>

<style scoped></style>
