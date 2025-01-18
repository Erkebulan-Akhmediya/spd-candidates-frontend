<script lang="ts">
import { defineComponent } from 'vue'
import Variants from '@/components/AllTests/Variants.vue'

export default defineComponent({
  name: 'TestForm',
  components: { Variants },

  data() {
    return {
      isInfinite: false,
    }
  },

  methods: {
    async goBack() {
      await this.$router.push('/test/all')
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
          <v-text-field label="Название теста" variant="outlined" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-text-field
            label="Длительность"
            variant="outlined"
            type="number"
            suffix="мин"
            :disabled="isInfinite"
          />
        </v-col>
        <v-col cols="2">
          <v-checkbox label="Без ограничений" v-model="isInfinite" />
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
