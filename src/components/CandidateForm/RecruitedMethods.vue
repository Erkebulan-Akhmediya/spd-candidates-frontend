<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import type { RecruitedMethod } from '@/interfaces/candidate.ts'

export default defineComponent({
  name: 'RecruitedMethods',

  props: {
    disabled: Boolean,
    readonly: Boolean,
  },

  data() {
    return {
      selectedMethodId: Number(),
    }
  },

  async created() {
    await this.fetchRecruitedMethods()
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate', 'recruitedMethods']),
  },

  methods: {
    getTranslatedName,
    async fetchRecruitedMethods() {
      try {
        this.recruitedMethods = await this.$http.get<RecruitedMethod[]>('/recruited_method/all')
      } catch (e) {
        console.log(e)
        this.$emit('error', 'Не удалось вывести справочные данные по откуда нашли кандидата')
      }
    },

    onMethodUpdate(methodId: number) {
      this.$emit('show-comment', methodId === 4)
    },
  },
})
</script>

<template>
  <v-autocomplete
    label="Откуда подобран кандидат"
    variant="outlined"
    :items="recruitedMethods"
    item-value="id"
    :item-title="getTranslatedName"
    @update:model-value="onMethodUpdate"
    v-model="candidate.recruitedMethodId"
    :disabled="disabled"
    :readonly="readonly"
  />
</template>

<style scoped></style>
