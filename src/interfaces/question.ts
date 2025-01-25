import type { Translatable } from '@/interfaces/global.ts'
import type { Option } from '@/interfaces/option.ts'

export enum QuestionType {
  withoutAnswer = 1,
  open = 2,
  mcqWithNoCorrect = 3,
  mcqWithOneCorrect = 4,
  mcqWithMultipleCorrect = 5,
}

export interface QuestionTypeApi extends Translatable {
  id: string
}

export interface Question extends Translatable {
  withFile: boolean
  file: File | null
  type: QuestionType
  options: Option[]
}

export interface PassingQuestion extends Question {
  id: number
  /**
   * if the question is mcq it's option id or their array, otherwise it's user-typed answer
   */
  answer: string | number | number[]
}
