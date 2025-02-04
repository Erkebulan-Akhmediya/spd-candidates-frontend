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
  endDate: Date
  type: number
  organization: string
  major: string
}

export interface EducationType extends Translatable {
  id: number
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
  languageCodes: string[]
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
}

export type Tab = 'create' | 'new' | 'security' | 'approval' | 'approved' | 'rejected'
