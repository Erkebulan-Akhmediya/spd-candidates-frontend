<script lang="ts">
import Question from '@/components/TestPassing/Question.vue'
import QuestionSelector from '@/components/TestPassing/QuestionSelector.vue'
import type { Answer, PassingQuestion } from '@/interfaces/question.ts'
import { useTestStore } from '@/stores/test.ts'
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'
import { ConditionalSectioningVarType } from '@/interfaces/test-evaluation.ts'

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
      conditionalVarsDialog: false,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),

    ConditionalSectioningVarType: () => ConditionalSectioningVarType,

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
    if (this.passingTest.conditionallySectioned) {
      this.conditionalVarsDialog = true
    }

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
            if (answer instanceof File) answer = await this.$file.upload(answer)
            return {
              questionId: id,
              answer,
            }
          }),
        )
        await this.$http.put(
          `/test/session/${this.passingTest.testSessionId}`,
          {
            answers,
            conditionalVarVals: this.passingTest.conditionalVarValues
          }
        )
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
      <v-card-subtitle v-else> Неограниченное время</v-card-subtitle>

      <v-card-text>
        <question v-if="selectedQuestionFetched" />
        <question-selector />
      </v-card-text>
    </v-card>

    <v-card-actions>
      <v-row class="pa-3" justify="end">
        <v-btn
          v-if="passingTest.conditionallySectioned"
          class="mr-3"
          color="primary"
          variant="elevated"
          @click="conditionalVarsDialog = true"
          text="Доп. данные"
        />
        <v-btn color="error" variant="elevated" @click="showEndTestConfirm" text="Завершить тест" />
      </v-row>
    </v-card-actions>
  </v-container>

  <v-dialog v-model="toShowEndTestConfirm" max-width="300">
    <v-card title="Завершить тест?">
      <v-card-actions>
        <v-row justify="end">
          <v-btn variant="elevated" @click="toShowEndTestConfirm = false">Назад</v-btn>
          <v-btn variant="elevated" color="error" @click="endTest" class="mx-3">Завершить</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="conditionalVarsDialog" max-width="500">
    <v-card title="Доп. информ. для оценивания теста">
      <v-card-text>
        <v-col cols="12">
          <v-row v-for="(condVar, index) in passingTest.conditionalVars" :key="index">
            <v-text-field
              v-if="condVar.type === ConditionalSectioningVarType.number"
              v-model="passingTest.conditionalVarValues[index].value[0]"
              :label="condVar.name"
              variant="outlined"
              type="number"
            />
            <v-text-field
              v-else-if="condVar.type === ConditionalSectioningVarType.string"
              v-model="passingTest.conditionalVarValues[index].value[0]"
              :label="condVar.name"
              variant="outlined"
            />
            <v-checkbox
              v-else-if="condVar.type === ConditionalSectioningVarType.boolean"
              v-model="passingTest.conditionalVarValues[index].value[0]"
              :label="condVar.name"
            />
            <v-select
              v-else-if="condVar.type === ConditionalSectioningVarType.reference"
              v-model="passingTest.conditionalVarValues[index].value"
              :label="condVar.name"
              variant="outlined"
              :items="condVar.reference"
              multiple
              chips
              closable-chips
              clearable
            />
          </v-row>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="conditionalVarsDialog = false"
          variant="elevated"
          text="Готово"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
