<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: 'QuestionFile',

  props: {
    url: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),

    mimeType(): string {
      return this.url.split(';')[0].split(':')[1]
    },

    isImage() {
      return this.mimeType.startsWith('image/')
    },

    isAudio() {
      return this.mimeType.startsWith('audio/')
    },

    isVideo() {
      return this.mimeType.startsWith('video/')
    },

    isPdf() {
      return this.mimeType === 'application/pdf'
    },
  },
})
</script>

<template>
  <img v-if="isImage" :src="url" alt="Preview" width="500" />

  <audio v-else-if="isAudio" :src="url" controls />

  <video v-else-if="isVideo" :src="url"  width="500" controls />

  <iframe v-else-if="isPdf" :src="url" />

  <p v-else>Не поддерживаемый формат файла</p>
</template>

<style scoped></style>
