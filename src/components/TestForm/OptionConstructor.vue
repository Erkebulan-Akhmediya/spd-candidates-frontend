<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: `OptionConstructor`,

  props: {
    variantIndex: {
      type: Number,
      required: true,
    },
    questionIndex: {
      type: Number,
      required: true,
    },
    optionIndex: {
      type: Number,
      required: true,
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapWritableState(useTestStore, ['test']),
  },
})
</script>

<template>
  <v-list-item>
    <v-list-item-title class="my-5">
      <v-row>
        <v-col cols="12">
          <p>Ответ {{ optionIndex + 1 }}</p>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            label="Ответ (каз)"
            variant="outlined"
            v-model="
              test.variants[variantIndex].questions[questionIndex].options[optionIndex].nameKaz
            "
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Ответ (рус)"
            variant="outlined"
            v-model="
              test.variants[variantIndex].questions[questionIndex].options[optionIndex].nameRus
            "
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2" v-if="checkbox">
          <v-checkbox
            label="Правильный ответ"
            v-model="
              test.variants[variantIndex].questions[questionIndex].options[optionIndex].isCorrect
            "
          />
        </v-col>
        <v-col cols="2">
          <v-checkbox
            label="С файлом?"
            v-model="
              test.variants[variantIndex].questions[questionIndex].options[optionIndex].withFile
            "
          />
        </v-col>
        <v-col
          cols="6"
        >
          <v-file-input
            label="Прикрепите файл"
            v-model="test.variants[variantIndex].questions[questionIndex].options[optionIndex].file"
            variant="outlined"
            v-if="test.variants[variantIndex].questions[questionIndex].options[optionIndex].withFile"
          />
        </v-col>
        <v-col cols="2">
          <v-btn
            color="error"
            @click="$emit('delete', optionIndex)"
            v-if="test.variants[variantIndex].questions[questionIndex].options.length > 1"
          >
            удалить ответ
          </v-btn>
        </v-col>
      </v-row>
      <v-divider />
    </v-list-item-title>
  </v-list-item>
</template>

<style scoped></style>
