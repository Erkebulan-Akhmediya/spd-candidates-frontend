import { defineStore } from 'pinia'
import type { Candidate, Experience } from '@/interfaces/candidate.ts'

export const useCandidateStore = defineStore('candidate', {
  state() {
    return {
      candidate: {
        lastName: String(),
        firstName: String(),
        middleName: String(),
        birthDate: new Date(),
        birthPlace: String(),
        testingRegionId: Number(),
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
        password: String(),
        areaOfActivity: String(),
      } as Candidate
    }
  }
})
