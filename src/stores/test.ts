import { defineStore } from 'pinia'
import { type PassingTest, type TestToCreate, TestType, type TestTypeApi } from '@/interfaces/test.ts'
import type { VariantToCreate } from '@/interfaces/variant.ts'
import { type QuestionToCreate} from '@/interfaces/question.ts'
import type { OptionToCreate } from '@/interfaces/option.ts'
import type { Scale, ScaleSection } from '@/interfaces/test-evaluation.ts'

export const useTestStore = defineStore('test', {
  state() {
    return {
      test: {
        nameRus: '',
        nameKaz: '',
        isLimitless: false,
        duration: 0,
        areasOfActivities: new Array<string>(),
        type: TestType.withMcqHavingNoCorrect,
        maxPointsPerQuestion: 3,
        scales: new Array<Scale>({
          index: 1,
          nameRus: 'Шкала по умолчанию',
          nameKaz: 'Шкала по умолчанию',
          sections: new Array<ScaleSection>({
            index: 1,
            upperBound: 0,
            lowerBound: 0,
            descriptionRus: '',
            descriptionKaz: '',
          }),
        }),
        variants: new Array<VariantToCreate>({
          questions: new Array<QuestionToCreate>({
            withFile: false,
            file: null,
            nameRus: '',
            nameKaz: '',
            options: new Array<OptionToCreate>({
              withFile: false,
              file: null,
              nameKaz: '',
              nameRus: '',
              isCorrect: null,
              increment: {
                index: 1,
                scaleIndex: 1,
                score: 0
              }
            }),
          }),
        }),
      } as TestToCreate,
      passingTest: {} as PassingTest,
      optionsPerQuestion: 2,
      testTypes: new Array<TestTypeApi>(),
      singleScaleTypes: [
        TestType.withMcqHavingOneCorrect,
        TestType.withMcqHavingMultipleCorrect
      ],
    }
  },
})
