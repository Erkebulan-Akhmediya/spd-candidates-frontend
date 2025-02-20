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
  <options
    v-else-if="isMcq"
    @answered="updateQuestionAnswer"
  />
</template>

<style scoped></style>
