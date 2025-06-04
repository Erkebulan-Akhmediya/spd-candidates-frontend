import { defineStore } from 'pinia'
import { type PassingTest, type EditableTest, TestType, type TestTypeApi } from '@/interfaces/test.ts'
import type { EditableVariant } from '@/interfaces/variant.ts'
import { type EditableQuestion} from '@/interfaces/question.ts'
import type { EditableOption } from '@/interfaces/option.ts'
import type { ConditionalSectioningVar, Scale, ScaleSection } from '@/interfaces/test-evaluation.ts'

export const useTestStore = defineStore('test', {
  state() {
    return {
      test: {
        nameRus: '',
        nameKaz: '',
        descriptionRus: '',
        descriptionKaz: '',
        isLimitless: false,
        duration: 0,
        areasOfActivities: new Array<string>(),
        type: TestType.withMcqHavingNoCorrect,
        maxPointsPerQuestion: 3,
        conditionallySectioned: false,
        conditionalVars: new Array<ConditionalSectioningVar>(),
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
            conditions: []
          }),
        }),
        variants: new Array<EditableVariant>({
          questions: new Array<EditableQuestion>({
            withFile: false,
            file: null,
            nameRus: '',
            nameKaz: '',
            isDisappearing: false,
            timeToDisappear: 1,
            options: new Array<EditableOption>({
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
      } as EditableTest,
      passingTest: {} as PassingTest,
      optionsPerQuestion: 2,
      testTypes: new Array<TestTypeApi>(),
      singleScaleTypes: [
        TestType.withMcqHavingOneCorrect,
        TestType.withMcqHavingMultipleCorrect
      ],
      answerAllowed: true,
    }
  },
})
