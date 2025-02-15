<script lang="ts">
import { defineComponent } from 'vue'
import type { TestSessionForAssessment } from '@/interfaces/test-assessment.ts'
import { mapWritableState } from 'pinia'
import { useTestAssessmentStore } from '@/stores/test-assessment.ts'
import TestAssessmentQuestions from '@/components/TestAssessment/TestAssessmentQuestions.vue'

export default defineComponent({
  name: 'TestAssessment',
  components: { TestAssessmentQuestions },

  data() {
    return {
      loading: false,
      toShowConfirmDialog: false,
    }
  },

  async mounted() {
    await this.fetchTestSession()
  },

  methods: {
    goBack(): void {
      this.$router.go(-1)
    },

    async fetchTestSession() {
      try {
        this.loading = true
        this.testSession = await this.$http.get<TestSessionForAssessment>(
          `/test/session/${this.assessedTestSessionId}/assessment`,
        )
        this.loading = false
      } catch (e) {
        console.log(e)
      }
    },

    async saveAssessment() {
      try {
        await this.$http.post(`/test/session/assessment`, this.testSession)
        this.$router.push('/test/assessment/all')
      } catch (e) {
        console.log(e)
      }
    },
  },

  computed: {
    ...mapWritableState(useTestAssessmentStore, ['testSession']),
    assessedTestSessionId(): number {
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
})
</script>

<template>
  <v-card>
    <v-card-title>
      <v-row justify="start" class="pa-5">
        <v-btn @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
          <p>Назад</p>
        </v-btn>
        <p class="ml-5">Проверка теста</p>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-progress-linear v-if="loading" color="primary" indeterminate />
      <test-assessment-questions v-else />
    </v-card-text>
    <v-card-actions>
      <v-btn variant="tonal">Назад</v-btn>
      <v-btn variant="elevated" color="primary" @click="toShowConfirmDialog = true">
        Сохранить
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="toShowConfirmDialog" max-width="300">
      <v-card>
        <v-card-title>Сохранить оценивание?</v-card-title>
        <v-card-actions>
          <v-btn variant="elevated" @click="toShowConfirmDialog = false">Назад</v-btn>
          <v-btn variant="elevated" color="primary" @click="saveAssessment">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped></style>
