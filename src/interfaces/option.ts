import type { Translatable } from '@/interfaces/global.ts'

export interface Option extends Translatable {
  id?: number
  withFile: boolean
  file: File | null
  isCorrect: boolean | null
}
