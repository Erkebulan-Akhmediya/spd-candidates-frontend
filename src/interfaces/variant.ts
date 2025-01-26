import type { QuestionToCreate, QuestionToSend } from '@/interfaces/question.ts'

export interface VariantToCreate {
  questions: QuestionToCreate[]
}

export interface VariantToSend {
  questions: QuestionToSend[]
}
