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

export default defineComponent({
  name: 'CreateCandidate',

  components: {
    Experience,
    RecruitedMethods,
    DriverLicenses,
    Languages,
    Nationalities,
    VDateInput
  },

  data() {
    return {
      errMsg: String(),
      toShowErr: false,
      toShowComment: false
    }
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate'])
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

    async save(): Promise<void> {
      try {
        await this.axios.post('/candidate', this.candidate)
        this.$router.push('/candidate/all')
      } catch (e: unknown) {
        this.showError('Не удалось сохранить кандидата')
        console.log(e)
      }
    }

  }
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
            <v-text-field label="Имя пользователя" variant="outlined" v-model="candidate.username" />
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
            <v-text-field label="Место рождения" variant="outlined" v-model="candidate.birthPlace" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-text-field label="ИИН" variant="outlined" v-model="candidate.identificationNumber" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Номер телефона" variant="outlined" v-model="candidate.phoneNumber" />
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
            <v-textarea variant="outlined" label="Результат проверки ВБ" v-model="candidate.securityCheckResult" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea variant="outlined" label="Дополнительные сведения" v-model="candidate.additionalData" />
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
