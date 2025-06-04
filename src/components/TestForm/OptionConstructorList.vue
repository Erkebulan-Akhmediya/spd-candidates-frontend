<script lang="ts">
import { defineComponent } from 'vue'
import OptionConstructor from '@/components/TestForm/OptionConstructor.vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import TestCreatorService from '@/services/TestCreatorService.ts'
import type { EditableQuestion } from '@/interfaces/question.ts'
import type { EditableVariant } from '@/interfaces/variant.ts'
import PointDistributionOptionConstructor from '@/components/TestForm/PointDistributionOptionConstructor.vue'
import { TestType } from '@/interfaces/test.ts'

export default defineComponent({
  name: `OptionConstructorList`,
  components: { PointDistributionOptionConstructor, OptionConstructor },

  props: {
    variantIndex: {
      type: Number,
      required: true
    },
    questionIndex: {
      type: Number,
      required: true
    }
  },

  computed: {
    TestType: () => TestType,
    ...mapWritableState(useTestStore, ['test', 'optionsPerQuestion']),
    testCreator() {
      return TestCreatorService.getInstance()
    }
  },

  mounted() {
    this.correctOptionCount()
  },

  methods: {
    correctOptionCount(): void {
      const variant: EditableVariant = this.test.variants[this.variantIndex]
      const question: EditableQuestion = variant.questions[this.questionIndex]
      const optionCount: number = question.options.length

      if (optionCount === this.optionsPerQuestion) return
      this.test.variants[this.variantIndex].questions[this.questionIndex].options =
        this.testCreator.newOptionList(this.optionsPerQuestion)
    }
  }

})
</script>

<template>
  <v-divider />
  <v-list>
    <v-list-item
      v-for="(_, optionIndex) in test.variants[variantIndex].questions[questionIndex].options"
      :key="optionIndex"
    >
      <point-distribution-option-constructor
        v-if="test.type === TestType.pointDistribution.valueOf()"
        :variant-index="variantIndex"
        :question-index="questionIndex"
        :option-index="optionIndex"
      />
      <option-constructor
        v-else
        :variant-index="variantIndex"
        :question-index="questionIndex"
        :option-index="optionIndex"
      />
      <v-divider />
    </v-list-item>
  </v-list>
</template>

<style scoped></style>
