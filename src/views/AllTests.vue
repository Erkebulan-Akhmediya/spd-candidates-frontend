<script lang="ts">
import { defineComponent } from 'vue'

interface TestListItem {
  id: number
  nameRus: string
  nameKaz: string
  isLimitless: boolean
  duration: number
  areasOfActivities: string[]
}

export default defineComponent({
  name: 'AllTests',

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
      ],
    }
  },

  async mounted() {
    await this.fetchTests()
  },

  methods: {
    async openTestForm(): Promise<void> {
      await this.$router.push({ path: '/test/create' })
    },

    async fetchTests(): Promise<void> {
      try {
        const { data } = await this.axios.get('/test/all', {
          params: {
            pageSize: this.pageSize,
            pageNumber: this.pageNumber - 1,
          }
        })
        this.tests = data.tests
        this.count = data.count
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
        <p>{{ getTestName(item) }}</p>
      </template>

      <template v-slot:[`item.duration`]="{ item }">
        <p>{{ item.duration }} мин</p>
      </template>

      <template v-slot:[`item.areasOfActivities`]="{ item }">
        <v-row>
          <v-chip v-for="(area, index) in item.areasOfActivities" :key="index" class="ma-1">
            {{ area }}
          </v-chip>
        </v-row>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<style scoped></style>
