<script lang="ts">
import { defineComponent } from 'vue'
import RegionSideBar from '@/components/RegionSideBar.vue'
import TestAssessmentTabs from '@/components/AllTestAssessments/TestAssessmentTabs.vue'

export default defineComponent({
  name: 'AllTestAssessments',
  components: { TestAssessmentTabs, RegionSideBar }
})
</script>

<template>
  <v-container fluid>
    <region-side-bar />
    <test-assessment-tabs />
  </v-container>
</template>

<style scoped></style>
