<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestAssessmentStore } from '@/stores/test-assessment.ts'
import TestAssessmentTable from '@/components/AllTestAssessments/TestAssessmentTable.vue'

export default defineComponent({
  name: 'TestAssessmentTabs',
  components: { TestAssessmentTable },
  computed: {
    ...mapWritableState(useTestAssessmentStore, ['tab']),
  },
})
</script>

<template>
  <v-container fluid>
    <v-col class="pa-0 ma-0">
      <v-tabs v-model="tab">
        <v-tab value="unchecked">Не проверено</v-tab>
        <v-tab value="checked">Проверено</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="unchecked">
          <test-assessment-table />
        </v-tabs-window-item>
        <v-tabs-window-item value="checked">
          <test-assessment-table />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-col>
  </v-container>
</template>

<style scoped></style>
