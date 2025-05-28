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

  data() {
    return {
      interval: setInterval(() => {}) as NodeJS.Timeout,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['passingTest', 'answerAllowed']),

    isShowQuestionFileVisible(): boolean {
      return (
        this.questionHasFile &&
        (this.questionIsNotDisappearing || this.questionIsDisappearingButHasTime)
      )
    },

    isQuestionTitleVisible(): boolean {
      return this.questionIsNotDisappearing || this.questionIsDisappearingButHasTime
    },

    questionHasFile(): boolean {
      return this.passingTest.selectedQuestion!.withFile
    },

    questionIsNotDisappearing(): boolean {
      return !this.passingTest.selectedQuestion!.isDisappearing
    },

    questionIsDisappearingButHasTime(): boolean {
      return (
        this.passingTest.selectedQuestion!.isDisappearing &&
        this.passingTest.selectedQuestion!.timeToDisappear > 0
      )
    },
  },

  created() {
    this.startCountDown()
  },

  methods: {
    getTranslatedName,

    startCountDown() {
      clearInterval(this.interval)
      if (
        this.passingTest.selectedQuestion == null ||
        !this.passingTest.selectedQuestion.isDisappearing ||
        this.passingTest.selectedQuestion.timeToDisappear <= 0
      ) {
        this.answerAllowed = true
        return
      }

      this.answerAllowed = false
      this.interval = setInterval(() => {
        this.passingTest.selectedQuestion!.timeToDisappear--
        if (this.passingTest.selectedQuestion!.timeToDisappear <= 0) {
          this.answerAllowed = true
          clearInterval(this.interval)
        }
      }, 1000)
    },
  },

  watch: {
    'passingTest.selectedQuestion'() {
      this.startCountDown()
    },
  },
})
</script>

<template>
  <v-card>
    <v-card-title v-if="isQuestionTitleVisible" class="title">
      {{ getTranslatedName(passingTest.selectedQuestion!) }}
    </v-card-title>
    <v-card-text>
      <question-file
        v-if="isShowQuestionFileVisible"
        :url="passingTest.selectedQuestion!.fileUrl!"
      />
      <answer />
      <question-changer />
    </v-card-text>
  </v-card>
</template>

<style scoped>
.title {
  white-space: normal;
  word-break: break-word;
}
</style>
