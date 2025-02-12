import type { Translatable } from '@/interfaces/global.ts'

export interface Scale extends Translatable {
  index: number
  sections: ScaleSection[]
}

export interface ScaleSection {
  index: number
  upperBound: number
  lowerBound: number
  descriptionRus: string
  descriptionKaz: string
}

export interface OptionIncrement {
  index: number
  scaleIndex: number
  score: number
}
