<script lang="ts">
import { defineComponent } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import Nationalities from '@/components/CreateCandidate/Nationalities.vue'
import Languages from '@/components/CreateCandidate/Languages.vue'
import DriverLicenses from '@/components/CreateCandidate/DriverLicenses.vue'
import RecruitedMethods from '@/components/CreateCandidate/RecruitedMethods.vue'
import Experience from '@/components/CreateCandidate/Experience.vue'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'
import TestingRegion from '@/components/CreateCandidate/TestingRegion.vue'

export default defineComponent({
  name: 'CreateCandidate',

  components: {
    TestingRegion,
    Experience,
    RecruitedMethods,
    DriverLicenses,
    Languages,
    Nationalities,
    VDateInput,
  },

  data() {
    return {
      errMsg: String(),
      toShowErr: false,
      toShowComment: false,
    }
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate']),
  },

  methods: {
    async goBack() {
      await this.$router.push('/candidate/all')
    },

    showError(msg: string) {
      this.errMsg = msg
      this.toShowErr = true
    },

    showComment(toShowComment: boolean) {
      this.toShowComment = toShowComment
    },

    validate(): void {
      const err: string[] = []

      if (!this.candidate.username) err.push('имя пользователя')
      if (!this.candidate.password) err.push('пароль')
      if (!this.candidate.lastName) err.push('фамилия')
      if (!this.candidate.firstName) err.push('имя')
      if (!this.candidate.birthDate) err.push('дата рождения')
      if (!this.candidate.birthPlace) err.push('место рождения')
      if (!this.candidate.identificationNumber) err.push('ИИН')
      if (!this.candidate.phoneNumber) err.push('номер телефона')
      if (!this.candidate.nationalityCode) err.push('национальность')
      if (!this.candidate.education) err.push('образование')
      if (!this.candidate.sport) err.push('отношение к спорту')
      if (!this.candidate.recruitedMethodId) err.push('откуда подобран кандидат')
      if (!this.candidate.securityCheckResult) err.push('результат проверки ВБ')

      if (err.length > 0) throw `следующие поля обязательны: ${err.join(', ')}`

      if (
        this.candidate.experiences.some(
          (experience) =>
            !experience.startDate ||
            !experience.endDate ||
            !experience.companyName ||
            !experience.position,
        )
      ) {
        throw 'Имеются не заполненные поля в опыте работы'
      }
    },

    clear(): void {
      this.candidate.username = ''
      this.candidate.password = ''
      this.candidate.lastName = ''
      this.candidate.firstName = ''
      this.candidate.middleName = ''
      this.candidate.birthDate = new Date()
      this.candidate.birthPlace = ''
      this.candidate.identificationNumber = ''
      this.candidate.phoneNumber = ''
      this.candidate.nationalityCode = 0
      this.candidate.languageCodes = []
      this.candidate.driverLicenseCodes = []
      this.candidate.education = ''
      this.candidate.sport = ''
      this.candidate.recruitedMethodId = 0
      this.candidate.recruitedMethodComment = ''
      this.candidate.experiences = []
      this.candidate.securityCheckResult = ''
      this.candidate.additionalData = ''
    },

    async save(): Promise<void> {
      try {
        this.validate()
        await this.axios.post('/candidate', this.candidate)
        await this.$router.push('/candidate/all')
        this.clear()
      } catch (e: unknown) {
        this.showError(`Не удалось сохранить кандидата: ${e}`)
        console.log(e)
      }
    },
  },
})
</script>

<template>
  <v-alert
    title="Ошибка"
    :text="errMsg"
    type="error"
    closable
    class="ma-2"
    v-model="toShowErr"
    width="600"
  />
  <v-card>
    <v-card-title>
      <v-row justify="start" class="pa-5">
        <v-btn @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
          <p>Назад</p>
        </v-btn>
        <p class="ml-5">Новый кандидат</p>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-container fluid>
        <v-row>
          <v-col cols="4">
            <v-text-field
              label="Имя пользователя"
              variant="outlined"
              v-model="candidate.username"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Пароль" variant="outlined" v-model="candidate.password" />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4">
            <v-text-field label="Фамилия" variant="outlined" v-model="candidate.lastName" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Имя" variant="outlined" v-model="candidate.firstName" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Отество" variant="outlined" v-model="candidate.middleName" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-date-input label="Дата рождения" variant="outlined" v-model="candidate.birthDate" />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Место рождения"
              variant="outlined"
              v-model="candidate.birthPlace"
            />
          </v-col>
          <v-col cols="4">
            <testing-region @error="showError" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-text-field
              label="ИИН"
              variant="outlined"
              v-model="candidate.identificationNumber"
              type="number"
              :rules="[
                t => t.length === 12 || 'ИИН должен содержать 12 цифр',
              ]"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Номер телефона"
              variant="outlined"
              v-model="candidate.phoneNumber"
              type="number"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <nationalities @error="showError" />
          </v-col>
          <v-col cols="4">
            <languages @error="showError" />
          </v-col>
          <v-col cols="4">
            <driver-licenses @error="showError" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-text-field label="Образование" variant="outlined" v-model="candidate.education" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Отношение к спорту" variant="outlined" v-model="candidate.sport" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <recruited-methods @error="showError" @show-comment="showComment" />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Коментарий к рекомендации"
              variant="outlined"
              v-if="toShowComment"
              v-model="candidate.recruitedMethodComment"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <experience />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              variant="outlined"
              label="Результат проверки ВБ"
              v-model="candidate.securityCheckResult"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              variant="outlined"
              label="Дополнительные сведения"
              v-model="candidate.additionalData"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-row class="pa-5">
        <v-btn variant="elevated" class="mr-3">Отмена</v-btn>
        <v-btn variant="elevated" color="primary" @click="save">Сохранить</v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
