<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: `File`,

  emits: ['answered'],

  data() {
    return {
      file: null as File | null,
    }
  },

  watch: {
    file() {
      this.$emit('answered', this.file)
    }
  },
})
</script>

<template>
  <v-col cols="3">
    <v-file-input variant="outlined" label="Ответ" v-model="file" />
  </v-col>
</template>

<style scoped></style>
