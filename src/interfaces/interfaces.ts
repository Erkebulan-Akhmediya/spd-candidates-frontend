import type { Experience } from '@/components/CandidateForm/Experience.vue'

export interface Region {
  id: number
  nameRus: string
  nameKaz: string
}

export interface Candidate {
  lastName: string,
  firstName: string,
  middleName: string,
  birthDate: Date,
  birthPlace: string,
  testingRegionId: number,
  identificationNumber: string,
  phoneNumber: string,
  nationalityCode: number,
  languageCodes: string[],
  driverLicenseCodes: string[],
  education: string,
  sport: string,
  recruitedMethodId: number,
  recruitedMethodComment: string,
  experiences: Experience[],
  securityCheckResult: string,
  additionalData: string,
  username: string,
  password: string,
  areaOfActivity: string,
}

export type Tab = 'create' | 'new' | 'security' | 'approval' | 'approved' | 'rejected'

export interface Test {
  id?: number
  nameRus: string
  nameKaz: string
  isLimitless: boolean
  duration?: number
  variants: Variant[]
}

export interface Variant {
  questions: Question[],
}

export enum QuestionType {
  withoutAnswer = 1,
  open = 2,
  mcqWithNoCorrect = 3,
  mcqWithOneCorrect = 4,
  mcqWithMultipleCorrect = 5,
}

export interface QuestionTypeApi {
  id: string
  nameRus: string
  nameKaz: string
}

export interface Question {
  id?: number
  withFile: boolean
  file: File | null
  nameRus: string
  nameKaz: string
  type: QuestionType
  answer?: string | number
  options: Option[]
}

export interface Option {
  id?: number
  withFile: boolean
  file: File | null
  nameRus: string
  nameKaz: string
  isCorrect: boolean | null
}
