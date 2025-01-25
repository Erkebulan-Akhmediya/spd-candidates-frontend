<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import type { PassingQuestion } from '@/interfaces/question.ts'
import { getTranslatedName } from '@/utils/Translate.ts'

export default defineComponent({
  name: `Question`,

  data() {
    return {
      selectedQuestion: {} as PassingQuestion,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),

    selectedQuestionId(): number {
      return this.passingTest.questionIds[this.passingTest.selectedQuestionIndex]
    },
  },

  async mounted(): Promise<void> {
    await this.updateSelectedQuestion()
  },

  methods: {
    getTranslatedName,
    async updateSelectedQuestion(): Promise<void> {
      const selectedQuestion: PassingQuestion | undefined =
        this.passingTest.questions.get(this.selectedQuestionId)

      if (selectedQuestion !== undefined) {
        this.selectedQuestion = selectedQuestion
      } else {
        await this.fetchQuestion()
      }
    },

    async fetchQuestion(): Promise<void> {
      try {
        const {data} = await this.axios.get<PassingQuestion>(`/test/question/${this.selectedQuestionId}`)
        this.selectedQuestion = data
      } catch (e) {
        console.log(e)
      }
    },
  },

  watch: {
    async selectedQuestionId(): Promise<void> {
      await this.updateSelectedQuestion()
    }
  },
})
</script>

<template>
  <v-card :title="getTranslatedName(selectedQuestion)">
    <v-card-text>

    </v-card-text>
  </v-card>
</template>

<style scoped></style>
