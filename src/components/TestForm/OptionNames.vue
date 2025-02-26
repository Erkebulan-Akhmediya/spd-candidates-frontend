<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: 'OptionNames',

  props: {
    variantIndex: {
      type: Number,
      required: true
    },
    questionIndex: {
      type: Number,
      required: true
    },
    optionIndex: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['test']),
  },
})
</script>

<template>
  <v-row>
    <v-col cols="6">
      <v-text-field
        label="Ответ (каз)"
        variant="outlined"
        v-model="test.variants[variantIndex].questions[questionIndex].options[optionIndex].nameKaz"
      />
    </v-col>
    <v-col cols="6">
      <v-text-field
        label="Ответ (рус)"
        variant="outlined"
        v-model="test.variants[variantIndex].questions[questionIndex].options[optionIndex].nameRus"
      />
    </v-col>
  </v-row>
</template>

<style scoped>

</style>
