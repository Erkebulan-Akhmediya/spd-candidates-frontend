<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import { TestType } from '@/interfaces/test.ts'
import OptionScaleSelector from '@/components/TestForm/OptionScaleSelector.vue'

export default defineComponent({
  name: `OptionConstructor`,
  components: { OptionScaleSelector },

  props: {
    variantIndex: {
      type: Number,
      required: true,
    },
    questionIndex: {
      type: Number,
      required: true,
    },
    optionIndex: {
      type: Number,
      required: true,
    },
  },

  computed: {
    ...mapWritableState(useTestStore, ['test', 'optionsPerQuestion', 'singleScaleTypes']),

    toShowIsCorrectCheckbox() {
      const typesRequiringCheckbox: number[] = [
        TestType.withMcqHavingOneCorrect,
        TestType.withMcqHavingMultipleCorrect,
      ]
      return typesRequiringCheckbox.includes(this.test.type)
    },

    testType(): number {
      return this.test.type
    },

  },

  methods: {
    setDefaultScale() {
      this.test
        .variants[this.variantIndex]
        .questions[this.questionIndex]
        .options[this.optionIndex]
        .increment
        .scaleIndex = 1
    }
  },

  watch: {
    testType() {
      if (this.singleScaleTypes.includes(this.test.type)) {
        this.setDefaultScale()
      }
    }
  },
})
</script>

<template>
  <v-list-item-title class="my-5">
    <v-row class="py-3">
      <v-col cols="2">
        <h3>Ответ {{ optionIndex + 1 }}</h3>
      </v-col>
      <v-col cols="5">
        <v-text-field
          label="Ответ (каз)"
          variant="outlined"
          v-model="
            test.variants[variantIndex].questions[questionIndex].options[optionIndex].nameKaz
          "
        />
      </v-col>
      <v-col cols="5">
        <v-text-field
          label="Ответ (рус)"
          variant="outlined"
          v-model="
            test.variants[variantIndex].questions[questionIndex].options[optionIndex].nameRus
          "
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="2">
        <v-checkbox
          v-if="toShowIsCorrectCheckbox"
          label="Правильный ответ"
          v-model="
            test.variants[variantIndex].questions[questionIndex].options[optionIndex].isCorrect
          "
        />
      </v-col>
      <v-col cols="2">
        <v-checkbox
          label="С файлом?"
          v-model="
            test.variants[variantIndex].questions[questionIndex].options[optionIndex].withFile
          "
        />
      </v-col>
      <v-col cols="3">
        <v-file-input
          label="Прикрепите файл"
          v-model="test.variants[variantIndex].questions[questionIndex].options[optionIndex].file"
          variant="outlined"
          v-if="test.variants[variantIndex].questions[questionIndex].options[optionIndex].withFile"
        />
      </v-col>
      <v-col cols="3">
        <option-scale-selector
          v-if="!singleScaleTypes.includes(test.type)"
          :variant-index="variantIndex"
          :question-index="questionIndex"
          :option-index="optionIndex"
        />
      </v-col>
      <v-col cols="2">
        <v-text-field
          label="Балл"
          variant="outlined"
          type="number"
          v-model="
            test.variants[variantIndex].questions[questionIndex].options[optionIndex].increment
              .score
          "
        />
      </v-col>
    </v-row>
  </v-list-item-title>
</template>

<style scoped></style>
