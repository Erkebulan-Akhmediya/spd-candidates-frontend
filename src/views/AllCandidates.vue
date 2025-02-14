<script lang="ts">
import { defineComponent } from 'vue'
import AllCandidatesMain from '@/components/AllCandidates/AllCandidatesMain.vue'
import { mapWritableState } from 'pinia'
import { useRegionStore } from '@/stores/region.ts'
import RegionSideBar from '@/components/RegionSideBar.vue'

export default defineComponent({
  name: `Candidate`,
  components: { RegionSideBar, AllCandidatesMain },

  computed: {
    ...mapWritableState(useRegionStore, ['selectedRegionId']),
  },
})
</script>

<template>
  <v-container fluid>
    <region-side-bar />

    <v-container fluid class="pa-0 ma-0">
      <all-candidates-main :region-id="selectedRegionId[0]" />
    </v-container>
  </v-container>
</template>

<style scoped></style>
