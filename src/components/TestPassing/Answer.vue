<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import Options from '@/components/TestPassing/Answer/Options.vue'
import { TestType } from '@/interfaces/test.ts'
import PointDistribution from '@/components/TestPassing/Answer/PointDistribution.vue'
import type { Answer } from '@/interfaces/question.ts'
import Open from '@/components/TestPassing/Answer/Open.vue'
import File from '@/components/TestPassing/Answer/File.vue'

export default defineComponent({
  name: `Answer`,
  components: { File, Open, PointDistribution, Options },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest', 'answerAllowed']),
    TestType: () => TestType,
    isMcq(): boolean {
      const mcqTypes: number[] = [
        TestType.withMcqHavingNoCorrect,
        TestType.withMcqHavingOneCorrect,
        TestType.withMcqHavingMultipleCorrect,
      ]
      return mcqTypes.includes(this.passingTest.testTypeId)
    },
    remainingTime(): string {
      if (this.passingTest.selectedQuestion == null) return ''

      const minutes = Math.floor(this.passingTest.selectedQuestion.timeToDisappear / 60)
        .toString()
        .padStart(2, '0')
      const seconds = String(this.passingTest.selectedQuestion.timeToDisappear % 60).padStart(2, '0')
      return `${minutes}:${seconds}`
    },
  },



  methods: {
    updateQuestionAnswer(answer: Answer | null): void {
      this.passingTest.questions.set(this.passingTest.selectedQuestion!.id, {
        ...this.passingTest.selectedQuestion!,
        answer,
      })
    },
  },

})
</script>

<template>
  <div v-if="answerAllowed">
    <open
      v-if="passingTest.testTypeId === TestType.withOpenQuestions"
      variant="outlined"
      label="Ответ"
      @answered="updateQuestionAnswer"
    />
    <point-distribution
      v-else-if="passingTest.testTypeId === TestType.pointDistribution"
      @answered="updateQuestionAnswer"
    />
    <file
      v-else-if="passingTest.testTypeId === TestType.fileAnswer"
      @answered="updateQuestionAnswer"
    />
    <options v-else-if="isMcq" @answered="updateQuestionAnswer" />
  </div>
  <h1 v-else>Поле ответа откроется через: {{ remainingTime }}</h1>
</template>

<style scoped></style>
