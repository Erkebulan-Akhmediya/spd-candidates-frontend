<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import Options from '@/components/TestPassing/Options.vue'

export default defineComponent({
  name: `Answer`,
  components: { Options },

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
      this.passingTest.questions.set(this.passingTest.selectedQuestion!.id, {
        ...this.passingTest.selectedQuestion!,
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
    v-if="passingTest.selectedQuestion!.type === 2"
    variant="outlined"
    label="Ответ"
    v-model="answer"
  />
  <options
    v-else-if="[3, 4, 5].includes(passingTest.selectedQuestion!.type)"
    @answered="updateQuestionAnswer"
  />
  <p v-else>Ответ не требуется</p>
</template>

<style scoped></style>
