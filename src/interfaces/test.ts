import type { Translatable } from '@/interfaces/global.ts'
import type { EditableVariant, SendableVariant } from '@/interfaces/variant.ts'
import type { PassingQuestion } from '@/interfaces/question.ts'
import type { ConditionalSectioningVar, ConditionalSectioningVarValue, Scale } from '@/interfaces/test-evaluation.ts'

export interface Test extends Translatable {
  isLimitless: boolean
  duration: number
  descriptionRus: string
  descriptionKaz: string
}

interface EditableAndSendableTest extends Test {
  areasOfActivities: string[]
  type: TestType.withMcqHavingNoCorrect
  maxPointsPerQuestion: number
  scales: Scale[]
  conditionallySectioned: boolean
  conditionalVars: ConditionalSectioningVar[]
}

export interface EditableTest extends EditableAndSendableTest {
  variants: EditableVariant[]
}

export interface SendableTest extends EditableAndSendableTest {
  variants: SendableVariant[]
}

export interface PassingTest extends Test {
  id: number
  questionIds: number[]
  questions: Map<number, PassingQuestion>
  selectedQuestionIndex: number
  testSessionId: number
  selectedQuestion: PassingQuestion | null
  testTypeId: number
  conditionallySectioned: boolean
  conditionalVars: ConditionalSectioningVar[]
  conditionalVarValues: ConditionalSectioningVarValue[]
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
  fileAnswer = 6
}
