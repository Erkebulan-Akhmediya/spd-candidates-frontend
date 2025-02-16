<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestResultStore } from '@/stores/test-result.ts'
import { getTranslatedName } from '@/utils/Translate';
import type { TestSessionResult } from '@/interfaces/test-result.ts'

export default defineComponent({
  name: 'TestEvaluationResult',
  computed: {
    ...mapWritableState(useTestResultStore, ['testSessionResults']),
  },
  methods: {
    getTranslatedName,
    getScaleName(result: TestSessionResult): string {
      return getTranslatedName({
        nameRus: result.scaleNameRus!,
        nameKaz: result.scaleNameKaz!
      })
    },
    getDescriptionName(result: TestSessionResult): string {
      return getTranslatedName({
        nameRus: result.descriptionRus!,
        nameKaz: result.descriptionKaz!
      })
    }
  }
})
</script>

<template>
  <v-card v-for="(result, index) in testSessionResults" :key="index" elevation="7" class="mb-7">
    <v-card-text>
      <p v-if="testSessionResults.length > 1">Шкала: {{ getScaleName(result) }}</p>
      <p class="my-3">Балл: {{ result.score }}</p>
      <v-textarea
        v-if="result.descriptionRus || result.descriptionKaz"
        label="Описание"
        rows="7"
        variant="outlined"
        :model-value="getDescriptionName(result)"
        readonly
      />
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
