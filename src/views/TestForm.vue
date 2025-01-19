<script lang="ts">
import { defineComponent } from 'vue'
import Variants from '@/components/TestForm/Variants.vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: 'TestForm',
  components: { Variants },

  computed: {
    ...mapWritableState(useTestStore, ['test', 'questionTypes']),
  },

  async created() {
    await this.fetchQuestionTypes()
  },

  methods: {
    async goBack(): Promise<void> {
      await this.$router.push('/test/all')
    },

    async fetchQuestionTypes(): Promise<void> {
      try {
        const {data} = await this.axios.get('/question/type/all')
        this.questionTypes = data.questionTypes
      } catch (e) {
        console.log(e)
      }
    },
  }
})
</script>

<template>
  <v-card>
    <v-card-title>
      <v-row class="pa-5">
        <v-btn @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
          <p>Назад</p>
        </v-btn>
        <p class="ml-5">Новый тест</p>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field label="Название теста (каз)" variant="outlined" v-model="test.nameKaz" />
        </v-col>
        <v-col cols="6">
          <v-text-field label="Название теста (рус)" variant="outlined" v-model="test.nameRus" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-text-field
            label="Длительность"
            variant="outlined"
            type="number"
            suffix="мин"
            v-model="test.duration"
            :disabled="test.isLimitless"
          />
        </v-col>
        <v-col cols="2">
          <v-checkbox label="Без ограничений" v-model="test.isLimitless" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <variants />
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-row class="pa-2">
        <v-btn variant="tonal" class="mr-2">Отмена</v-btn>
        <v-btn variant="elevated" color="primary">Сохранить</v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped>

</style>
