<script lang="ts">
import { defineComponent } from 'vue'
import AllCandidatesMain from '@/components/AllCandidates/AllCandidatesMain.vue'

interface Region {
  id: number
  nameRus: string
  nameKaz: string
}

export default defineComponent({
  name: `Candidate`,
  components: { AllCandidatesMain },

  data() {
    return {
      regions: new Array<Region>(),
      selectedRegionId: Number(),
    }
  },

  async created(): Promise<void> {
    await this.getAllRegions()
  },

  methods: {
    async getAllRegions(): Promise<void> {
      try {
        const { data } = await this.axios.get('/region/all')
        this.regions = data
        this.regions.unshift({
          id: -1,
          nameRus: 'Все регионы',
          nameKaz: 'Барлық аумақтар',
        })
      } catch (e: unknown) {
        console.log(e)
      }
    },

    getRegionName(region: Region): string {
      return this.$i18n.locale === 'ru' ? region.nameRus : region.nameKaz
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
          :title="getRegionName(region)"
          :value="region.id"
        />
      </v-list>
    </v-navigation-drawer>

    <v-container fluid class="pa-0 ma-0">
      <all-candidates-main :region-id="selectedRegionId" />
    </v-container>
  </v-container>
</template>

<style scoped></style>
