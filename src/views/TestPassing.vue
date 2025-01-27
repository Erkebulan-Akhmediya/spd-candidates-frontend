<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import QuestionSelector from '@/components/TestPassing/QuestionSelector.vue'
import Question from '@/components/TestPassing/Question.vue'
import type { PassingQuestion } from '@/interfaces/question.ts'

export default defineComponent({
  name: 'TestPassing',
  components: { Question, QuestionSelector },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
    selectedQuestionId(): number {
      return this.passingTest.questionIds[this.passingTest.selectedQuestionIndex]
    },
  },

  async created() {
    await this.updateSelectedQuestion()
  },

  methods: {
    async updateSelectedQuestion(): Promise<void> {
      const selectedQuestion: PassingQuestion | undefined = this.passingTest.questions.get(
        this.selectedQuestionId,
      )

      if (selectedQuestion !== undefined) {
        this.passingTest.selectedQuestion = selectedQuestion
      } else {
        await this.fetchQuestion()
      }
    },

    async fetchQuestion(): Promise<void> {
      try {
        const { data } = await this.axios.get<PassingQuestion>(
          `/test/question/${this.selectedQuestionId}`,
        )
        this.passingTest.questions.set(this.selectedQuestionId, data)
        this.passingTest.selectedQuestion = data
      } catch (e) {
        console.log(e)
      }
    },

    async endTest(): Promise<void> {
      await this.$router.push('/test/all')
    }
  },

  watch: {
    async selectedQuestionId() {
      await this.updateSelectedQuestion()
    }
  }

})
</script>

<template>
  <v-container fluid>
    <v-card :title="passingTest.nameRus">
      <v-card-text>
        <!-- create question component after selected question is fetched -->
        <question v-if="passingTest.selectedQuestion" />
        <question-selector />
      </v-card-text>
    </v-card>
    <v-card-actions>
      <v-row class="pa-3" justify="end">
        <v-btn color="error" variant="elevated" @click="endTest">Завершить тест</v-btn>
      </v-row>
    </v-card-actions>
  </v-container>
</template>

<style scoped></style>
