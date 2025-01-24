import { defineStore } from 'pinia'
import {
  type Option, type PassingTest,
  type Question,
  QuestionType,
  type QuestionTypeApi,
  type TestToCreate,
  type Variant
} from '@/interfaces/interfaces.ts'

export const useTestStore = defineStore('test', {
  state() {
    return {
      test: {
        nameRus: '',
        nameKaz: '',
        isLimitless: false,
        duration: 0,
        areasOfActivities: new Array<string>(),
        variants: new Array<Variant>(
          {
            questions: new Array<Question>(
              {
                withFile: false,
                file: null,
                nameRus: '',
                nameKaz: '',
                type: QuestionType.mcqWithOneCorrect,
                options: new Array<Option>(
                  {
                    withFile: false,
                    file: null,
                    nameKaz: '',
                    nameRus: '',
                    isCorrect: null,
                  },
                ),
              }
            ),
          }
        ),
      } as TestToCreate,
      questionTypes: new Array<QuestionTypeApi>(),
      passingTest: {} as PassingTest,
    };
  },
})
