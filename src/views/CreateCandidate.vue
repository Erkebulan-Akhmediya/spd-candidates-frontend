<script lang="ts">
import { defineComponent } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import Nationalities from '@/components/CreateCandidate/Nationalities.vue'
import Languages from '@/components/CreateCandidate/Languages.vue'
import DriverLicenses from '@/components/CreateCandidate/DriverLicenses.vue'
import RecruitedMethods from '@/components/CreateCandidate/RecruitedMethods.vue'
import Experience from '@/components/CreateCandidate/Experience.vue'

export default defineComponent({
  name: 'CreateCandidate',

  components: {
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

  async created() {},

  methods: {
    async goBack() {
      await this.$router.push('/candidate/all')
    },

    showError(msg: string) {
      console.log(msg)
      this.errMsg = msg
      this.toShowErr = true
    },

    showComment(toShowComment: boolean) {
      this.toShowComment = toShowComment
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
        <v-row justify="space-around">
          <v-col cols="4">
            <v-text-field label="Фамилия" variant="outlined" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Имя" variant="outlined" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Отество" variant="outlined" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-date-input label="Дата рождения" variant="outlined" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Место рождения" variant="outlined" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="4">
            <v-text-field label="ИИН" variant="outlined" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Номер телефона" variant="outlined" />
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
            <v-text-field label="Образование" variant="outlined" />
          </v-col>
          <v-col cols="4">
            <v-text-field label="Отношение к спорту" variant="outlined" />
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
            <v-textarea variant="outlined" label="Результат проверки ВБ" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-textarea variant="outlined" label="Дополнительные сведения" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-row class="pa-5">
        <v-btn variant="elevated" class="mr-3">Отмена</v-btn>
        <v-btn variant="elevated" color="primary">Сохранить</v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
