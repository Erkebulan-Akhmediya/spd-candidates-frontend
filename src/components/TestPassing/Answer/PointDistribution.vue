<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import type { Answer, AnswerForPointDistribution, PassingQuestion } from '@/interfaces/question.ts'
import type { PassingOption } from '@/interfaces/option.ts'

export default defineComponent({
  name: 'PointDistribution',

  emits: ['answered'],

  data() {
    return {
      answer: [] as AnswerForPointDistribution,
      loading: false,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
    selectedQuestion(): PassingQuestion | null {
      return this.passingTest.selectedQuestion
    },
    existingAnswer(): Answer | null | undefined {
      return this.selectedQuestion?.answer
    },
  },

  created() {
    this.loading = true
    this.initEmptyAnswer()
    this.loading = false
  },

  methods: {
    updateAnswer(optionId: number, point: number): void {
      this.answer.forEach((answer, index: number): void => {
        if (optionId !== answer.optionId) return
        this.answer[index].point = point
      })
      this.$emit('answered', this.answer)
    },
    initEmptyAnswer() {
      const options: PassingOption[] | undefined = this.selectedQuestion?.options;
      if (options === undefined) return;

      this.answer = options.map((option: PassingOption) => ({
        optionId: option.id,
        point: 0
      }))
    },
  },

  watch: {
    selectedQuestion() {
      if (this.existingAnswer !== undefined && this.existingAnswer !== null) {
        this.answer = this.existingAnswer as AnswerForPointDistribution
      } else {
        this.initEmptyAnswer()
      }
    }
  },
})
</script>

<template>
  <v-progress-linear v-if="loading" status="indeterminate" />
  <v-list v-else>
    <v-list-item
      v-for="(option, index) in passingTest.selectedQuestion?.options ?? []"
      :key="index"
    >
      <v-list-item-title>
        <v-row class="pa-3" align="center">
          <h2 class="pa-0 ma-0">{{ option.nameRus }}</h2>
          <v-col cols="3">
            <v-text-field
              type="number"
              label="Балл"
              variant="outlined"
              :rules="[(n: number) => n >= 0 || 'Не допустимое значение']"
              v-model="answer[index].point"
              @input="(event: InputEvent): void => {
                updateAnswer(option.id, Number((event.target as HTMLInputElement).value))
              }"
            />
          </v-col>
        </v-row>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style scoped></style>
