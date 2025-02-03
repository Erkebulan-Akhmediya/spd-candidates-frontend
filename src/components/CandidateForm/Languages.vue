<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'
import type { Translatable } from '@/interfaces/global.ts'
import { getTranslatedName } from '@/utils/Translate.ts'

interface Language extends Translatable {
  code: string
}

export default defineComponent({
  name: `Languages`,

  props: {
    disabled: Boolean,
    readonly: Boolean,
  },

  data() {
    return {
      languages: new Array<Language>(),
    }
  },

  async created() {
    await this.fetchLanguages()
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate']),
  },

  methods: {
    getTranslatedName,
    async fetchLanguages() {
      try {
        this.languages = await this.$http.get<Language[]>('/language/all')
      } catch (e: unknown) {
        console.log(e)
        this.$emit('error', 'Не удалось вывести справочные данные по языкам')
      }
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
    :item-title="getTranslatedName"
    v-model="candidate.languageCodes"
    :disabled="disabled"
    :readonly="readonly"
    multiple
    chips
    closable-chips
  />
</template>

<style scoped></style>
