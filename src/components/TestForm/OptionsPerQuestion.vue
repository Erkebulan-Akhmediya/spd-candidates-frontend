<script lang="ts">
import { defineComponent } from 'vue'
import { TestType } from '@/interfaces/test.ts'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import type { VariantToCreate } from '@/interfaces/variant.ts'
import type { QuestionToCreate } from '@/interfaces/question.ts'
import type { OptionToCreate } from '@/interfaces/option.ts'
import TestCreatorService from '@/services/TestCreatorService.ts'

export default defineComponent({
  name: 'OptionsPerQuestion',
  computed: {
    ...mapWritableState(useTestStore, ['test', 'optionsPerQuestion']),
    TestType: () => TestType,
    testCreator() {
      return TestCreatorService.getInstance();
    },
    toShow(): boolean {
      return [
        TestType.withMcqHavingNoCorrect,
        TestType.withMcqHavingOneCorrect,
        TestType.withMcqHavingMultipleCorrect,
        TestType.pointDistribution,
      ].includes(this.test.type)
    },
    isDisabled(): boolean {
      if (this.test.type === TestType.pointDistribution.valueOf()) return false
      return this.test.variants.some((variant: VariantToCreate): boolean =>
        variant.questions.some((question: QuestionToCreate): boolean =>
          question.options.some(
            (option: OptionToCreate): boolean =>
              !!option.nameRus || !!option.nameKaz || !!option.isCorrect,
          ),
        ),
      )
    },
  },
  methods: {
    optionCountRule(optionCount: number) {
      return optionCount > 1 || 'Не допустимое количество вариантов отвеа'
    },
  },
  watch: {
    optionsPerQuestion() {
      this.test.variants.forEach((variant) => {
        variant.questions.forEach((question: QuestionToCreate) => {
          if (this.test.type === TestType.pointDistribution.valueOf()) {
            question.options = this.testCreator.newPointDistributionOptionList(this.optionsPerQuestion)
          } else {
            question.options = this.testCreator.newOptionList(this.optionsPerQuestion)
          }
        })
      })
    },
  },
})
</script>

<template>
  <v-text-field
    type="number"
    label="Количество вариантов ответа"
    variant="outlined"
    v-model="optionsPerQuestion"
    v-if="toShow"
    :rules="[optionCountRule]"
    :disabled="isDisabled"
  />
</template>

<style scoped></style>
