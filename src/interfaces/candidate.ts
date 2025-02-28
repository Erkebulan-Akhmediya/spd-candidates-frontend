import type { Translatable } from '@/interfaces/global.ts'

export interface Experience {
  index: number
  startDate: Date
  endDate: Date
  position: string
  companyName: string
}

export interface Education {
  index: number
  startDate: Date
  untilNow: boolean
  endDate: Date | null
  type: number
  organization: string
  major: string
}

export interface EducationType extends Translatable {
  id: number
}

export interface Language extends Translatable {
  code: string
}

export interface LanguageKnowledge {
  index: number
  languageCode: string
  levelCode: string
}

export interface Candidate {
  lastName: string
  firstName: string
  middleName: string
  birthDate: Date
  birthPlace: string
  testingRegionId: number
  identificationNumber: string
  phoneNumber: string
  nationalityCode: number
  driverLicenseCodes: string[]
  education: Education[]
  sport: string
  recruitedMethodId: number
  recruitedMethodComment: string
  experiences: Experience[]
  securityCheckResult: string
  additionalData: string
  username: string
  password: string
  areaOfActivity: string
  photoFileName: string | null
  languageKnowledge: LanguageKnowledge[]
}

export type Tab = 'create' | 'new' | 'security' | 'approval' | 'approved' | 'rejected'
