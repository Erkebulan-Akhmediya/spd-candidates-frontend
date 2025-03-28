<script lang="ts">
import type { TestSessionResult } from '@/interfaces/test-result.ts'
import { useTestResultStore } from '@/stores/test-result.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'

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
        nameKaz: result.questionNameKaz!,
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
  <v-card v-for="(result, index) in testSessionResults" :key="index" elevation="10" class="mb-10">
    <v-card-text>
      <v-col cols="12">
        <h4>Вопрос</h4>
        <p class="mb-5">{{ getQuestionName(result) }}</p>

        <!-- File preview -->
        <div v-if="result.fileUrl">
          <h4>Файл:</h4>

          <div v-if="isImageUrl(result.fileUrl)">
            <img
              :src="result.fileUrl"
              alt="Вложенное изображение"
              style="max-width: 100%; max-height: 400px"
            />
          </div>

          <div v-else>
            <a :href="result.fileUrl" target="_blank" rel="noopener noreferrer"> Скачать файл </a>
          </div>
        </div>

        <!-- Fallback: text answer -->
        <div v-else>
          <v-textarea label="Ответ" variant="outlined" rows="10" v-model="result.answer" readonly />
        </div>

        <v-textarea label="Оценка" variant="outlined" v-model="result.assessment" readonly />
      </v-col>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
