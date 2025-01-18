<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: `Question`,

  props: {
    variantIndex: {
      type: Number,
      required: true
    },

    questionIndex: {
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
  <v-card class="ma-1">
    <v-card-title>
      <v-row class="pa-3">
        <v-col cols="1">
          <p>{{questionIndex + 1}}.</p>
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="test.variants[variantIndex].questions[questionIndex].nameKaz"
            label="Вопрос (каз)"
            variant="outlined"
          />
        </v-col>
        <v-col cols="5">
          <v-text-field
            v-model="test.variants[variantIndex].questions[questionIndex].nameRus"
            label="Вопрос (рус)"
            variant="outlined"
          />
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-actions v-if="test.variants[variantIndex].questions.length > 1">
      <v-row justify="center" >
        <v-btn color="error" @click="$emit('delete', questionIndex)" variant="elevated">
          удалить вопрос
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped>

</style>
