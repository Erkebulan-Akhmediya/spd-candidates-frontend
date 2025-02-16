<script lang="ts">
import { defineComponent } from 'vue'
import type { CheckedTestSession, CheckedTestSessionList } from '@/interfaces/test-result.ts'
import { mapWritableState } from 'pinia'
import { useRegionStore } from '@/stores/region.ts'
import { getTranslatedName } from '@/utils/Translate.ts'

export default defineComponent({
  name: 'TestResultTable',

  data() {
    return {
      count: 0,
      pageSize: 10,
      pageNumber: 1,
      headers: [
        {
          key: 'candidateFullName',
          title: 'Кандидат'
        },
        {
          key: 'testName',
          title: 'Тест'
        },
        {
          key: 'openButton',
          title: '',
          width: '10%'
        }
      ],
      testSessions: new Array<CheckedTestSession>(),
    }
  },

  computed: {
    ...mapWritableState(useRegionStore, ['selectedRegionId']),
  },

  methods: {
    getTranslatedName,
    async fetchTestSessionsForResults(): Promise<void> {
      try {
        const { count, testSessions } = await this.$http.get<CheckedTestSessionList>(
          '/test/session/all/result',
          {
            params: {
              pageNumber: this.pageNumber - 1,
              pageSize: this.pageSize,
              regionId: this.selectedRegionId[0],
            }
          }
        )
        this.count = count
        this.testSessions = testSessions
      } catch (e) {
        console.log(e)
      }
    },
    async openTestResult(testSession: CheckedTestSession): Promise<void> {
      await this.$router.push(`/test/${testSession.id}/result`)
    },
  },

  watch: {
    async selectedRegionId() {
      await this.fetchTestSessionsForResults()
    }
  },

})
</script>

<template>
  <v-data-table-server
    :items-length="count"
    v-model:items-per-page="pageSize"
    v-model:page="pageNumber"
    :items="testSessions"
    :headers="headers"
    @update:options="fetchTestSessionsForResults"
  >
    <template v-slot:[`item.testName`]="{ item }">
      <p>{{ getTranslatedName({ nameKaz: item.testNameKaz, nameRus: item.testNameRus }) }}</p>
    </template>
    <template v-slot:[`item.openButton`]="{ item }">
      <v-btn variant="elevated" color="primary" @click="openTestResult(item)">Посмотреть</v-btn>
    </template>
  </v-data-table-server>
</template>

<style scoped>

</style>
