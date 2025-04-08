<script lang="ts">
import Question from '@/components/TestPassing/Question.vue'
import QuestionSelector from '@/components/TestPassing/QuestionSelector.vue'
import type { Answer, PassingQuestion } from '@/interfaces/question.ts'
import { useTestStore } from '@/stores/test.ts'
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'

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
      remainingTime: 0,
      timerInterval: null as number | null,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),

    selectedQuestionId(): number {
      return this.passingTest.questionIds[this.passingTest.selectedQuestionIndex]
    },

    selectedQuestionFetched(): boolean {
      return this.passingTest.selectedQuestion !== null
    },

    formattedTime(): string {
      const minutes = Math.floor(this.remainingTime / 60)
        .toString()
        .padStart(2, '0')
      const seconds = (this.remainingTime % 60).toString().padStart(2, '0')
      return `${minutes}:${seconds}`
    },
  },

  async created() {
    await this.updateSelectedQuestion()

    if (!this.passingTest.isLimitless) {
      this.remainingTime = this.passingTest.duration * 60
      this.startTimer()
    }
  },

  beforeUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
    }
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

    startTimer(): void {
      this.timerInterval = window.setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--
        } else {
          clearInterval(this.timerInterval!)
          this.endTest()
        }
      }, 1000)
    },

    showEndTestConfirm(): void {
      this.toShowEndTestConfirm = true
    },

    async endTest(): Promise<void> {
      try {
        if (this.timerInterval) {
          clearInterval(this.timerInterval)
        }

        const questions: PassingQuestion[] = [...this.passingTest.questions.values()]
        const answers: AnswerDto[] = await Promise.all(
          questions.map(async ({ id, answer }): Promise<AnswerDto> => {
            if (answer instanceof File) {
              answer = await this.$file.upload(answer)
            }
            return {
              questionId: id,
              answer,
            }
          }),
        )
        await this.$http.put(`/test/session/${this.passingTest.testSessionId}`, answers)
        await this.$router.push('/test/all')
      } catch (e) {
        console.log(e)
      }
    },
  },

  watch: {
    async selectedQuestionId() {
      await this.updateSelectedQuestion()
    },
  },
})
</script>

<template>
  <v-container fluid>
    <v-card :title="passingTest.nameRus">
      <v-card-subtitle v-if="!passingTest.isLimitless">
        Осталось времени: {{ formattedTime }}
      </v-card-subtitle>
      <v-card-subtitle v-else> Неограниченное время </v-card-subtitle>

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
