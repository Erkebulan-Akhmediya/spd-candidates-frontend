<script lang="ts">
import { defineComponent } from 'vue'

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
    }
  },

  methods: {
    async goToCreateCandidate() {
      await this.$router.push({ path: '/candidate/create' })
    },
  },
})
</script>

<template>
  <v-data-table :items-per-page="pageSize" :page="pageNumber">
    <template v-slot:top>
      <v-row justify="end" class="pt-5 pr-5">
        <v-btn icon v-if="tabType === 'new'" @click="goToCreateCandidate">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </template>
  </v-data-table>
</template>

<style scoped></style>
