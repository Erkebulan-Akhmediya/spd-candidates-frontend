import type { EditableQuestion, SendableQuestion } from '@/interfaces/question.ts'

export interface EditableVariant {
  questions: EditableQuestion[]
}

export interface SendableVariant {
  questions: SendableQuestion[]
}
