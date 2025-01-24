import type { Experience } from '@/components/CandidateForm/Experience.vue'
import PassingQuestion from '@/components/TestPassing/PassingQuestion.vue'

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
  nameRus: string
  nameKaz: string
  isLimitless: boolean
  duration: number
}

export interface TestToCreate extends Test {
  areasOfActivities: string[]
  variants: Variant[]
}

export interface PassingTest extends Test {
  id: number
  questionCount: number
  selectedQuestion: number
  testSessionId: number
}

export interface TestListItem extends Test {
  id: number
  areasOfActivities: string[]
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
  withFile: boolean
  file: File | null
  nameRus: string
  nameKaz: string
  type: QuestionType
  options: Option[]
}

export interface PassingQuestion extends Question {
  id: number
  /**
   * if the question is mcq it's option id or their array, otherwise it's user-typed answer
   */
  answer: string | number | number[]
}

export interface Option {
  id?: number
  withFile: boolean
  file: File | null
  nameRus: string
  nameKaz: string
  isCorrect: boolean | null
}
