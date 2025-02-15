<script lang="ts">
import { defineComponent } from 'vue'
import RegionSideBar from '@/components/RegionSideBar.vue'
import TestAssessmentTable from '@/components/AllTestAssessments/TestAssessmentTable.vue'

export default defineComponent({
  name: 'AllTestAssessments',
  components: { TestAssessmentTable, RegionSideBar }
})
</script>

<template>
  <v-container fluid>
    <region-side-bar />
    <test-assessment-table />
  </v-container>
</template>

<style scoped></style>
