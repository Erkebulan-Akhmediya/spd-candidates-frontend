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
    }
  },
})
</script>

<template>
  <v-data-table :items-per-page="pageSize"></v-data-table>
</template>

<style scoped></style>
