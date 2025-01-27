<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import QuestionFile from '@/components/TestPassing/QuestionFile.vue'
import Answer from '@/components/TestPassing/Answer.vue'
import QuestionChanger from '@/components/TestPassing/QuestionChanger.vue'

export default defineComponent({
  name: `Question`,
  components: { QuestionChanger, Answer, QuestionFile },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest']),
  },

  methods: {
    getTranslatedName,
  },
})
</script>

<template>
  <v-card :title="getTranslatedName(passingTest.selectedQuestion!)">
    <v-card-text>
      <question-file
        v-if="passingTest.selectedQuestion!.withFile"
        :url="passingTest.selectedQuestion!.fileUrl!"
      />
      <answer />
      <question-changer />
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
