<script lang="ts">
import { defineComponent } from 'vue'
import RegionSideBar from '@/components/RegionSideBar.vue'
import TestResultTable from '@/components/AllTestResults/TestResultTable.vue'

export default defineComponent({
  name: 'AllTestResults',
  components: { TestResultTable, RegionSideBar }
})
</script>

<template>
  <v-container fluid>
    <region-side-bar />
    <test-result-table />
  </v-container>
</template>

<style scoped>

</style>
