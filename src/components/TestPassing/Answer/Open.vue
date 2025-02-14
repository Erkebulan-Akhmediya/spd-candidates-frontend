<script lang="ts">
import { defineComponent } from 'vue'
import type { Answer, AnswerForOpenQuestion, PassingQuestion } from '@/interfaces/question.ts'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: `Open`,
  emits: ['answered'],
  data() {
    return {
      answer: '' as AnswerForOpenQuestion
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
    selectedQuestion(): PassingQuestion | null {
      return this.passingTest.selectedQuestion
    }
  },

  watch: {
    answer() {
      this.$emit('answered', this.answer)
    },
    selectedQuestion() {
      const existingAnswer: Answer | null | undefined = this.selectedQuestion?.answer
      this.answer = (existingAnswer !== undefined && existingAnswer !== null) ? (existingAnswer as AnswerForOpenQuestion) : ''
    }
  }

})
</script>

<template>
  <v-textarea
    variant="outlined"
    label="Ответ"
    v-model="answer"
  />
</template>

<style scoped>

</style>
