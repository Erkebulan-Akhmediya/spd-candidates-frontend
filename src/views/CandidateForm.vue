<script lang="ts">
import AreaOfActivity from '@/components/CandidateForm/AreaOfActivity.vue'
import CandidateFormActions from '@/components/CandidateForm/CandidateFormActions.vue'
import DriverLicenses from '@/components/CandidateForm/DriverLicenses.vue'
import Education from '@/components/CandidateForm/Education.vue'
import Experience from '@/components/CandidateForm/Experience.vue'
import LanguageKnowledge from '@/components/CandidateForm/LanguageKnowledge.vue'
import Nationalities from '@/components/CandidateForm/Nationalities.vue'
import RecruitedMethods from '@/components/CandidateForm/RecruitedMethods.vue'
import TestingRegion from '@/components/CandidateForm/TestingRegion.vue'
import type { Candidate } from '@/interfaces/candidate.ts'
import { useCandidateStore } from '@/stores/candidate.ts'
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'

export default defineComponent({
  name: 'CandidateForm',

  components: {
    LanguageKnowledge,
    Education,
    AreaOfActivity,
    CandidateFormActions,
    TestingRegion,
    Experience,
    RecruitedMethods,
    DriverLicenses,
    Nationalities,
    VDateInput,
  },

  props: {
    tab: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      errMsg: String(),
      toShowErr: false,
      toShowComment: false,
    }
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate', 'candidatePhoto']),

    title(): string {
      if (this.tab === 'create') return 'Новый кандидат'
      if (this.tab === 'new') return 'Анкета кандидата'
      if (this.tab === 'security') return 'Проверка ВБ'
      if (this.tab === 'approval') return 'Согласование'
      return ''
    },
  },

  async mounted() {
    this.clear()
    if (this.tab !== 'create') await this.fetchCandidate()
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

    async fetchCandidate() {
      try {
        const candidate = await this.$http.get<Candidate>(`/candidate/${this.$route.params.id}`)
        this.candidate = candidate
        this.candidate.birthDate = new Date(candidate.birthDate)
      } catch (e) {
        console.log(e)
        this.showError('Не удалось получить данные канидата')
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
      this.candidate.languageKnowledge = []
      this.candidate.driverLicenseCodes = []
      this.candidate.education = []
      this.candidate.sport = ''
      this.candidate.recruitedMethodId = 0
      this.candidate.recruitedMethodComment = ''
      this.candidate.experiences = []
      this.candidate.securityCheckResult = ''
      this.candidate.additionalData = ''
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
        <p class="ml-5">{{ title }}</p>
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
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Пароль"
              variant="outlined"
              v-model="candidate.password"
              v-if="tab === 'create'"
            />
          </v-col>
          <v-col cols="4">
            <v-file-input
              prepend-icon=""
              prepend-inner-icon="$file"
              label="Фото"
              variant="outlined"
              v-model="candidatePhoto"
              :disabled="['approval', 'security', 'approved', 'rejected'].includes(tab)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-text-field
              label="Фамилия"
              variant="outlined"
              v-model="candidate.lastName"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Имя"
              variant="outlined"
              v-model="candidate.firstName"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Отчество"
              variant="outlined"
              v-model="candidate.middleName"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-date-input
              label="Дата рождения"
              prepend-icon=""
              prepend-inner-icon="$calendar"
              variant="outlined"
              v-model="candidate.birthDate"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Место рождения"
              variant="outlined"
              v-model="candidate.birthPlace"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
          <v-col cols="4">
            <testing-region
              @error="showError"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-text-field
              label="ИИН"
              variant="outlined"
              v-model="candidate.identificationNumber"
              type="number"
              :rules="[(t: string) => t.length === 12 || 'ИИН должен содержать 12 цифр']"
              :disabled="tab !== 'create'"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Номер телефона"
              variant="outlined"
              v-model="candidate.phoneNumber"
              type="number"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              label="Отношение к спорту"
              variant="outlined"
              v-model="candidate.sport"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <nationalities
              @error="showError"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
          <v-col cols="4">
            <driver-licenses
              @error="showError"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
          <v-col cols="4">
            <recruited-methods
              @error="showError"
              @show-comment="showComment"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="4"
            v-if="toShowComment || ['approval', 'security', 'approved', 'rejected'].includes(tab)"
          >
            <v-text-field
              label="Коментарий к рекомендации"
              variant="outlined"
              v-model="candidate.recruitedMethodComment"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
          <v-col cols="4" v-if="['approval', 'approved', 'rejected'].includes(tab)">
            <area-of-activity
              @error="showError"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col col="12">
            <language-knowledge
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <education
              @error="showError"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <experience
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              variant="outlined"
              label="Результат проверки ВБ"
              v-model="candidate.securityCheckResult"
              :disabled="['approval'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea
              variant="outlined"
              label="Дополнительные сведения"
              v-model="candidate.additionalData"
              :disabled="['approval', 'security'].includes(tab)"
              :readonly="['approved', 'rejected'].includes(tab)"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <candidate-form-actions :tab="tab" @error="showError" />
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
