<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: 'QuestionChanger',

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
    isFirst(): boolean {
      return this.passingTest.selectedQuestionIndex === 0
    },
    isLast(): boolean {
      return this.passingTest.selectedQuestionIndex === this.passingTest.questionIds.length - 1
    },
  },
})
</script>

<template>
  <v-row justify="start" class="pa-3">
    <v-btn
      v-if="!isFirst"
      @click="passingTest.selectedQuestionIndex--"
      color="primary"
      class="mr-3"
    >
      <v-icon>mdi-arrow-left</v-icon>
      Пред.
    </v-btn>
    <v-btn v-if="!isLast" @click="passingTest.selectedQuestionIndex++" color="primary">
      След.
      <v-icon>mdi-arrow-right</v-icon>
    </v-btn>
  </v-row>
</template>

<style scoped></style>
