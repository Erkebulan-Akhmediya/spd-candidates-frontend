import type { Translatable } from '@/interfaces/global.ts'

export interface Option extends Translatable {
  withFile: boolean
  isCorrect: boolean | null
}

export interface OptionToCreate extends Option {
  file: File | null
}

export interface OptionToSend extends Option {
  fileName: string | null
}

export interface PassingOption extends Option {
  id: number
  fileUrl: string | null
}
