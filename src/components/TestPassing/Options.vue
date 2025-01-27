<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import type { PassingQuestion } from '@/interfaces/question.ts'
import type { PassingOption } from '@/interfaces/option.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import QuestionFile from '@/components/TestPassing/QuestionFile.vue'

export default defineComponent({
  name: `Options`,
  components: { QuestionFile },
  methods: { getTranslatedName },

  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),

    options(): PassingOption[] {
      const selectedQuestionId: number =
        this.passingTest.questionIds[this.passingTest.selectedQuestionIndex]

      const selectedQuestion: PassingQuestion | undefined =
        this.passingTest.questions.get(selectedQuestionId)

      return selectedQuestion?.options ?? []
    },
  },
})
</script>

<template>
  <v-list v-if="multiple" density="compact" :lines="false">
    <v-list-item v-for="option in options" :key="option.id">
      <v-list-item-title>
        <v-row justify="space-between" class="pl-5">
          <v-checkbox :label="getTranslatedName(option)" />
          <question-file v-if="option.withFile" :url="option.fileUrl!" />
        </v-row>
      </v-list-item-title>
    </v-list-item>
  </v-list>
  <v-radio-group v-else label="Ответ">
    <v-row v-for="option in options" :key="option.id" justify="space-between" class="pa-1">
      <v-radio :label="getTranslatedName(option)" :value="option.id" />
      <question-file v-if="option.withFile" :url="option.fileUrl!" />
    </v-row>
  </v-radio-group>
</template>

<style scoped></style>
