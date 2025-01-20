import { defineStore } from 'pinia'
import {
  type Option,
  type Question,
  QuestionType,
  type QuestionTypeApi,
  type Test,
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
      } as Test,
      questionTypes: new Array<QuestionTypeApi>(),
    };
  },
})
