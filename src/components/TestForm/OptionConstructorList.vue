<script lang="ts">
import { defineComponent } from 'vue'
import Mcq from '@/components/TestForm/Options/MCQ.vue'

export default defineComponent({
  name: `OptionConstructorList`,
  components: { Mcq },

  props: {
    variantIndex: {
      type: Number,
      required: true
    },
    questionIndex: {
      type: Number,
      required: true
    },
    questionTypeId: {
      type: Number,
      required: true
    }
  }
})
</script>

<template>
  <v-divider v-if="[3, 4, 5].includes(questionTypeId)" />
  <mcq
    v-if="[3, 4, 5].includes(questionTypeId)"
    :variant-index="variantIndex"
    :question-index="questionIndex"
    :checkbox="questionTypeId === 4 || questionTypeId === 5"
  />
</template>

<style scoped>

</style>
