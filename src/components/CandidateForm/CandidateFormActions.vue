<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'
import type { Education } from '@/interfaces/candidate.ts'
import hasRole from '@/utils/HasRole.ts'
import Docxtemplater from 'docxtemplater'
import { saveAs } from 'file-saver'
import PizZip from 'pizzip'

export default defineComponent({
  name: 'CandidateFormActions',

  emits: ['error'],

  props: {
    tab: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      showApproveDeleteDialog: false,
      approveDeleteDialogData: {
        candidateIdentificationNumber: '',
      },
    }
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate', 'candidatePhoto']),
  },

  methods: {
    hasRole,
    async goBack() {
      await this.$router.push('/candidate/all')
    },

    validate(): void {
      this.validateFields()
      this.validateExperiences()
      this.validateEducation()
    },

    validateFields(): void {
      const err: string[] = []

      if (!this.candidate.username) err.push('имя пользователя')
      if (!this.candidate.lastName) err.push('фамилия')
      if (!this.candidate.firstName) err.push('имя')
      if (!this.candidate.birthDate) err.push('дата рождения')
      if (!this.candidate.birthPlace) err.push('место рождения')
      if (!this.candidate.identificationNumber) err.push('ИИН')
      if (!this.candidate.phoneNumber) err.push('номер телефона')
      if (!this.candidate.nationalityCode) err.push('национальность')
      if (!this.candidate.sport) err.push('отношение к спорту')
      if (!this.candidate.recruitedMethodId) err.push('откуда подобран кандидат')
      if (!this.candidate.securityCheckResult) err.push('результат проверки ВБ')

      if (err.length > 0) throw `следующие поля обязательны: ${err.join(', ')}`
    },

    validateExperiences(): void {
      if (
        this.candidate.experiences.some(
          (experience) =>
            !experience.startDate ||
            (!experience.untilNow && !experience.endDate) ||
            !experience.companyName ||
            !experience.position,
        )
      ) {
        throw 'Имеются не заполненные поля в опыте работы'
      }
    },

    validateEducation(): void {
      if (
        this.candidate.education.some(
          (education: Education): boolean =>
            !education.startDate ||
            (!education.untilNow && !education.endDate) ||
            !education.type ||
            !education.organization ||
            !education.major,
        )
      ) {
        throw 'Имеются не заполненные поля в образовании'
      }
    },

    validatePassword() {
      if (!this.candidate.password) throw 'Пароль обязателен'
    },

    async save(): Promise<void> {
      try {
        this.validate()
        if (this.tab === 'create') {
          await this.saveNewCandidate()
        } else if (this.tab === 'new') {
          await this.updateCandidate()
        }
        await this.goBack()
      } catch (e: unknown) {
        this.$emit('error', `Не удалось сохранить кандидата: ${e}`)
        console.log(e)
      }
    },

    async saveNewCandidate(): Promise<void> {
      this.validatePassword()
      if (this.candidatePhoto !== null) {
        this.candidate.photoFileName = await this.$file.upload(this.candidatePhoto)
      } else {
        this.candidate.photoFileName = null
      }
      await this.$http.post('/candidate', this.candidate)
    },

    async updateCandidate(): Promise<void> {
      await this.$http.put('/candidate', this.candidate)
    },

    async reject() {
      try {
        this.validate()
        await this.$http.put(`/candidate/reject/${this.candidate.identificationNumber}`)
        await this.goBack()
      } catch (e) {
        console.log(e)
        this.$emit('error', 'Ошибка отправки на проверку ВБ')
      }
    },

    async sendToSecurityCheck() {
      try {
        this.validate()
        await this.$http.put('/candidate/to/security', this.candidate)
        await this.goBack()
      } catch (e) {
        console.log(e)
        this.$emit('error', 'Ошибка отправки на проверку ВБ')
      }
    },

    async sendToApproval() {
      try {
        this.validate()
        await this.$http.put('/candidate/to/approval', this.candidate)
        await this.goBack()
      } catch (e) {
        console.log(e)
        this.$emit('error', 'Ошибка отправки на согласование')
      }
    },

    async approve() {
      try {
        if (!this.candidate.areaOfActivity) {
          return this.$emit('error', 'Направление деятельности не выбрано')
        }
        await this.$http.put(
          `/candidate/approve/${this.candidate.identificationNumber}`,
          {},
          {
            params: {
              areaOfActivity: this.candidate.areaOfActivity,
            },
          },
        )
        await this.goBack()
      } catch (e) {
        console.log(e)
        this.$emit('error', 'Ошибка отправки на согласование')
      }
    },

    openApproveDeleteDialog(): void {
      this.showApproveDeleteDialog = true
    },

    closeApproveDeleteDialog(): void {
      this.showApproveDeleteDialog = false
    },

    async deleteCandidate(): Promise<void> {
      try {
        if (
          this.candidate.identificationNumber !==
          this.approveDeleteDialogData.candidateIdentificationNumber
        ) {
          return alert('ИИН не совпадает')
        }
        await this.$http.delete(`/candidate/${this.candidate.identificationNumber}`)
        this.closeApproveDeleteDialog()
        await this.goBack()
      } catch (e) {
        console.log('error deleting the candidate', e)
      }
    },

    async downloadCertificate(): Promise<void> {
      try {
        const response = await fetch('/candidate-certificate.docx')
        const templateContent = await response.arrayBuffer()
        const zip = new PizZip(templateContent)
        const doc = new Docxtemplater(zip)
        const data = {
          lastName: this.candidate.lastName,
          firstName: this.candidate.firstName,
          middleName: this.candidate.middleName,
          birthDate: this.formatBirthDate(this.candidate.birthDate),
          birthPlace: this.candidate.birthPlace,
          identificationNumber: this.candidate.identificationNumber,
          phoneNumber: this.candidate.phoneNumber,
        }
        doc.render(data)
        const outputBlob = doc.getZip().generate({ type: 'blob' })
        saveAs(outputBlob, 'generated-document.docx')
      } catch (e) {
        console.log(e)
      }
    },

    formatBirthDate(birthDate: Date): string {
      const birthDateDay = birthDate.getDate().toString().padStart(2, '0')
      const birthDateMonth = (birthDate.getMonth()+1).toString().padStart(2, '0')
      return `${birthDateDay}.${birthDateMonth}.${birthDate.getFullYear()}`
    }

  },
})
</script>

<template>
  <v-row class="pa-5">
    <v-btn
      variant="elevated"
      class="mr-3"
      color="error"
      v-if="tab !== 'create'"
      @click="openApproveDeleteDialog"
    >
      Удалить
    </v-btn>

    <v-btn variant="elevated" class="mr-3" @click="goBack" v-if="tab === 'create'">Отмена</v-btn>
    <v-btn
      variant="elevated"
      class="mr-3"
      @click="goBack"
      v-else-if="['approved', 'rejected'].includes(tab)"
    >
      Назад
    </v-btn>
    <v-btn variant="elevated" class="mr-3" @click="reject" color="error" v-else>Отказать</v-btn>

    <v-btn
      variant="elevated"
      class="mr-3"
      color="primary"
      @click="save"
      v-if="['create', 'new'].includes(tab)"
    >
      Сохранить
    </v-btn>

    <v-btn
      variant="elevated"
      class="mr-3"
      color="primary"
      @click="sendToSecurityCheck"
      v-if="tab === 'new' && hasRole('admin')"
    >
      Направить на проверку ВБ
    </v-btn>

    <v-btn
      variant="elevated"
      class="mr-3"
      color="primary"
      @click="sendToApproval"
      v-else-if="tab === 'security'"
    >
      Направить на согласование
    </v-btn>

    <v-btn
      variant="elevated"
      class="mr-3"
      color="primary"
      @click="approve"
      v-else-if="tab === 'approval'"
    >
      Согласовать
    </v-btn>

    <v-btn variant="elevated" class="mr-3" color="primary" @click="downloadCertificate"
      >Скачать справку</v-btn
    >
  </v-row>

  <v-dialog v-model="showApproveDeleteDialog" max-width="500">
    <v-card>
      <v-card-text>
        <v-col cols="12">
          <p>Введите ИИН кандмдата, чтобы подтвердить удание</p>
          <v-chip color="red" label class="my-3">
            <v-icon icon="mdi-exclamation-thick" start />
            Удание кандидата необратимо
          </v-chip>
          <v-text-field
            variant="outlined"
            label="ИИН Кандидата"
            v-model="approveDeleteDialogData.candidateIdentificationNumber"
          />
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="tonal" @click="closeApproveDeleteDialog">Отмена</v-btn>
        <v-btn variant="elevated" color="error" @click="deleteCandidate">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
