<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import QuestionSelector from '@/components/TestPassing/QuestionSelector.vue'
import Question from '@/components/TestPassing/Question.vue'

export default defineComponent({
  name: 'TestPassing',
  components: { Question, QuestionSelector },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
  },

})
</script>

<template>
  <v-container fluid>
    <v-card :title="passingTest.nameRus">
      <v-card-text>
        <question />
        <question-selector />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped></style>
