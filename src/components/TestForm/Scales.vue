<script lang="ts">
import { defineComponent } from 'vue'
import ScalePanel from '@/components/TestForm/Scales/ScalePanel.vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import type { Scale } from '@/interfaces/test-evaluation.ts'
import TestCreatorService from '@/services/TestCreatorService.ts'
import { TestType } from '@/interfaces/test.ts'

export default defineComponent({
  name: `Scales`,
  components: { ScalePanel },

  computed: {
    TestType() {
      return TestType
    },
    ...mapWritableState(useTestStore,['test']),
    testCreator: () => TestCreatorService.getInstance()
  },

  methods: {
    addScale(): void {
      const newScaleIndex: number = this.test.scales.length + 1;
      const newScale: Scale = this.testCreator.newScale(newScaleIndex);
      this.test.scales.push(newScale)
    },
  }

})
</script>

<template>
  <v-expansion-panels variant="popout">
    <scale-panel v-for="scale in test.scales" :key="scale.index" :scale-index="scale.index" />
  </v-expansion-panels>
  <v-row justify="center" class="ma-3" v-if="test.type === TestType.withMcqHavingNoCorrect">
    <v-btn color="primary" @click="addScale">Добавить шкалу</v-btn>
  </v-row>
</template>

<style scoped></style>
