<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DriverLicenses',

  data() {
    return {
      driverLicenses: new Array<string>(),
    }
  },

  async created() {
    await this.fetchDriverLicenses()
  },

  methods: {
    async fetchDriverLicenses() {
      try {
        const { data } = await this.axios.get('/driver_license/all')
        this.driverLicenses = data.driverLicenses
      } catch (e) {
        console.log(e)
        this.$emit('error', 'Не удалось вывести справочные данные по водительским правам')
      }
    },
  },
})
</script>

<template>
  <v-autocomplete
    label="Водительские права"
    variant="outlined"
    :items="driverLicenses"
    multiple
    chips
    closable-chips
  />
</template>

<style scoped></style>
