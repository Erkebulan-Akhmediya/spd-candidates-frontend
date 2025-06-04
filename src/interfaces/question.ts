import type { Translatable } from '@/interfaces/global.ts'
import type { EditableOption, SendableOption, PassingOption } from '@/interfaces/option.ts'

export interface Question extends Translatable {
  withFile: boolean
}

export interface EditableQuestion extends Question {
  file: File | null
  options: EditableOption[]
  isDisappearing: boolean
  timeToDisappear: number
}

export interface SendableQuestion extends Question {
  fileName: string | null
  options: SendableOption[]
  isDisappearing: boolean
  timeToDisappear: number
}

export interface PassingQuestion extends Question {
  id: number
  answer: Answer | null
  fileUrl: string | null
  isDisappearing: boolean
  timeToDisappear: number
  options: PassingOption[]
}

export type Answer =
  | AnswerForOpenQuestion
  | AnswerForMcqWithOneOrNoCorrect
  | AnswerForMcqWithMultipleCorrect
  | AnswerForPointDistribution
  | File

export type AnswerForOpenQuestion = string
export type AnswerForMcqWithOneOrNoCorrect = number
export type AnswerForMcqWithMultipleCorrect = number[]
export type AnswerForPointDistribution = { optionId: number; point: number }[]
