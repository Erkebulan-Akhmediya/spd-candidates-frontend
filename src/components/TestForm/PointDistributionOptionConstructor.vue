<script lang="ts">
import { defineComponent } from 'vue'
import OptionScaleSelector from '@/components/TestForm/OptionScaleSelector.vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import type { OptionToCreate } from '@/interfaces/option.ts'

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

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['test']),
    optionName(): string {
      return String.fromCharCode('a'.charCodeAt(0) + this.optionIndex)
    },
    currentOption(): OptionToCreate {
      return this.test
        .variants[this.variantIndex]
        .questions[this.questionIndex]
        .options[this.optionIndex]
    }
  },

  mounted() {
    this.loading = true
    this.setOption()
    this.loading = false
  },

  methods: {
    setOption() {
      this.test.variants[this.variantIndex].questions[this.questionIndex].options[this.optionIndex] = {
        withFile: false,
        file: null,
        nameRus: this.optionName,
        nameKaz: this.optionName,
        isCorrect: null
      }
    }
  },

})
</script>

<template>
  <v-list-item-title>
    <v-progress-circular v-if="loading" />
    <v-row v-else justify="space-between" align="center" class="pa-3">
      <v-col cols="3">
        <h3>Ответ {{currentOption.nameRus}}</h3>
      </v-col>
      <v-col cols="3">
        <option-scale-selector />
      </v-col>
    </v-row>
  </v-list-item-title>
</template>

<style scoped>

</style>
