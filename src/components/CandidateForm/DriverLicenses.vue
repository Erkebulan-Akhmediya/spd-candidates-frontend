<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'

export default defineComponent({
  name: 'DriverLicenses',

  props: {
    disabled: Boolean,
    readonly: Boolean,
  },

  data() {
    return {
      driverLicenses: new Array<string>(),
    }
  },

  async created() {
    await this.fetchDriverLicenses()
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate']),
  },

  methods: {
    async fetchDriverLicenses() {
      try {
        this.driverLicenses = await this.$http.get<string[]>('/driver_license/all')
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
    v-model="candidate.driverLicenseCodes"
    :disabled="disabled"
    :readonly="readonly"
    multiple
    chips
    closable-chips
  />
</template>

<style scoped></style>
