<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import type { Option } from '@/interfaces/interfaces.ts'

export default defineComponent({
  name: 'McqWithNoCorrect',

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
    ...mapWritableState(useTestStore, ['test']),
  },

  methods: {
    addOption() {
      this.test.variants[this.variantIndex].questions[this.questionIndex].options.push({
        withFile: false,
        file: null,
        nameKaz: '',
        nameRus: '',
        isCorrect: null,
      })
    },

    deleteOption(optionIndex: number) {
      this.test.variants[this.variantIndex].questions[this.questionIndex].options =
        this.test.variants[this.variantIndex].questions[this.questionIndex].options.filter(
          (_, index: number): boolean => index !== optionIndex,
        )
    },
  },
})
</script>

<template>
  <v-list>
    <v-list-item
      v-for="(option, index) in test.variants[variantIndex].questions[questionIndex].options"
      :key="index"
      item-props
    >
      <v-list-item-title>
        <v-row>
          <v-col cols="12">
            <p>Ответ {{ index + 1 }}</p>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field label="Вариант (каз)" variant="outlined" v-model="option.nameKaz" />
          </v-col>
          <v-col cols="6">
            <v-text-field label="Вариант (рус)" variant="outlined" v-model="option.nameRus" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="2">
            <v-checkbox label="С файлом?" v-model="option.withFile" />
          </v-col>
          <v-col cols="5" v-if="option.withFile">
            <v-file-input label="Прикрепите файл" v-model="option.file" variant="outlined" />
          </v-col>
        </v-row>
        <v-row
          justify="center"
          v-if="test.variants[variantIndex].questions[questionIndex].options.length > 1"
          class="ma-2"
        >
          <v-btn color="error" @click="deleteOption(index)">удалить ответ</v-btn>
        </v-row>
        <v-divider />
      </v-list-item-title>
    </v-list-item>
  </v-list>
  <v-row justify="center" class="pa-3">
    <v-btn color="primary" @click="addOption">добавить ответ</v-btn>
  </v-row>
</template>

<style scoped></style>
