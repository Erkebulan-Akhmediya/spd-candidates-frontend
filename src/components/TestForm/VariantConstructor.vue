<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import QuestionConstructorList from '@/components/TestForm/QuestionConstructorList.vue'

export default defineComponent({
  name: `VariantConstructor`,
  components: { QuestionConstructorList },

  props: {
    index: {
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
  <v-expansion-panel>
    <v-expansion-panel-title>
      Вариант {{ index + 1 }}
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-col cols="12">
        <question-constructor-list :variant-index="index" />
        <v-row justify="center" class="ma-3" v-if="test.variants.length > 1">
          <v-btn @click="$emit('delete', index)" color="error ">
            удалить вариант
          </v-btn>
        </v-row>
      </v-col>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style scoped>

</style>
