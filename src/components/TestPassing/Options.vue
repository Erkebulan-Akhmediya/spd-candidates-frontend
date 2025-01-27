<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import QuestionFile from '@/components/TestPassing/QuestionFile.vue'
import type { PassingQuestion } from '@/interfaces/question.ts'

export default defineComponent({
  name: `Options`,
  components: { QuestionFile },

  emits: ['answered'],

  data() {
    return {
      answer: null as number | number[] | null,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
    selectedQuestion(): PassingQuestion | null {
      return this.passingTest.selectedQuestion
    },
  },

  methods: {
    getTranslatedName,
  },

  watch: {
    answer() {
      this.$emit('answered', this.answer)
    },
    selectedQuestion() {
      const existingAnswer: number | number[] | string | null | undefined =
        this.selectedQuestion?.answer

      if (this.selectedQuestion?.type === 5) {
        this.answer = existingAnswer ? (existingAnswer as number[]) : []
      } else {
        this.answer = existingAnswer ? (existingAnswer as number) : null
      }
    },
  },
})
</script>

<template>
  <v-list
    v-if="passingTest.selectedQuestion?.type === 5"
    density="compact"
    :lines="false"
    select-strategy="leaf"
    v-model:selected="answer"
  >
    <v-list-item
      v-for="option in passingTest.selectedQuestion?.options"
      :key="option.id"
      :title="getTranslatedName(option)"
      :value="option.id"
    >
      <template v-slot:prepend="{ isSelected }">
        <v-list-item-action start>
          <v-checkbox-btn :model-value="isSelected"></v-checkbox-btn>
        </v-list-item-action>
      </template>

      <v-list-item-subtitle>
        <question-file v-if="option.withFile" :url="option.fileUrl!" />
      </v-list-item-subtitle>
    </v-list-item>
  </v-list>

  <v-radio-group v-else label="Ответ" v-model="answer">
    <v-row
      v-for="option in passingTest.selectedQuestion?.options ?? []"
      :key="option.id"
      justify="space-between"
      class="pa-1"
    >
      <v-radio :label="getTranslatedName(option)" :value="option.id" />
      <question-file v-if="option.withFile" :url="option.fileUrl!" />
    </v-row>
  </v-radio-group>
</template>

<style scoped></style>
