<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import Options from '@/components/TestPassing/Options.vue'
import type { PassingQuestion } from '@/interfaces/question.ts'

export default defineComponent({
  name: `Answer`,
  components: { Options },

  props: {
    selectedQuestion: {
      type: Object as PropType<PassingQuestion>,
      required: true,
    },
  },

  data() {
    return {
      answer: '',
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
  },

  methods: {
    updateQuestionAnswer(answer?: number | number[] | null): void {
      this.passingTest.questions.set(this.selectedQuestion.id, {
        ...this.selectedQuestion,
        answer: answer ? answer : this.answer,
      })
    },
  },

  watch: {
    answer() {
      this.updateQuestionAnswer()
    },
  },
})
</script>

<template>
  <v-textarea
    v-if="selectedQuestion.type === 2"
    variant="outlined"
    label="Ответ"
    v-model="answer"
  />
  <options
    v-else-if="[3, 4, 5].includes(selectedQuestion.type)"
    :selected-question="selectedQuestion"
    @answered="updateQuestionAnswer"
  />
  <p v-else>Ответ не требуется</p>
</template>

<style scoped></style>
