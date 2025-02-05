<script lang="ts">
import { defineComponent } from 'vue'
import { getTranslatedName } from '../utils/Translate.ts'
import type { GetAllTestsResponse, TestListItem } from '@/interfaces/test.ts'

export default defineComponent({
  name: 'TestsConstructor',

  data() {
    return {
      count: 0,
      pageSize: 5,
      pageNumber: 1,
      tests: new Array<TestListItem>(),
      headers: [
        {
          key: 'name',
          title: 'Название',
        },
        {
          key: 'duration',
          title: 'Длительность',
        },
        {
          key: 'areasOfActivities',
          title: 'Направления',
        },
        {
          key: 'menu',
          title: '',
        },
      ],
    }
  },

  async mounted() {
    await this.fetchTests()
  },

  methods: {
    getTranslatedName,

    async openTestForm(): Promise<void> {
      await this.$router.push({ path: '/test/create' })
    },

    async openTestEvaluationForm(testId: number): Promise<void> {
      await this.$router.push({ path: `/test/${testId}/evaluation` })
    },

    async fetchTests(): Promise<void> {
      try {
        const data = await this.$http.get<GetAllTestsResponse>('/test/all', {
          params: {
            pageSize: this.pageSize,
            pageNumber: this.pageNumber - 1,
          },
        })
        this.tests = data.tests
        this.count = data.count
      } catch (e) {
        console.log(e)
      }
    },
  },
})
</script>

<template>
  <v-container fluid>
    <v-data-table-server
      :items-length="count"
      v-model:items-per-page="pageSize"
      v-model:page="pageNumber"
      :items="tests"
      :headers="headers"
      @update:options="fetchTests"
      disable-sort
    >
      <template v-slot:top>
        <v-row justify="end">
          <v-btn icon="mdi-plus" color="primary" @click="openTestForm" />
        </v-row>
      </template>

      <template v-slot:[`item.name`]="{ item }">
        <p>{{ getTranslatedName(item) }}</p>
      </template>

      <template v-slot:[`item.duration`]="{ item }">
        <p>{{ item.isLimitless ? 'Без ограничений' : `${item.duration} мин` }}</p>
      </template>

      <template v-slot:[`item.areasOfActivities`]="{ item }">
        <v-row>
          <v-chip v-for="(area, index) in item.areasOfActivities" :key="index" class="ma-1">
            {{ area }}
          </v-chip>
        </v-row>
      </template>

      <template v-slot:[`item.menu`]="{item}">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" />
          </template>

          <v-list hover="hover">
            <v-list-item title="Методика оценивания" @click="openTestEvaluationForm(item.id)" />
            <v-list-item title="Вопросы"></v-list-item>
            <v-list-item title="Удалить"></v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<style scoped></style>
