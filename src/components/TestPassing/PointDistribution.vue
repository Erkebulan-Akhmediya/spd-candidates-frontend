<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: 'PointDistribution',

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
  },
})
</script>

<template>
  <v-list>
    <v-list-item
      v-for="(option, index) in passingTest.selectedQuestion?.options ?? []"
      :key="index"
    >
      <v-list-item-title>
        <v-row class="pa-3" align="center">
          <h2 class="pa-0 ma-0">{{ option.nameRus }}</h2>
          <v-col cols="3">
            <v-text-field type="number" label="Балл" variant="outlined" />
          </v-col>
        </v-row>
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<style scoped></style>
