<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'GoBackBtn',

  methods: {
    goBack(): void {
      this.$router.go(-1)
    }
  }
})
</script>

<template>
  <v-btn @click="goBack">
    <v-icon>mdi-arrow-left</v-icon>
    <p>Назад</p>
  </v-btn>
</template>

<style scoped>

</style>
