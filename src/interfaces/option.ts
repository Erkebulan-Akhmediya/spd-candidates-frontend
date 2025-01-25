import type { Translatable } from '@/interfaces/global.ts'

export interface Option extends Translatable {
  withFile: boolean
  isCorrect: boolean | null
}

export interface OptionToCreate extends Option {
  file: File | null
}

export interface PassingOption extends Option {
  id: number
  file: string | null
}
