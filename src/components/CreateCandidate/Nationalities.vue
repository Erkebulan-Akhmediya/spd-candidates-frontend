<script lang="ts">
import { defineComponent } from 'vue'

interface Nationality {
  code: number
  nameKaz: string
  nameRus: string
}

export default defineComponent({
  name: `Nationalities`,

  data() {
    return {
      nationalities: new Array<Nationality>(),
    }
  },

  async created() {
    await this.fetchNationalities()
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
    :item-title="getNationalityName"
  />
</template>

<style scoped></style>
