<script lang="ts">
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import type { Scale } from '@/interfaces/test-evaluation.ts'
import ScaleSections from '@/components/TestForm/Scales/ScaleSections.vue'
import { TestType } from '@/interfaces/test.ts'

export default {
  name: `ScalePanel`,
  components: { ScaleSections },

  props: {
    scaleIndex: {
      type: Number,
      required: true,
    }
  },

  computed: {
    TestType() {
      return TestType
    },
    ...mapWritableState(useTestStore, ['test']),
    showDeleteButton(): boolean {
      return this.test.scales.length > 1
    },
    singleScaleTypes(): TestType[] {
      return [
        TestType.withMcqHavingOneCorrect,
        TestType.withMcqHavingMultipleCorrect
      ];
    },
    isSingleScale(): boolean {
      return this.singleScaleTypes.includes(this.test.type)
    }
  },

  methods: {
    deleteScale(): void {
      this.test.scales = this.test.scales
        .filter((scale: Scale): boolean => scale.index !== this.scaleIndex)
        .map((scale: Scale, index: number): Scale => ({...scale, index: index + 1}))
    }
  },

}
</script>

<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <h2>Шкала {{scaleIndex}}</h2>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-col cols="12">
        <v-row>
          <v-col :cols="showDeleteButton ? 5 : 6">
            <v-text-field
              label="Название (каз)"
              variant="outlined"
              :readonly="isSingleScale"
            />
          </v-col>
          <v-col :cols="showDeleteButton ? 5 : 6">
            <v-text-field
              label="Название (рус)"
              variant="outlined"
              :readonly="isSingleScale"
            />
          </v-col>
          <v-col cols="2" v-if="showDeleteButton">
            <v-btn color="error" @click="deleteScale">Удалить шкалу</v-btn>
          </v-col>
        </v-row>
        <scale-sections :scaleIndex="scaleIndex" />
      </v-col>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style scoped>

</style>
