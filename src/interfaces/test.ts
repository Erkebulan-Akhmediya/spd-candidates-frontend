import type { Translatable } from '@/interfaces/global.ts'
import type { VariantToCreate, VariantToSend } from '@/interfaces/variant.ts'
import type { PassingQuestion } from '@/interfaces/question.ts'

export interface Test extends Translatable {
  isLimitless: boolean
  duration: number
}

export interface TestToCreate extends Test {
  areasOfActivities: string[]
  variants: VariantToCreate[]
}

export interface TestToSend {
  areasOfActivities: string[]
  variants: VariantToSend[]
}

export interface PassingTest extends Test {
  id: number
  questionIds: number[]
  questions: Map<number, PassingQuestion>
  selectedQuestionIndex: number
  testSessionId: number
}

export interface TestListItem extends Test {
  id: number
  areasOfActivities: string[]
}
