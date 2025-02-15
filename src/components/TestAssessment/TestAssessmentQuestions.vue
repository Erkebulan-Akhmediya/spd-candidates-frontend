<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestAssessmentStore } from '@/stores/test-assessment.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import type { TestSessionAnswerForAssessment } from '@/interfaces/test-assessment.ts'

export default defineComponent({
  name: 'TestAssessmentQuestions',

  computed: {
    ...mapWritableState(useTestAssessmentStore, ['testSession']),
  },

  methods: {
    getTranslatedName,
    getQuestionName(answer: TestSessionAnswerForAssessment): string {
      return getTranslatedName({
        nameRus: answer.questionNameRus,
        nameKaz: answer.questionNameKaz
      })
    },
  },
})
</script>

<template>
  <v-card v-for="answer in testSession?.answers" :key="answer.id" elevation="10" class="mb-10">
    <v-card-text>
      <v-col cols="12">
        <h4>Вопрос</h4>
        <p class="mb-5">{{ getQuestionName(answer) }}</p>
        <v-textarea
          label="Ответ"
          variant="outlined"
          rows="10"
          v-model="answer.answer"
          readonly
        />
        <v-textarea label="Оценка" variant="outlined" v-model="answer.assessment" />
      </v-col>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
