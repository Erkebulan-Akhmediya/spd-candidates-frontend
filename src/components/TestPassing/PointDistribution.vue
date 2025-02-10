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
    <v-list-item v-for="(option, index) in passingTest.selectedQuestion ?? []" :key="index">

    </v-list-item>
  </v-list>
</template>

<style scoped></style>
