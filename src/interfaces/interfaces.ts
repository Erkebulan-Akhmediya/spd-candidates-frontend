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
}

export type Tab = 'create' | 'new' | 'security' | 'approval' | 'approved' | 'rejected'
