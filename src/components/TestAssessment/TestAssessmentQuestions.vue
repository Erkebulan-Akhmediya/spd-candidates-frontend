<script lang="ts">
import type { TestSessionAnswerForAssessment } from '@/interfaces/test-assessment.ts'
import { useTestAssessmentStore } from '@/stores/test-assessment.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestAssessmentQuestions',

  props: {
    small: {
      type: Boolean,
      default: false,
    },
  },

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
    isImage(fileUrl: string | undefined): boolean {
      if (!fileUrl) return false

      if (fileUrl.startsWith('data:')) {
        const mime = fileUrl.split(';')[0].split(':')[1]
        return mime.startsWith('image/')
      }

      return /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(fileUrl)
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

          <img
            v-if="isImage(answer.fileUrl)"
            :src="answer.fileUrl"
            alt="Preview"
            :width="small ? 300 : 500"
          />
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
