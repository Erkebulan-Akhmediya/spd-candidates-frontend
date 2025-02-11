<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: 'OptionScaleSelector',
  computed: {
    ...mapWritableState(useTestStore, ['test']),
  },
})
</script>

<template>
  <v-select
    label="Шкала"
    variant="outlined"
    :items="test.scales"
    item-value="index"
    item-title="nameRus"
  />
</template>

<style scoped>

</style>
