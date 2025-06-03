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
  conditions: Condition[]
}

export interface Condition {
  varName: string
  operator: string
  value: string[]
}

export interface ConditionalSectioningVar {
  name: string
  type: ConditionalSectioningVarType
  reference: string[]
}

export type ConditionalSectioningVarValue = Omit<Condition, 'operator'>

export enum ConditionalSectioningVarType {
  number = 0,
  string = 1,
  boolean = 2,
  reference = 3,
}

export interface OptionIncrement {
  index: number
  scaleIndex: number
  score: number
}
