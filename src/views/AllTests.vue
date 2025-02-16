<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import type { GetAllTestsResponse, TestListItem } from '@/interfaces/test.ts'
import type { PassingQuestion } from '@/interfaces/question.ts'

interface CreateTestSessionResponse {
  questionIds: number[],
  testSessionId: number,
  testTypeId: number,
}

export default defineComponent({
  name: 'AllTests',

  data() {
    return {
      tests: new Array<TestListItem>(),
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
  },

  async mounted() {
    await this.fetchTests()
  },

  methods: {
    getTranslatedName,

    async fetchTests() {
      try {
        const data = await this.$http.get<GetAllTestsResponse>('/test/all')
        this.tests = data.tests
      } catch (e) {
        console.log(e)
      }
    },

    async startTest(test: TestListItem): Promise<void> {
      const data = await this.$http.post<CreateTestSessionResponse>(
        '/test/session',
        {},
        {
          params: {
            testId: test.id,
          },
        },
      )
      this.passingTest = {
        ...test,
        id: test.id,
        questionIds: data.questionIds,
        questions: new Map<number, PassingQuestion>(),
        testSessionId: data.testSessionId,
        selectedQuestionIndex: 0,
        selectedQuestion: null,
        testTypeId: data.testTypeId,
      }
      await this.$router.push({ path: `/test/${test.id}` })
    },
  },
})
</script>

<template>
  <v-container fluid>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(test, index) in tests"
        :key="index"
        :title="getTranslatedName(test)"
      >
        <v-expansion-panel-text>
          <p>Длительность: {{ test.isLimitless ? 'Без ограничений' : `${test.duration} мин` }}</p>
          <v-row justify="end">
            <v-btn color="primary" class="mb-2" @click="startTest(test)">Начать</v-btn>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<style scoped></style>
