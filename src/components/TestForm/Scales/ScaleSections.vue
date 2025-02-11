<script lang="ts">
import { defineComponent } from 'vue'
import ScaleSectionPanel from '@/components/TestForm/Scales/ScaleSectionPanel.vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import TestCreatorService from '@/services/TestCreatorService.ts'
import type { ScaleSection } from '@/interfaces/test-evaluation.ts'

export default defineComponent({
  name: 'ScaleSections',
  components: { ScaleSectionPanel },
  props: {
    scaleIndex: {
      type: Number,
      required: true,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['test']),
    testCreator: () => TestCreatorService.getInstance()
  },

  methods: {
    addSection() {
      const newSectionIndex: number = this.test.scales[this.scaleIndex-1].sections.length + 1;
      const newSection: ScaleSection = this.testCreator.newScaleSection(newSectionIndex)
      this.test.scales[this.scaleIndex-1].sections.push(newSection);
    }
  },

})
</script>

<template>
  <v-expansion-panels>
    <scale-section-panel
      v-for="section in test.scales[scaleIndex-1].sections"
      :key="section.index"
      :scale-index="scaleIndex"
      :section-index="section.index"
    />
  </v-expansion-panels>
  <v-row justify="center" class="ma-3">
    <v-btn color="primary" @click="addSection">Добавить секцию</v-btn>
  </v-row>
</template>

<style scoped></style>
