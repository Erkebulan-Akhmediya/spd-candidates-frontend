<script lang="ts">
import { defineComponent } from 'vue'
import type { TestListItem } from '@/interfaces/interfaces.ts'

export default defineComponent({
  name: 'AllTests',

  data() {
    return {
      tests: new Array<TestListItem>(),
    }
  },

  async mounted() {
    await this.fetchTests()
  },

  methods: {
    async fetchTests() {
      try {
        const { data } = await this.axios.get('/test/all', {
          params: {
            areaOfActivity: sessionStorage.getItem('areaOfActivity'),
          }
        })
        this.tests = data.tests
      } catch (e) {
        console.log(e)
      }
    },

    getTestName(test: TestListItem): string {
      if (this.$i18n.locale === 'ru') return test.nameRus
      return test.nameKaz
    },
  },
})
</script>

<template>
  <v-container fluid>
    <v-expansion-panels>
      <v-expansion-panel v-for="(test, index) in tests" :key="index" :title="getTestName(test)">
        <v-expansion-panel-text>
          <p>Длительность: {{ test.isLimitless ? 'Без ограничений' : `${test.duration} мин` }}</p>
          <v-row justify="end">
            <v-btn color="primary" class="mb-2">Начать</v-btn>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<style scoped></style>
