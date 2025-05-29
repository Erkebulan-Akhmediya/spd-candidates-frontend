<script lang="ts">
import { defineComponent } from 'vue'
import ScalePanel from '@/components/TestForm/Scales/ScalePanel.vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import type { Scale, ScaleSection } from '@/interfaces/test-evaluation.ts'
import TestCreatorService from '@/services/TestCreatorService.ts'
import { TestType } from '@/interfaces/test.ts'

export default defineComponent({
  name: `Scales`,
  components: { ScalePanel },

  computed: {
    ...mapWritableState(useTestStore,['test', 'singleScaleTypes']),

    TestType: () => TestType,

    testCreator: () => TestCreatorService.getInstance(),

    testType(): number {
      return this.test.type
    },

    multiScaleTypes(): TestType[] {
      return [
        TestType.withMcqHavingNoCorrect,
        TestType.pointDistribution
      ]
    },
  },

  methods: {
    addScale(): void {
      const newScaleIndex: number = this.test.scales.length + 1;
      const newScale: Scale = this.testCreator.newScale(newScaleIndex);
      this.test.scales.push(newScale)
    },

    setDefaultScale(): void {
      this.test.scales = [{
        index: 1,
        nameRus: 'Шкала по умолчанию',
        nameKaz: 'Шкала по умолчанию',
        sections: new Array<ScaleSection>({
          index: 1,
          upperBound: 0,
          lowerBound: 0,
          descriptionRus: '',
          descriptionKaz: '',
          conditions: []
        }),
      }]
    }
  },

  watch: {
    testType() {
      if (this.singleScaleTypes.includes(this.test.type)) {
        this.setDefaultScale()
      }
    },
  }

})
</script>

<template>
  <v-expansion-panels variant="popout">
    <scale-panel v-for="scale in test.scales" :key="scale.index" :scale-index="scale.index" />
  </v-expansion-panels>
  <v-row justify="center" class="ma-3" v-if="multiScaleTypes.includes(test.type)">
    <v-btn color="primary" @click="addScale">Добавить шкалу</v-btn>
  </v-row>
</template>

<style scoped></style>
