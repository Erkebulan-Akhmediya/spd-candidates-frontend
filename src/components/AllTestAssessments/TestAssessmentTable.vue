<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useRegionStore } from '@/stores/region.ts'
import { useTestAssessmentStore } from '@/stores/test-assessment.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import type { TestSessionForAssessment, TestSessionListForAssessment } from '@/interfaces/test-assessment.ts'

export default defineComponent({
  name: 'TestAssessmentTable',

  data() {
    return {
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
          key: 'statusName',
          title: 'Статус'
        },
        {
          key: 'openButton',
          title: '',
          width: '10%'
        }
      ],
      pageNumber: 1,
      pageSize: 10,
      count: 0,
      testSessions: new Array<TestSessionForAssessment>()
    }
  },

  computed: {
    ...mapWritableState(useRegionStore, ['selectedRegionId']),
    ...mapWritableState(useTestAssessmentStore, ['tab'])
  },

  async mounted() {
    await this.fetchTestSessionsForAssessment()
  },

  methods: {
    getTranslatedName,
    async fetchTestSessionsForAssessment() {
      try {
        const { count, testSessions } = await this.$http.get<TestSessionListForAssessment>(
          '/test/session/all/assessment',
          {
            params: {
              pageNumber: this.pageNumber - 1,
              pageSize: this.pageSize,
              regionId: this.selectedRegionId[0],
              checked: this.tab === 'checked'
            }
          }
        )
        this.count = count
        this.testSessions = testSessions
      } catch (e) {
        console.log(e)
      }
    },
    getChipColor(item: TestSessionForAssessment): string {
      return item.statusId === 3 ? 'success' : 'error'
    },
    async openTestSession(item: TestSessionForAssessment): Promise<void> {
      await this.$router.push(`/test/${item.id}/assessment`)
    }
  },

  watch: {
    selectedRegionId() {
      this.fetchTestSessionsForAssessment()
    },
    tab() {
      this.fetchTestSessionsForAssessment()
    }
  }
})
</script>

<template>
  <v-data-table-server
    :items-length="count"
    v-model:items-per-page="pageSize"
    v-model:page="pageNumber"
    :items="testSessions"
    :headers="headers"
    @update:options="fetchTestSessionsForAssessment"
  >
    <template v-slot:[`item.testName`]="{ item }">
      <p>{{ getTranslatedName({ nameKaz: item.testNameKaz, nameRus: item.testNameRus }) }}</p>
    </template>
    <template v-slot:[`item.statusName`]="{ item }">
      <v-chip :color="getChipColor(item)">
        {{ getTranslatedName({ nameKaz: item.statusNameKaz, nameRus: item.statusNameRus }) }}
      </v-chip>
    </template>
    <template v-slot:[`item.openButton`]="{ item }">
      <v-btn color="primary" @click="openTestSession(item)">
        Проверить
      </v-btn>
    </template>
  </v-data-table-server>
</template>

<style scoped></style>
