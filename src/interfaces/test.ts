import type { Translatable } from '@/interfaces/global.ts'
import type { Variant } from '@/interfaces/variant.ts'

export interface Test extends Translatable {
  isLimitless: boolean
  duration: number
}

export interface TestToCreate extends Test {
  areasOfActivities: string[]
  variants: Variant[]
}

export interface PassingTest extends Test {
  id: number
  questionCount: number
  selectedQuestion: number
  testSessionId: number
}

export interface TestListItem extends Test {
  id: number
  areasOfActivities: string[]
}
