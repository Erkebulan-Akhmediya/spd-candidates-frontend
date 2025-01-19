<script lang="ts">
import { defineComponent } from 'vue'
import WithoutAnswer from '@/components/TestForm/Options/WithoutAnswer.vue'
import Open from '@/components/TestForm/Options/Open.vue'
import McqWithNoCorrect from '@/components/TestForm/Options/McqWithNoCorrect.vue'
import McqWithOneCorrect from '@/components/TestForm/Options/McqWithOneCorrect.vue'
import McqWithMultipleCorrect from '@/components/TestForm/Options/McqWithMultipleCorrect.vue'

export default defineComponent({
  name: `Options`,
  components: { McqWithMultipleCorrect, McqWithOneCorrect, McqWithNoCorrect, Open, WithoutAnswer },

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
  <mcq-with-no-correct
    v-else-if="questionTypeId === 3"
    :variant-index="variantIndex"
    :question-index="questionIndex"
  />
  <mcq-with-one-correct v-else-if="questionTypeId === 4" />
  <mcq-with-multiple-correct v-else /> <!-- questionTypeId === 5 -->
</template>

<style scoped>

</style>
