<script lang="ts">
import { defineComponent } from 'vue'
import RegionSideBar from '@/components/RegionSideBar.vue'

export default defineComponent({
  name: 'TestAssessmentList',
  components: { RegionSideBar }
})
</script>

<template>
  <v-container fluid>
    <region-side-bar />
  </v-container>
</template>

<style scoped></style>
