<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'
import type { Translatable } from '@/interfaces/global.ts'
import { getTranslatedName } from '@/utils/Translate.ts'

interface Nationality extends Translatable {
  code: number
}

export default defineComponent({
  name: `Nationalities`,

  props: {
    disabled: Boolean,
    readonly: Boolean,
  },

  data() {
    return {
      nationalities: new Array<Nationality>(),
    }
  },

  async created() {
    await this.fetchNationalities()
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate']),
  },

  methods: {
    getTranslatedName,
    async fetchNationalities() {
      try {
        this.nationalities = await this.$http.get<Nationality[]>('/nationality/all')
      } catch (e: unknown) {
        console.log(e)
        this.$emit('error', 'Не удалось вывести справочные данные по национальностям')
      }
    },
  },
})
</script>

<template>
  <v-autocomplete
    label="Национальность"
    variant="outlined"
    :items="nationalities"
    item-value="code"
    :item-title="getTranslatedName"
    v-model="candidate.nationalityCode"
    :disabled="disabled"
    :readonly="readonly"
  />
</template>

<style scoped></style>
