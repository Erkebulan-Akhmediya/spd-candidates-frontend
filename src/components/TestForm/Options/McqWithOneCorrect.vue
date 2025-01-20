<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: 'McqWithOneCorrect',

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
    ...mapWritableState(useTestStore, ['test']),
  },
})
</script>

<template>
  <v-radio-group>

  </v-radio-group>
</template>

<style scoped></style>
