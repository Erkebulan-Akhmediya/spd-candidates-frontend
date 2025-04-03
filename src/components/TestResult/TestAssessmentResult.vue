<script lang="ts">
import type { TestSessionResult } from '@/interfaces/test-result.ts'
import { useTestResultStore } from '@/stores/test-result.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TestAssessmentResult',

  props: {
    small: {
      type: Boolean,
      default: false,
    },
  },

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
  <v-card v-for="(result, index) in testSessionResults" :key="index" elevation="10" class="mb-10">
    <v-card-text>
      <v-col cols="12">
        <h4>Вопрос</h4>
        <p class="mb-5">{{ getQuestionName(result) }}</p>
        <div v-if="result.fileUrl">
          <h4>Файл:</h4>

          <img
            v-if="isImage(result.fileUrl)"
            :src="result.fileUrl"
            alt="Preview"
            :width="small ? 300 : 500"
          />
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
