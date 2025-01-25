<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: 'QuestionSelector',

  computed: {
    ...mapWritableState(useTestStore, ['passingTest'])
  },


})
</script>

<template>
  <v-chip-group filter mandatory v-model="passingTest.selectedQuestionIndex">
    <v-chip v-for="(_, index) in new Array(passingTest.questionIds.length)" :key="index">
      {{index + 1}}
    </v-chip>
  </v-chip-group>
</template>

<style scoped></style>
