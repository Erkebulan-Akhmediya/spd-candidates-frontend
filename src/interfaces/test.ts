import type { Translatable } from '@/interfaces/global.ts'
import type { VariantToCreate, VariantToSend } from '@/interfaces/variant.ts'
import type { PassingQuestion } from '@/interfaces/question.ts'
import type { Scale } from '@/interfaces/test-evaluation.ts'

export interface Test extends Translatable {
  isLimitless: boolean
  duration: number
}

interface TestToCreateOrSend extends Test {
  areasOfActivities: string[]
  type: TestType.withMcqHavingNoCorrect
  maxPointsPerQuestion: number
  scales: Scale[]
}

export interface TestToCreate extends TestToCreateOrSend {
  variants: VariantToCreate[]
}

export interface TestToSend extends TestToCreateOrSend {
  variants: VariantToSend[]
}

export interface PassingTest extends Test {
  id: number
  questionIds: number[]
  questions: Map<number, PassingQuestion>
  selectedQuestionIndex: number
  testSessionId: number
  selectedQuestion: PassingQuestion | null
  testTypeId: number
}

export interface TestListItem extends Test {
  id: number
  areasOfActivities: string[]
}

export interface GetAllTestsResponse {
  tests: TestListItem[]
  count: number
}

export interface TestTypeApi extends Translatable {
  id: number
  automaticallyEvaluated: boolean
}

export enum TestType {
  withOpenQuestions = 1,
  withMcqHavingNoCorrect = 2,
  withMcqHavingOneCorrect = 3,
  withMcqHavingMultipleCorrect = 4,
  pointDistribution = 5,
}
