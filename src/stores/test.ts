import { defineStore } from 'pinia'
import {
  type PassingTest,
  type TestToCreate,
} from '@/interfaces/test.ts'
import type { VariantToCreate } from '@/interfaces/variant.ts'
import { type QuestionToCreate, QuestionType, type QuestionTypeApi } from '@/interfaces/question.ts'
import type { OptionToCreate } from '@/interfaces/option.ts'

export const useTestStore = defineStore('test', {
  state() {
    return {
      test: {
        nameRus: '',
        nameKaz: '',
        isLimitless: false,
        duration: 0,
        areasOfActivities: new Array<string>(),
        variants: new Array<VariantToCreate>({
          questions: new Array<QuestionToCreate>({
            withFile: false,
            file: null,
            nameRus: '',
            nameKaz: '',
            type: QuestionType.mcqWithOneCorrect,
            options: new Array<OptionToCreate>({
              withFile: false,
              file: null,
              nameKaz: '',
              nameRus: '',
              isCorrect: null,
            }),
          }),
        }),
      } as TestToCreate,
      questionTypes: new Array<QuestionTypeApi>(),
      passingTest: {} as PassingTest,
    }
  },
})
