<script lang="ts">
import { defineComponent } from 'vue'

interface Language {
  code: string
  nameRus: string
  nameKaz: string
}

export default defineComponent({
  name: `Languages`,

  data() {
    return {
      languages: new Array<Language>(),
    }
  },

  async created() {
    await this.fetchLanguages()
  },

  methods: {
    async fetchLanguages() {
      try {
        const { data } = await this.axios.get('/language/all')
        this.languages = data.languages
      } catch (e: unknown) {
        console.log(e)
        this.$emit('error', 'Не удалось вывести справочные данные по языкам')
      }
    },

    getLanguageName(language: Language) {
      if (this.$i18n.locale === 'ru') return language.nameRus
      return language.nameKaz
    },
  },
})
</script>

<template>
  <v-autocomplete
    label="Иностранные языки"
    variant="outlined"
    :items="languages"
    item-value="code"
    :item-title="getLanguageName"
  />
</template>

<style scoped></style>
