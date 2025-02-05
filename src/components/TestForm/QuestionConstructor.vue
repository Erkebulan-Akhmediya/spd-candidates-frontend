<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import OptionConstructorList from '@/components/TestForm/OptionConstructorList.vue'
import { getTranslatedName } from '@/utils/Translate.ts'

export default defineComponent({
  name: `QuestionConstructor`,
  components: { OptionConstructorList },

  props: {
    variantIndex: {
      type: Number,
      required: true,
    },

    questionIndex: {
      type: Number,
      required: true,
    },
  },

  computed: {
    ...mapWritableState(useTestStore, ['test', 'questionTypes']),
  },

  methods: {
    getTranslatedName,
  },
})
</script>

<template>
  <v-card class="my-10" elevation="12">
    <v-card-title class="pa-4">Вопрос {{ questionIndex + 1 }}</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="test.variants[variantIndex].questions[questionIndex].nameKaz"
            label="Вопрос (каз)"
            variant="outlined"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="test.variants[variantIndex].questions[questionIndex].nameRus"
            label="Вопрос (рус)"
            variant="outlined"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="5">
          <v-select
            label="Тип вопроса"
            :items="questionTypes"
            :item-title="getTranslatedName"
            item-value="id"
            v-model="test.variants[variantIndex].questions[questionIndex].type"
            variant="outlined"
          />
        </v-col>
        <v-col cols="2">
          <v-checkbox
            label="С файлом?"
            v-model="test.variants[variantIndex].questions[questionIndex].withFile"
          />
        </v-col>
        <v-col cols="3">
          <v-file-input
            v-if="test.variants[variantIndex].questions[questionIndex].withFile"
            label="Прикрепите файл"
            variant="outlined"
            show-size
            v-model="test.variants[variantIndex].questions[questionIndex].file"
          />
        </v-col>
        <v-col cols="2" v-if="test.variants[variantIndex].questions.length > 1">
          <v-btn color="error" @click="$emit('delete', questionIndex)" variant="elevated">
            удалить вопрос
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <option-constructor-list
            :variant-index="variantIndex"
            :question-index="questionIndex"
            :question-type-id="test.variants[variantIndex].questions[questionIndex].type"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
