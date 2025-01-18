<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AllTests',

  methods: {

    async openTestForm(): Promise<void> {
      await this.$router.push({ path: '/test/create' })
    },

  },
})
</script>

<template>
  <v-container fluid>
    <v-data-table>
      <template v-slot:top>
        <v-row justify="end">
          <v-btn icon="mdi-plus" color="primary" @click="openTestForm" />
        </v-row>
      </template>
    </v-data-table>
  </v-container>
</template>

<style scoped>

</style>
