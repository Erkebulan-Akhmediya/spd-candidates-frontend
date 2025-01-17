<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'

interface Nationality {
  code: number
  nameKaz: string
  nameRus: string
}

export default defineComponent({
  name: `Nationalities`,

  props: {
    disabled: Boolean
  },

  data() {
    return {
      nationalities: new Array<Nationality>()
    }
  },

  async created() {
    await this.fetchNationalities()
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate'])
  },

  methods: {
    async fetchNationalities() {
      try {
        const { data } = await this.axios.get('/nationality/all')
        this.nationalities = data.nationalities
      } catch (e: unknown) {
        console.log(e)
        this.$emit('error', 'Не удалось вывести справочные данные по национальностям')
      }
    },

    getNationalityName(nationality: Nationality): string {
      if (this.$i18n.locale === 'ru') return nationality.nameRus
      return nationality.nameKaz
    }
  }
})
</script>

<template>
  <v-autocomplete
    label="Национальность"
    variant="outlined"
    :items="nationalities"
    item-value="code"
    :item-title="getNationalityName"
    v-model="candidate.nationalityCode"
    :disabled="disabled"
  />
</template>

<style scoped></style>
