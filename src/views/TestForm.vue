<script lang="ts">
import { defineComponent } from 'vue'
import VariantConstructorList from '@/components/TestForm/VariantConstructorList.vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import TestAreaOfActivity from '@/components/TestForm/TestAreaOfActivity.vue'
import type { VariantToCreate, VariantToSend } from '@/interfaces/variant.ts'
import type { QuestionToCreate, QuestionToSend } from '@/interfaces/question.ts'
import type { OptionToCreate, OptionToSend } from '@/interfaces/option.ts'
import type { TestToCreate, TestToSend } from '@/interfaces/test.ts'

export default defineComponent({
  name: 'TestForm',
  components: { TestAreaOfActivity, VariantConstructorList },

  computed: {
    ...mapWritableState(useTestStore, ['test', 'questionTypes']),
  },

  data() {
    return {
      emptyFields: new Array<string>(),
      errors: new Array<string>(),
      isConfirmSaveDialogOpen: false,
      errMsg: String(),
      toShowErr: false,
    }
  },

  async created() {
    await this.fetchQuestionTypes()
  },

  methods: {
    async goBack(): Promise<void> {
      await this.$router.push('/test/all')
    },

    async fetchQuestionTypes(): Promise<void> {
      try {
        const { data } = await this.axios.get('/question/type/all')
        this.questionTypes = data.questionTypes
      } catch (e) {
        console.log(e)
      }
    },

    validateOption(
      option: OptionToCreate,
      variantIndex: number,
      questionIndex: number,
      optionIndex: number,
    ) {
      if (option.withFile && option.file === null) {
        this.emptyFields.push(
          `файл в варианте ответа ${optionIndex + 1} в вопросе ${questionIndex + 1} в варианте ${variantIndex + 1}`,
        )
      }
      if (!option.nameKaz) {
        this.emptyFields.push(
          `ответ (каз) в варианте ответа ${optionIndex + 1} в вопросе ${questionIndex + 1} в варианте ${variantIndex + 1}`,
        )
      }
      if (!option.nameRus) {
        this.emptyFields.push(
          `ответ (рус) в варианте ответа ${optionIndex + 1} в вопросе ${questionIndex + 1} в варианте ${variantIndex + 1}`,
        )
      }
    },

    validateQuestionByType(
      question: QuestionToCreate,
      variantIndex: number,
      questionIndex: number,
    ): void {
      const correctCount: number = question.options.filter(
        (option: OptionToCreate): boolean => option.isCorrect ?? false,
      ).length

      if (question.type === 1 || question.type === 2) {
        question.options = []
        return
      } else if (question.type === 3) {
        if (question.options.length < 2) {
          this.errors.push(
            `не достаточное количество вариантов в вопросе ${questionIndex + 1} в варианте ${variantIndex + 1}`,
          )
        }
      } else if (question.type === 4) {
        if (question.options.length < 2) {
          this.errors.push(
            `не достаточное количество вариантов в вопросе ${questionIndex + 1} в варианте ${variantIndex + 1}`,
          )
        }
        if (correctCount !== 1) {
          this.errors.push(
            `в вопросе ${questionIndex + 1}  в варианте ${variantIndex + 1} должен быть один правильный вариант ответа`,
          )
        }
      } else if (question.type === 5) {
        if (question.options.length < 2) {
          this.errors.push(
            `не достаточное количество вариантов ответа в вопросе ${questionIndex + 1} в варианте ${variantIndex + 1}`,
          )
        }
        if (correctCount < 2) {
          this.errors.push(
            `в вопросе ${questionIndex + 1} в варианте ${variantIndex + 1} должен быть один правильный вариант ответа`,
          )
        }
      }
    },

    validateQuestion(
      question: QuestionToCreate,
      variantIndex: number,
      questionIndex: number,
    ): void {
      if (question.withFile && question.file === null) {
        this.emptyFields.push(`файл в вопросе ${questionIndex + 1} в варианте ${variantIndex + 1}`)
      }
      if (!question.nameRus) this.emptyFields.push(`вопрос (рус) в вопросе ${questionIndex + 1}`)
      if (!question.nameKaz) this.emptyFields.push(`вопрос (каз) в вопросе ${questionIndex + 1}`)
      if (!question.type) this.emptyFields.push(`тип в вопросе ${questionIndex + 1}`)

      this.validateQuestionByType(question, variantIndex, questionIndex)

      question.options.forEach((option: OptionToCreate, optionIndex: number): void => {
        this.validateOption(option, variantIndex, questionIndex, optionIndex)
      })
    },

    validateVariant(variant: VariantToCreate, variantIndex: number): void {
      variant.questions.forEach((question: QuestionToCreate, questionIndex: number): void => {
        this.validateQuestion(question, variantIndex, questionIndex)
      })
    },

    validateTest(): void {
      if (!this.test.nameRus) this.emptyFields.push('название теста (рус)')
      if (!this.test.nameKaz) this.emptyFields.push('название теста (каз)')
      if (!this.test.isLimitless && !this.test.duration) this.emptyFields.push('длительность')
      if (this.test.areasOfActivities.length === 0) {
        this.emptyFields.push('направления деятельности')
      }

      this.test.variants.forEach((variant: VariantToCreate, variantIndex: number): void => {
        this.validateVariant(variant, variantIndex)
      })
    },

    validateData(): void {
      this.emptyFields = new Array<string>()
      this.errors = new Array<string>()

      this.validateTest()

      if (this.emptyFields.length > 0) {
        throw `следующие поля не заполнены: ${this.emptyFields.join(', ')}`
      }
      if (this.errors.length > 0) {
        throw `возникли следующие ошибки: ${this.errors.join(', ')}`
      }
    },

    testToFormData(): FormData {
      const test: FormData = new FormData()
      test.append('nameRus', this.test.nameRus)
      test.append('nameKaz', this.test.nameKaz)
      test.append('isLimitless', String(this.test.isLimitless))
      test.append('duration', String(this.test.duration))

      this.test.areasOfActivities.forEach((area: string, index: number): void => {
        test.append(`areasOfActivities[${index}]`, area)
      })

      this.test.variants.forEach((variant: VariantToCreate, variantIndex: number): void => {
        const variantPrefix: string = `variants[${variantIndex}]`
        variant.questions.forEach((question: QuestionToCreate, questionIndex: number): void => {
          const questionPrefix: string = `${variantPrefix}.questions[${questionIndex}]`
          test.append(`${questionPrefix}.withFile`, String(question.withFile))
          if (question.withFile) {
            test.append(`${questionPrefix}.file`, question.file!, question.file!.name)
          }
          test.append(`${questionPrefix}.nameRus`, question.nameRus)
          test.append(`${questionPrefix}.nameKaz`, question.nameKaz)
          test.append(`${questionPrefix}.type`, String(question.type))

          question.options.forEach((option: OptionToCreate, optionIndex: number): void => {
            const optionPrefix: string = `${questionPrefix}.options[${optionIndex}]`
            test.append(`${optionPrefix}.withFile`, String(option.withFile))
            if (option.withFile) {
              test.append(`${optionPrefix}.file`, option.file!, option.file!.name)
            }
            test.append(`${optionPrefix}.nameRus`, option.nameRus)
            test.append(`${optionPrefix}.nameKaz`, option.nameKaz)
            if (option.isCorrect !== null) {
              test.append(`${optionPrefix}.isCorrect`, String(option.isCorrect))
            }
          })
        })
      })

      return test
    },

    async convertOptionToSend(option: OptionToCreate): Promise<OptionToSend> {
      return {
        ...option,
        fileName: option.withFile ? await this.$file.upload(option.file!) : null,
      }
    },

    async convertQuestionToSend(question: QuestionToCreate): Promise<QuestionToSend> {
      return {
        ...question,
        fileName: question.withFile ? await this.$file.upload(question.file!) : null,
        options: await Promise.all(question.options.map(this.convertOptionToSend))
      }
    },

    async convertVariantToSend(variant: VariantToCreate): Promise<VariantToSend> {
      return {
        ...variant,
        questions: await Promise.all(variant.questions.map(this.convertQuestionToSend)),
      }
    },

    async convertTestToSend(test: TestToCreate): Promise<TestToSend> {
      return {
        ...test,
        variants: await Promise.all(test.variants.map(this.convertVariantToSend)),
      }
    },

    async saveTest(): Promise<void> {
      try {
        this.validateData()

        const test: TestToSend = await this.convertTestToSend(this.test)

        await this.axios.post('/test', test)

        await this.$router.push('/test/all')
      } catch (e) {
        this.isConfirmSaveDialogOpen = false
        console.log(e)
        await this.showErr(`${e}`)
      }
    },

    async showErr(msg: string): Promise<void> {
      this.errMsg = msg
      this.toShowErr = true
    },
  },
})
</script>

<template>
  <v-alert
    title="Ошибка"
    :text="errMsg"
    type="error"
    closable
    class="ma-2"
    v-model="toShowErr"
    width="600"
  />
  <v-card>
    <v-card-title>
      <v-row class="pa-5">
        <v-btn @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
          <p>Назад</p>
        </v-btn>
        <p class="ml-5">Новый тест</p>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field label="Название теста (каз)" variant="outlined" v-model="test.nameKaz" />
        </v-col>
        <v-col cols="6">
          <v-text-field label="Название теста (рус)" variant="outlined" v-model="test.nameRus" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-text-field
            label="Длительность"
            variant="outlined"
            type="number"
            suffix="мин"
            v-model="test.duration"
            :disabled="test.isLimitless"
          />
        </v-col>
        <v-col cols="2">
          <v-checkbox label="Без ограничений" v-model="test.isLimitless" />
        </v-col>
        <v-col cols="3">
          <test-area-of-activity @error="showErr" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <variant-constructor-list />
        </v-col>
      </v-row>

      <v-dialog v-model="isConfirmSaveDialogOpen" max-width="400">
        <v-card>
          <v-card-title>Сохранить тест?</v-card-title>
          <v-card-actions>
            <v-row justify="end" class="pa-3">
              <v-btn color="error" variant="tonal" @click="isConfirmSaveDialogOpen = false">
                Отмена
              </v-btn>
              <v-btn color="primary" variant="elevated" @click="saveTest" class="ml-3">
                Сохранить
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>

    <v-card-actions>
      <v-row class="pa-2">
        <v-btn variant="tonal" class="mr-2">Отмена</v-btn>
        <v-btn variant="elevated" color="primary" @click="isConfirmSaveDialogOpen = true"
          >Сохранить
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
