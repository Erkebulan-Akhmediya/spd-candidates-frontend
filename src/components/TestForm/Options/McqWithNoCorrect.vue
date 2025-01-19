<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

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
          <v-col cols="6">
            <v-text-field label="Вариант (каз)" variant="outlined" v-model="option.nameKaz" />
          </v-col>
          <v-col cols="6">
            <v-text-field label="Вариант (рус)" variant="outlined" v-model="option.nameRus" />
          </v-col>
        </v-row>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style scoped>

</style>
