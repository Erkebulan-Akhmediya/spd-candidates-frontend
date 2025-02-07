<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import { TestType } from '@/interfaces/test.ts'

export default defineComponent({
  name: `OptionConstructor`,

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
    ...mapWritableState(useTestStore, ['test', 'optionsPerQuestion']),
    toShowIsCorrectCheckbox() {
      const typesRequiringCheckbox: number[] = [
        TestType.withMcqHavingOneCorrect,
        TestType.withMcqHavingMultipleCorrect
      ];
      return typesRequiringCheckbox.includes(this.test.type)
    },
  },
})
</script>

<template>
  <v-list-item>
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
        <v-col cols="2" v-if="toShowIsCorrectCheckbox">
          <v-checkbox
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
        <v-col cols="5">
          <v-file-input
            label="Прикрепите файл"
            v-model="test.variants[variantIndex].questions[questionIndex].options[optionIndex].file"
            variant="outlined"
            v-if="
              test.variants[variantIndex].questions[questionIndex].options[optionIndex].withFile
            "
          />
        </v-col>
      </v-row>
      <v-divider />
    </v-list-item-title>
  </v-list-item>
</template>

<style scoped></style>
