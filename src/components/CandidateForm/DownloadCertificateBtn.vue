<script lang="ts">
import type {
  Education,
  EducationType,
  Experience,
  Language,
  LanguageKnowledge,
  Nationality,
  RecruitedMethod,
} from '@/interfaces/candidate.ts'
import { useCandidateStore } from '@/stores/candidate.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import Docxtemplater from 'docxtemplater'
import ImageModule from 'docxtemplater-image-module-free'
import { saveAs } from 'file-saver'
import { mapWritableState } from 'pinia'
import PizZip from 'pizzip'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DownloadCertificateBtn',

  computed: {
    ...mapWritableState(useCandidateStore, [
      'candidate',
      'candidatePhoto',
      'nationalities',
      'educationTypes',
      'languages',
      'languageLevels',
      'recruitedMethods',
    ]),

    certificateData() {
      return {
        lastName: this.candidate.lastName,
        firstName: this.candidate.firstName,
        middleName: this.candidate.middleName,
        birthDate: this.formatDate(this.candidate.birthDate),
        birthPlace: this.candidate.birthPlace,
        identificationNumber: this.candidate.identificationNumber,
        phoneNumber: this.candidate.phoneNumber,
        nationality: this.candidateNationalityName,
        education: this.candidateEducation,
        languages: this.candidateLanguageKnowledge,
        driverLicenses: this.candidate.driverLicenseCodes.join(', '),
        sport: this.candidate.sport,
        additionalData: this.candidate.additionalData,
        recruitedMethod: this.candidateRecruitedMethodName,
        securityCheckResult: this.candidate.securityCheckResult,
        experiences: this.candidateExperiences,
      }
    },

    candidateNationalityName(): string {
      const nationality: Nationality | undefined = this.nationalities.find(
        (nationality: Nationality): boolean => nationality.code === this.candidate.nationalityCode,
      )
      if (!nationality) return ''
      return getTranslatedName(nationality)
    },

    candidateEducation(): string {
      return this.candidate.education
        .filter((education: Education): boolean => !!education.endDate)
        .map((education: Education): string => {
          const educationTypeName: string = this.getEducationTypeName(education)
          const endYear: number = new Date(education.endDate!).getFullYear()
          return `${educationTypeName}, в ${endYear} году окончил ${education.organization} по специальности ${education.major}`
        })
        .join(', ')
    },

    candidateLanguageKnowledge(): string {
      return this.candidate.languageKnowledge
        .map((knowledge: LanguageKnowledge): string => {
          const language = this.languages.find((l) => l.code === knowledge.languageCode)
          const level = this.languageLevels.find((l) => l.code === knowledge.levelCode)

          const languageName = language ? this.getTranslatedName(language) : knowledge.languageCode
          const levelName = level ? this.getTranslatedName(level) : knowledge.levelCode

          return `${languageName} (${levelName})`
        })
        .join(', ')
    },

    candidateRecruitedMethodName(): string {
      const recruitedMethod: RecruitedMethod | undefined = this.recruitedMethods.find(
        (recruitedMethod: RecruitedMethod): boolean =>
          recruitedMethod.id === this.candidate.recruitedMethodId,
      )
      if (!recruitedMethod) return ''
      return this.getTranslatedName(recruitedMethod)
    },

    candidateExperiences() {
      return this.candidate.experiences.map((experience: Experience) => ({
        ...experience,
        startDate: this.formatDate(experience.startDate),
        endDate: experience.untilNow ? 'по н.в.' : this.formatDate(experience.endDate),
      }))
    },

    imageModule() {
      return new ImageModule({
        centered: false,
        fileType: 'docx',
        getImage: (tagValue: string) => {
          const base64Regex: RegExp = /^(?:data:)?image\/(png|jpg|jpeg|svg|svg\+xml);base64,/
          const base64String: string = tagValue.replace(base64Regex, '')
          const binaryString: string = window.atob(base64String)
          const len: number = binaryString.length
          const bytes = new Uint8Array(len)
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i)
          }
          return bytes.buffer
        },
        getSize: () => [150, 200],
      })
    },
  },

  methods: {
    getTranslatedName,

    async downloadCertificate(): Promise<void> {
      try {
        const zip = await this.getCertificateTemplateZip()
        const doc = new Docxtemplater(zip, {
          modules: [this.imageModule],
        })

        const base64CandidatePhoto: string = await this.getBase64CandidatePhoto()
        doc.render({
          ...this.certificateData,
          image: base64CandidatePhoto,
        })
        const outputBlob: Blob = doc.getZip().generate({ type: 'blob' })
        this.saveCertificate(outputBlob)
      } catch (e) {
        console.log(e)
      }
    },

    async getCertificateTemplateZip(): Promise<PizZip> {
      const response: Response = await fetch('/candidate-certificate.docx')
      const templateContent: ArrayBuffer = await response.arrayBuffer()
      return new PizZip(templateContent)
    },

    async getBase64CandidatePhoto(): Promise<string> {
      if (this.candidate.photoFileName) {
        return await this.$file.fetchBase64Url(this.candidate.photoFileName)
      }
      return ''
    },

    getEducationTypeName(education: Education): string {
      const type: EducationType | undefined = this.educationTypes.find(
        (type: EducationType): boolean => type.id === education.type,
      )
      if (!type) return ''
      return this.getTranslatedName(type)
    },

    getLanguageName(knowledge: LanguageKnowledge): string {
      const lang: Language | undefined = this.languages.find(
        (language: Language): boolean => language.code === knowledge.languageCode,
      )
      if (!lang) return ''
      return this.getTranslatedName(lang)
    },

    saveCertificate(blob: Blob): void {
      const candidateFullName: string = `${this.candidate.lastName} ${this.candidate.firstName} ${this.candidate.middleName}`
      const fileName: string = `справка ${candidateFullName} (${this.formatDate(new Date())}).docx`
      saveAs(blob, fileName)
    },

    formatDate(date: Date): string {
      date = new Date(date)
      const birthDateDay = date.getDate().toString().padStart(2, '0')
      const birthDateMonth = (date.getMonth() + 1).toString().padStart(2, '0')
      return `${birthDateDay}.${birthDateMonth}.${date.getFullYear()}`
    },
  },
})
</script>

<template>
  <v-btn variant="elevated" color="primary" @click="downloadCertificate">Скачать справку</v-btn>
</template>

<style scoped></style>
