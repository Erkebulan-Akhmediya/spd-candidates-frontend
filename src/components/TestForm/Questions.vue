<script lang="ts">
import { defineComponent } from 'vue'
import QuestionComponent from '@/components/TestForm/Question.vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import { QuestionType } from '@/interfaces/question.ts'
import type { Option } from '@/interfaces/option.ts'

export default defineComponent({
  name: `Questions`,
  components: { QuestionComponent },

  props: {
    variantIndex: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      toShowConfirmDialog: false,
      confirmDialogData: {
        index: 0
      }
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['test'])
  },

  methods: {

    addQuestion() {
      this.test.variants[this.variantIndex].questions.push({
        withFile: false,
        file: null,
        nameRus: '',
        nameKaz: '',
        type: QuestionType.mcqWithOneCorrect,
        options: new Array<Option>(
          {
            withFile: false,
            file: null,
            nameRus: '',
            nameKaz: '',
            isCorrect: null,
          },
        ),
      })
    },

    openConfirmDialog(index: number) {
      this.confirmDialogData.index = index
      this.toShowConfirmDialog = true
    },

    deleteQuestion() {
      this.test.variants[this.variantIndex].questions = this.test.variants[this.variantIndex].questions.filter(
        (_, index: number): boolean => index !== this.confirmDialogData.index
      )
      this.toShowConfirmDialog = false
    }

  }
})
</script>

<template>
  <question-component
    v-for="(_, questionIndex) in test.variants[variantIndex].questions"
    :key="questionIndex"
    :variant-index="variantIndex"
    :question-index="questionIndex"
    @delete="openConfirmDialog"
  />
  <v-row justify="center" class="ma-3">
    <v-btn color="primary" @click="addQuestion">
      добавить вопрос
    </v-btn>
  </v-row>

  <v-dialog v-model="toShowConfirmDialog" max-width="300">
    <v-card>
      <v-card-title>
        Удалить вопрос?
      </v-card-title>
      <v-card-actions>
        <v-btn @click="toShowConfirmDialog = false" class="mr-2" variant="tonal">Отмена</v-btn>
        <v-btn color="error" variant="elevated" @click="deleteQuestion">Удплить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
