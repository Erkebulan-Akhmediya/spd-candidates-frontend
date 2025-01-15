import { defineStore } from 'pinia'
import type { Experience } from '@/components/CreateCandidate/Experience.vue'

interface Candidate {
  lastName: string,
  firstName: string,
  middleName: string,
  birthDate: Date,
  birthPlace: string,
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

export const useCandidateStore = defineStore('candidate', {
  state() {
    return {
      candidate: {
        lastName: String(),
        firstName: String(),
        middleName: String(),
        birthDate: new Date(),
        birthPlace: String(),
        identificationNumber: String(),
        phoneNumber: String(),
        nationalityCode: Number(),
        languageCodes: new Array<string>(),
        driverLicenseCodes: new Array<string>(),
        education: String(),
        sport: String(),
        recruitedMethodId: Number(),
        recruitedMethodComment: String(),
        experiences: new Array<Experience>(),
        securityCheckResult: String(),
        additionalData: String(),
        username: String(),
        password: String()
      } as Candidate
    }
  }
})
