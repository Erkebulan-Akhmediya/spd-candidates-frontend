<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import Questions from '@/components/TestForm/Questions.vue'
import { QuestionType } from '@/interfaces/interfaces.ts'

export default defineComponent({
  name: `Variant`,
  components: { Questions },

  props: {
    index: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['test']),
  },

  methods: {

    addQuestion() {
      this.test.variants[this.index].questions.push({
        withFile: false,
        nameRus: '',
        nameKaz: '',
        type: QuestionType.mcqWithOneCorrect,
      });
    },

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
        <questions :variant-index="index" />
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
