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
    small: {
      type: Boolean,
      default: false,
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
  <img v-if="isImage" :src="url" alt="Preview" :width="small ? 300 : 500" />

  <audio v-else-if="isAudio" :src="url" controls />

  <video v-else-if="isVideo"  :width="small ? 300 : 500" controls >
    <source type="video/mp4" :src="url" />
  </video>

  <iframe v-else-if="isPdf" :src="url" :width="small ? 300 : 500" />

  <p v-else>Не поддерживаемый формат файла</p>
</template>

<style scoped></style>
