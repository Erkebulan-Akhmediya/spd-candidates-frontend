<script lang="ts">
import { defineComponent } from 'vue'
import GoBackBtn from '@/components/GoBackBtn.vue'
import type { TestSessionResultList } from '@/interfaces/test-result.ts'
import { mapWritableState } from 'pinia'
import { useTestResultStore } from '@/stores/test-result.ts'
import TestAssessmentResult from '@/components/TestResult/TestAssessmentResult.vue'
import TestEvaluationResult from '@/components/TestResult/TestEvaluationResult.vue'

export default defineComponent({
  name: 'TestResult',
  components: { TestEvaluationResult, TestAssessmentResult, GoBackBtn },

  computed: {
    ...mapWritableState(useTestResultStore, ['testSessionResults', 'resultType']),
    checkedTestSessionId(): number {
      const testSessionIdParam: string | string[] = this.$route.params.test_session_id
      const isString: boolean = typeof testSessionIdParam === 'string'
      let testSessionId: string
      if (isString) {
        testSessionId = testSessionIdParam as string
      } else {
        testSessionId = testSessionIdParam[0]
      }
      return parseInt(testSessionId, 10)
    },
  },

  async mounted() {
    await this.fetchTestSessionResult()
  },

  methods: {
    async fetchTestSessionResult() {
      try {
        const { resultType, results } = await this.$http.get<TestSessionResultList>(
          `/test/session/${this.checkedTestSessionId}/result`
        )
        this.testSessionResults = results
        this.resultType = resultType
      } catch (e) {
        console.log(e)
      }
    },
  },

})
</script>

<template>
  <v-card>
    <v-card-title>
      <v-row class="pa-5">
        <go-back-btn />
        <p class="ml-5">Результат теста</p>
      </v-row>
    </v-card-title>
    <v-card-text>
      <test-assessment-result v-if="resultType === 'assessment'" />
      <test-evaluation-result v-else-if="['single-scale', 'multi-scale'].includes(resultType)" />
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
