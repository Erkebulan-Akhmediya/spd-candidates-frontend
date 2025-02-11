<script lang="ts">
import { defineComponent } from 'vue'
import OptionConstructor from '@/components/TestForm/OptionConstructor.vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import TestCreatorService from '@/services/TestCreatorService.ts'
import type { QuestionToCreate } from '@/interfaces/question.ts'
import type { VariantToCreate } from '@/interfaces/variant.ts'

export default defineComponent({
  name: `OptionConstructorList`,
  components: { OptionConstructor },

  props: {
    variantIndex: {
      type: Number,
      required: true,
    },
    questionIndex: {
      type: Number,
      required: true,
    },
  },

  computed: {
    ...mapWritableState(useTestStore, ['test', 'optionsPerQuestion']),
    testCreator() {
      return TestCreatorService.getInstance()
    },
  },

  mounted() {
    this.correctOptionCount()
  },

  methods: {
    correctOptionCount(): void {
      const variant: VariantToCreate = this.test.variants[this.variantIndex]
      const question: QuestionToCreate = variant.questions[this.questionIndex]
      const optionCount: number = question.options.length

      if (optionCount === this.optionsPerQuestion) return
      this.test.variants[this.variantIndex].questions[this.questionIndex].options =
        this.testCreator.newOptionToCreateList(this.optionsPerQuestion)
    }
  },

})
</script>

<template>
  <v-divider />
  <v-list>
    <option-constructor
      v-for="(_, optionIndex) in test.variants[variantIndex].questions[questionIndex].options"
      :key="optionIndex"
      :variant-index="variantIndex"
      :question-index="questionIndex"
      :option-index="optionIndex"
    />
  </v-list>
</template>

<style scoped></style>
