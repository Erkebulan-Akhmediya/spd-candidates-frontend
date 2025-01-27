<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import type { PassingQuestion } from '@/interfaces/question.ts'
import type { PassingOption } from '@/interfaces/option.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import QuestionFile from '@/components/TestPassing/QuestionFile.vue'

export default defineComponent({
  name: `Options`,
  components: { QuestionFile },

  props: {
    selectedQuestion: {
      type: Object as PropType<PassingQuestion>,
      required: true,
    },
  },

  emits: ['answered'],

  data() {
    return {
      answer: null as number | number[] | null,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),

    options(): PassingOption[] {
      return this.selectedQuestion.options ?? []
    },
  },

  methods: {
    getTranslatedName,
  },

  watch: {
    answer() {
      this.$emit('answered', this.answer)
    },
  }
})
</script>

<template>
  <v-list
    v-if="selectedQuestion.type === 5"
    density="compact"
    :lines="false"
    select-strategy="leaf"
    v-model:selected="answer"
  >
    <v-list-item
      v-for="option in options"
      :key="option.id"
      :title="getTranslatedName(option)"
      :value="option.id"
    >
      <template v-slot:prepend="{ isSelected }">
        <v-list-item-action start>
          <v-checkbox-btn :model-value="isSelected"></v-checkbox-btn>
        </v-list-item-action>
      </template>

      <v-list-item-subtitle>
        <question-file v-if="option.withFile" :url="option.fileUrl!" />
      </v-list-item-subtitle>
    </v-list-item>
  </v-list>

  <v-radio-group v-else label="Ответ" v-model="answer">
    <v-row v-for="option in options" :key="option.id" justify="space-between" class="pa-1">
      <v-radio :label="getTranslatedName(option)" :value="option.id" />
      <question-file v-if="option.withFile" :url="option.fileUrl!" />
    </v-row>
  </v-radio-group>
</template>

<style scoped></style>
