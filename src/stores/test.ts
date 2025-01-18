import { defineStore } from 'pinia'
import { type Option, type Question, QuestionType, type Test, type Variant } from '@/interfaces/interfaces.ts'

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
                file: '',
                nameRus: '',
                nameKaz: '',
                type: QuestionType.mcqWithOneCorrect,
                options: new Array<Option>(),
              }
            ),
          }
        ),
      } as Test
    };
  },
})
