<script lang="ts">
import DownloadCertificateBtn from '@/components/CandidateForm/DownloadCertificateBtn.vue'
import type { Education } from '@/interfaces/candidate.ts'
import { useCandidateStore } from '@/stores/candidate.ts'
import hasRole from '@/utils/HasRole.ts'
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CandidateFormActions',
  components: { DownloadCertificateBtn },

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

    async goBack(): Promise<void> {
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
      if (this.candidate.experiences.length === 0) return

      const hasInvalid = this.candidate.experiences.some(
        (experience) =>
          !experience.startDate ||
          (!experience.untilNow && !experience.endDate) ||
          !experience.companyName ||
          !experience.position,
      )

      if (hasInvalid) {
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

    validatePassword(): void {
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
      if (this.candidatePhoto !== null) {
        this.candidate.photoFileName = await this.$file.upload(this.candidatePhoto)
      }
      await this.$http.put('/candidate', this.candidate)
      this.candidatePhoto = null
    },

    async reject(): Promise<void> {
      try {
        this.validate()
        await this.$http.put(`/candidate/reject/${this.candidate.identificationNumber}`)
        await this.goBack()
      } catch (e) {
        console.log(e)
        this.$emit('error', 'Ошибка отправки на проверку ВБ')
      }
    },

    async sendToSecurityCheck(): Promise<void> {
      try {
        this.validate()
        await this.$http.put('/candidate/to/security', this.candidate)
        await this.goBack()
      } catch (e) {
        console.log(e)
        this.$emit('error', 'Ошибка отправки на проверку ВБ')
      }
    },

    async sendToApproval(): Promise<void> {
      try {
        this.validate()
        await this.$http.put('/candidate/to/approval', this.candidate)
        await this.goBack()
      } catch (e) {
        console.log(e)
        this.$emit('error', 'Ошибка отправки на согласование')
      }
    },

    async approve(): Promise<void> {
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
      text="Удалить"
    />
    <v-btn variant="elevated" class="mr-3" @click="goBack" v-if="tab === 'create'" text="Отмена" />
    <v-btn
      variant="elevated"
      class="mr-3"
      @click="goBack"
      v-else-if="['approved', 'rejected'].includes(tab)"
      text="Назад"
    />
    <v-btn variant="elevated" class="mr-3" @click="reject" color="error" v-else text="Отказать" />
    <v-btn
      variant="elevated"
      class="mr-3"
      color="primary"
      @click="save"
      v-if="['create', 'new'].includes(tab)"
      text="Сохранить"
    />
    <v-btn
      variant="elevated"
      class="mr-3"
      color="primary"
      @click="sendToSecurityCheck"
      v-if="tab === 'new' && hasRole('admin')"
      text="Направить на проверку ВБ"
    />
    <v-btn
      variant="elevated"
      class="mr-3"
      color="primary"
      @click="sendToApproval"
      v-else-if="tab === 'security'"
      text="Направить на согласование"
    />
    <v-btn
      variant="elevated"
      class="mr-3"
      color="primary"
      @click="approve"
      v-else-if="tab === 'approval'"
      text="Согласовать"
    />
    <download-certificate-btn class="mr-3" />
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
