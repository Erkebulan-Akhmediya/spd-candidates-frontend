<script lang="ts">
import { defineComponent } from 'vue'

interface CandidateListItem {
  lastName: string
  firstName: string
  middleName: string
}

export default defineComponent({
  name: 'AllCandidatesTab',

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
          title: 'Фамилия'
        },
        {
          key: 'firstName',
          title: 'Имя'
        },
        {
          key: 'middleName',
          title: 'Отчество'
        }
      ]
    }
  },

  async mounted() {
    await this.fetchCandidates()
  },

  methods: {
    async goToCreateCandidate() {
      await this.$router.push({ path: '/candidate/create' })
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
    }
  }
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
  </v-data-table-server>
</template>

<style scoped></style>
