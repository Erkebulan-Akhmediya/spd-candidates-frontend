<script lang="ts">
import type { TestSessionAnswerForAssessment } from '@/interfaces/test-assessment.ts'
import { useTestAssessmentStore } from '@/stores/test-assessment.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'

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
        nameKaz: answer.questionNameKaz,
      })
    },

    isImageUrl(url: string): boolean {
      try {
        const pathname = new URL(url).pathname
        return /\.(png|jpe?g|gif|bmp|webp)$/i.test(pathname)
      } catch (e) {
        return false
      }
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

        <div v-if="answer.fileUrl">
          <h4>Файл:</h4>

          <div v-if="isImageUrl(answer.fileUrl)">
            <img
              :src="answer.fileUrl"
              alt="Attached Image"
              style="max-width: 100%; max-height: 400px"
            />
          </div>

          <div v-else>
            <a :href="answer.fileUrl" target="_blank" rel="noopener noreferrer"> Скачать файл </a>
          </div>
        </div>

        <div v-else>
          <v-textarea label="Ответ" variant="outlined" rows="10" v-model="answer.answer" readonly />
        </div>

        <v-textarea label="Оценка" variant="outlined" v-model="answer.assessment" />
      </v-col>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
