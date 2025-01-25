<script lang="ts">
import { defineComponent } from 'vue'
import WithoutAnswer from '@/components/TestForm/Options/WithoutAnswer.vue'
import Open from '@/components/TestForm/Options/Open.vue'
import Mcq from '@/components/TestForm/Options/MCQ.vue'

export default defineComponent({
  name: `OptionConstructorList`,
  components: { Mcq, Open, WithoutAnswer },

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
  <without-answer v-if="questionTypeId === 1" />
  <open v-else-if="questionTypeId === 2" />
  <mcq
    v-else-if="questionTypeId === 3"
    :variant-index="variantIndex"
    :question-index="questionIndex"
  />
  <mcq
    v-else-if="questionTypeId === 4 || questionTypeId === 5"
    :variant-index="variantIndex"
    :question-index="questionIndex"
    checkbox
  />
  <p v-else>Не поддерживаемый тип вопроса</p>
</template>

<style scoped>

</style>
