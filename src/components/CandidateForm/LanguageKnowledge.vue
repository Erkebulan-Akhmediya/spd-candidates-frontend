<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'
import type { Language, LanguageKnowledge } from '@/interfaces/candidate.ts'
import type { Translatable } from '@/interfaces/global.ts'
import { getTranslatedName } from '@/utils/Translate.ts'

interface LanguageLevel extends Translatable {
  code: string
}

export default defineComponent({
  name: 'LanguageKnowledge',

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      headers: [
        { key: 'language', title: 'Язык', width: '48%' },
        { key: 'level', title: 'Уровень', width: '47%' },
        { key: 'deleteButton', title: '', width: '5%' },
      ],
      languages: new Array<Language>(),
      levels: new Array<LanguageLevel>(),
    }
  },

  async created() {
    await this.fetchLanguages()
    await this.fetchLanguageLevels()
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

    async fetchLanguageLevels() {
      try {
        this.levels = await this.$http.get<LanguageLevel[]>('/language/level/all')
      } catch (e: unknown) {
        console.log(e)
        this.$emit('error', 'Не удалось вывести справочные данные по уровням владения языков')
      }
    },

    addLanguageKnowledge(): void {
      this.candidate.languageKnowledge.push({
        index: this.nextLanguageKnowledgeIndex,
        languageCode: '',
        levelCode: '',
      })
    },

    deleteLanguageKnowledge(knowledgeToDelete: LanguageKnowledge): void {
      this.candidate.languageKnowledge = this.candidate.languageKnowledge.filter(
        (knowledge: LanguageKnowledge): boolean => knowledge.index !== knowledgeToDelete.index,
      )
    },
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate']),

    nextLanguageKnowledgeIndex(): number {
      if (this.candidate.languageKnowledge.length === 0) return 0
      return this.lastLanguageKnowledgeIndex + 1
    },

    lastLanguageKnowledgeIndex(): number {
      return this.lastLanguageKnowledge.index
    },

    lastLanguageKnowledge(): LanguageKnowledge {
      return this.candidate.languageKnowledge[this.candidate.languageKnowledge.length - 1]
    },
  },
})
</script>

<template>
  <v-card elevation="2">
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="candidate.languageKnowledge"
        hide-default-footer
        disable-sort
      >
        <template v-slot:top>
          <v-row justify="space-between" align="center" class="pa-3">
            <h2>Языки</h2>
            <v-btn
              v-if="!readonly"
              icon="mdi-plus"
              @click="addLanguageKnowledge"
              color="primary"
              :disabled="disabled"
            />
          </v-row>
        </template>

        <template v-slot:[`item.language`]="{ item }">
          <v-select
            class="mt-5"
            :items="languages"
            item-value="code"
            :item-title="getTranslatedName"
            v-model="item.languageCode"
            variant="outlined"
          />
        </template>

        <template v-slot:[`item.level`]="{ item }">
          <v-select
            class="mt-5"
            :items="levels"
            item-value="code"
            :item-title="getTranslatedName"
            v-model="item.levelCode"
            variant="outlined"
          />
        </template>

        <template v-slot:[`item.deleteButton`]="{ item }">
          <v-btn
            v-if="!readonly"
            icon="mdi-delete"
            @click="deleteLanguageKnowledge(item)"
            color="error"
            :disabled="disabled"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
