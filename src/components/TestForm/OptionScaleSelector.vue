<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: 'OptionScaleSelector',

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
  <v-select
    label="Шкала"
    variant="outlined"
    :items="test.scales"
    item-value="index"
    item-title="nameRus"
    v-model="
      test.variants[variantIndex].questions[questionIndex].options[optionIndex].increment.scaleIndex
    "
  />
</template>

<style scoped>

</style>
