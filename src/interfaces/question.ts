import type { Translatable } from '@/interfaces/global.ts'
import type { OptionToCreate, OptionToSend, PassingOption } from '@/interfaces/option.ts'

export interface Question extends Translatable {
  withFile: boolean
}

export interface QuestionToCreate extends Question {
  file: File | null
  options: OptionToCreate[]
}

export interface QuestionToSend extends Question {
  fileName: string | null
  options: OptionToSend[]
}

export interface PassingQuestion extends Question {
  id: number
  answer: Answer | null
  fileUrl: string | null
  options: PassingOption[]
}

export type Answer =
  | AnswerForOpenQuestion
  | AnswerForMcqWithOneOrNoCorrect
  | AnswerForMcqWithMultipleCorrect
  | AnswerForPointDistribution

export type AnswerForOpenQuestion = string
export type AnswerForMcqWithOneOrNoCorrect = number
export type AnswerForMcqWithMultipleCorrect = number[]
export type AnswerForPointDistribution = { optionId: number; point: number }[]
