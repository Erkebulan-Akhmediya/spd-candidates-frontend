<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestResultStore } from '@/stores/test-result.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import type { TestSessionResult } from '@/interfaces/test-result.ts'

export default defineComponent({
  name: 'TestAssessmentResult',

  computed: {
    ...mapWritableState(useTestResultStore, ['testSessionResults']),
  },

  methods: {
    getTranslatedName,
    getQuestionName(result: TestSessionResult): string {
      return getTranslatedName({
        nameRus: result.questionNameRus!,
        nameKaz: result.questionNameKaz!
      })
    },
  },
})
</script>

<template>
  <v-card v-for="(result, index) in testSessionResults" :key="index" elevation="10" class="mb-10">
    <v-card-text>
      <v-col cols="12">
        <h4>Вопрос</h4>
        <p class="mb-5">{{ getQuestionName(result) }}</p>
        <v-textarea
          label="Ответ"
          variant="outlined"
          rows="10"
          v-model="result.answer"
          readonly
        />
        <v-textarea label="Оценка" variant="outlined" v-model="result.assessment" readonly />
      </v-col>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
