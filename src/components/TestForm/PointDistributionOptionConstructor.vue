<script lang="ts">
import { defineComponent } from 'vue'
import OptionScaleSelector from '@/components/TestForm/OptionScaleSelector.vue'

export default defineComponent({
  name: 'PointDistributionOptionConstructor',
  components: { OptionScaleSelector },

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
})
</script>

<template>
  <v-list-item-title>
    <v-row justify="space-between" align="center" class="pa-3">
      <v-col cols="3">
        <h3>Ответ</h3>
      </v-col>
      <v-col cols="3">
        <option-scale-selector />
      </v-col>
    </v-row>
  </v-list-item-title>
</template>

<style scoped>

</style>
