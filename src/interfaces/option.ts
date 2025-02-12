import type { Translatable } from '@/interfaces/global.ts'
import type { OptionIncrement } from '@/interfaces/test-evaluation.ts'

export interface Option extends Translatable {
  withFile: boolean
  isCorrect: boolean | null
}

export interface OptionToCreate extends Option {
  file: File | null
  increment: OptionIncrement
}

export interface OptionToSend extends Option {
  fileName: string | null
  increment: OptionIncrement
}

export interface PassingOption extends Option {
  id: number
  fileUrl: string | null
}
