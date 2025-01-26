<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import Options from '@/components/TestPassing/Options.vue'

export default defineComponent({
  name: `Answer`,
  components: { Options },

  props: {
    selectedQuestionType: {
      type: Number,
      required: true
    }
  },

  computed: {
    ...mapWritableState(useTestStore,['passingTest']),
  },
})
</script>

<template>
  <v-textarea v-if="selectedQuestionType === 2" variant="outlined" label="Ответ" />
  <options v-else-if="[3, 4].includes(selectedQuestionType)" />
  <options v-else-if="selectedQuestionType === 5" multiple />
  <p v-else>Ответ не требуется</p>
</template>

<style scoped></style>
