<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import Options from '@/components/TestPassing/Options.vue'
import { TestType } from '@/interfaces/test.ts'
import PointDistribution from '@/components/TestPassing/PointDistribution.vue'

export default defineComponent({
  name: `Answer`,
  components: { PointDistribution, Options },

  data() {
    return {
      answer: '',
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
    TestType: () => TestType,
    isMcq(): boolean {
      const mcqTypes: number[] = [
        TestType.withMcqHavingNoCorrect,
        TestType.withMcqHavingOneCorrect,
        TestType.withMcqHavingMultipleCorrect
      ]
      return mcqTypes.includes(this.passingTest.testTypeId)
    }
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
    v-if="passingTest.testTypeId === TestType.withOpenQuestions"
    variant="outlined"
    label="Ответ"
    v-model="answer"
  />
  <point-distribution v-else-if="passingTest.testTypeId === TestType.pointDistribution" />
  <options
    v-else-if="isMcq"
    @answered="updateQuestionAnswer"
  />
</template>

<style scoped></style>
