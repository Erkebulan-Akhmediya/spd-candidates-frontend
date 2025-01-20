<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import QuestionOption from '@/components/TestForm/Option.vue'

export default defineComponent({
  name: `mcq`,
  components: { QuestionOption },

  props: {
    variantIndex: {
      type: Number,
      required: true,
    },
    questionIndex: {
      type: Number,
      required: true,
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapWritableState(useTestStore, ['test']),
  },

  methods: {
    addOption() {
      this.test.variants[this.variantIndex].questions[this.questionIndex].options.push({
        withFile: false,
        file: null,
        nameKaz: '',
        nameRus: '',
        isCorrect: null,
      })
    },

    deleteOption(optionIndex: number) {
      this.test.variants[this.variantIndex].questions[this.questionIndex].options =
        this.test.variants[this.variantIndex].questions[this.questionIndex].options.filter(
          (_, index: number): boolean => index !== optionIndex,
        )
    },
  },
})
</script>

<template>
  <v-list>
    <question-option
      v-for="(_, index) in test.variants[variantIndex].questions[questionIndex].options"
      :key="index"
      :option-index="index"
      :question-index="questionIndex"
      :variant-index="variantIndex"
      :checkbox="checkbox"
      @delete="deleteOption(index)"
    />
  </v-list>
  <v-row justify="center" class="pa-3">
    <v-btn color="primary" @click="addOption">добавить ответ</v-btn>
  </v-row>
</template>

<style scoped></style>
