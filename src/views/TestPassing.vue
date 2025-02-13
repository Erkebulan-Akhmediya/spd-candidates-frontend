<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import QuestionSelector from '@/components/TestPassing/QuestionSelector.vue'
import Question from '@/components/TestPassing/Question.vue'
import type { Answer, PassingQuestion } from '@/interfaces/question.ts'

interface AnswerDto {
  questionId: number
  answer: Answer | null
}

export default defineComponent({
  name: 'TestPassing',
  components: { Question, QuestionSelector },

  data() {
    return {
      toShowEndTestConfirm: false,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
    selectedQuestionId(): number {
      return this.passingTest.questionIds[this.passingTest.selectedQuestionIndex]
    },
    selectedQuestionFetched(): boolean {
      return this.passingTest.selectedQuestion !== null;
    }
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
        const data = await this.$http.get<PassingQuestion>(
          `/test/question/${this.selectedQuestionId}`,
        )
        this.passingTest.questions.set(this.selectedQuestionId, data)
        this.passingTest.selectedQuestion = data
      } catch (e) {
        console.log(e)
      }
    },

    showEndTestConfirm(): void {
      this.toShowEndTestConfirm = true
    },

    async endTest(): Promise<void> {
      try {
        const questions: PassingQuestion[] = [...this.passingTest.questions.values()]
        const answers: AnswerDto[] = questions.map(
          ({id, answer}): AnswerDto => ({questionId: id, answer})
        );
        await this.$http.put(`/test/session/${this.passingTest.testSessionId}`, answers)
        await this.$router.push('/test/all')
      } catch (e) {
        console.log(e)
      }
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
        <question v-if="selectedQuestionFetched" />
        <question-selector />
      </v-card-text>
    </v-card>
    <v-card-actions>
      <v-row class="pa-3" justify="end">
        <v-btn color="error" variant="elevated" @click="showEndTestConfirm">Завершить тест</v-btn>
      </v-row>
    </v-card-actions>
  </v-container>
  <v-dialog v-model="toShowEndTestConfirm" max-width="300">
    <v-card>
      <v-card-title>Завершить тест?</v-card-title>
      <v-card-actions>
        <v-row justify="end">
          <v-btn variant="elevated" @click="toShowEndTestConfirm = false">Назад</v-btn>
          <v-btn variant="elevated" color="error" @click="endTest" class="mx-3">Завершить</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
