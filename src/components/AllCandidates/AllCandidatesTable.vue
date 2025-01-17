<script lang="ts">
import { defineComponent } from 'vue'

interface CandidateListItem {
  identificationNumber: string
  lastName: string
  firstName: string
  middleName: string
}

export default defineComponent({
  name: 'AllCandidatesTable',

  props: {
    tabType: {
      type: String,
      required: true,
    },
    regionId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      pageSize: 5,
      pageNumber: 1,
      tabToStatusId: new Map<string, number>([
        ['new', 1],
        ['security', 2],
        ['approval', 3],
        ['approved', 4],
        ['rejected', 5],
      ]),
      candidates: new Array<CandidateListItem>(),
      count: 0,
      headers: [
        {
          key: 'lastName',
          title: 'Фамилия',
        },
        {
          key: 'firstName',
          title: 'Имя',
        },
        {
          key: 'middleName',
          title: 'Отчество',
        },
        {
          key: 'viewButton',
          title: '',
        },
      ],
      test: {},
    }
  },

  async mounted() {
    await this.fetchCandidates()
  },

  methods: {
    async goToCreateCandidate() {
      await this.$router.push({ path: '/candidate/create' })
    },

    async goCandidatePage(id: string) {
      if (this.tabType === 'new') {
        await this.$router.push({ path: `/candidate/${id}` })
      } else if (this.tabType === 'security') {
        await this.$router.push({ path: `/candidate/${id}/security` })
      } else if (this.tabType === 'approval') {
        await this.$router.push({ path: `/candidate/${id}/approval` })
      } else if (this.tabType === 'approved') {
        await this.$router.push({ path: `/candidate/${id}/approved` })
      } else if (this.tabType === 'rejected') {
        await this.$router.push({ path: `/candidate/${id}/rejected` })
      }
    },

    async fetchCandidates() {
      try {
        const { data } = await this.axios.get('/candidate/all', {
          params: {
            regionId: this.regionId,
            statusId: this.tabToStatusId.get(this.tabType),
            pageNumber: this.pageNumber - 1,
            pageSize: this.pageSize,
          },
        })
        this.count = data.count
        this.candidates = data.candidates
      } catch (e: unknown) {
        console.log(e)
      }
    },
  },

  watch: {
    async regionId() {
      await this.fetchCandidates()
    },
  },
})
</script>

<template>
  <v-data-table-server
    :items-length="count"
    v-model:items-per-page="pageSize"
    v-model:page="pageNumber"
    :items="candidates"
    :headers="headers"
    @update:options="fetchCandidates"
  >
    <template v-slot:top>
      <v-row justify="end" class="pt-5 pr-5">
        <v-btn icon v-if="tabType === 'new'" @click="goToCreateCandidate">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </template>

    <template v-slot:[`item.viewButton`]="{ item }">
      <v-btn variant="text" class="ma-2" @click="goCandidatePage(item.identificationNumber)">
        <v-icon>mdi-eye</v-icon>
      </v-btn>
    </template>
  </v-data-table-server>
</template>

<style scoped></style>
