import { defineStore } from 'pinia'
import type { Candidate, Education, Experience, LanguageKnowledge } from '@/interfaces/candidate.ts'

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
        driverLicenseCodes: new Array<string>(),
        education: new Array<Education>(),
        sport: String(),
        recruitedMethodId: Number(),
        recruitedMethodComment: String(),
        experiences: new Array<Experience>(),
        securityCheckResult: String(),
        additionalData: String(),
        username: String(),
        password: String(),
        areaOfActivity: String(),
        photoFileName: null,
        languageKnowledge: new Array<LanguageKnowledge>()
      } as Candidate,
      candidatePhoto: null as File | null,
    }
  }
})
