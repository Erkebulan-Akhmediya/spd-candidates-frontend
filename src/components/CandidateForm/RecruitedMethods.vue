<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'

interface RecruitedMethod {
  id: number
  nameRus: string
  nameKaz: string
}

export default defineComponent({
  name: 'RecruitedMethods',

  props: {
    disabled: Boolean,
    readonly: Boolean,
  },

  data() {
    return {
      recruitedMethods: new Array<RecruitedMethod>(),
      selectedMethodId: Number()
    }
  },

  async created() {
    await this.fetchRecruitedMethods()
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate'])
  },

  methods: {
    async fetchRecruitedMethods() {
      try {
        const { data } = await this.axios.get('/recruited_method/all')
        this.recruitedMethods = data.recruitedMethods
      } catch (e) {
        console.log(e)
        this.$emit('error', 'Не удалось вывести справочные данные по откуда нашли кандидата')
      }
    },

    getRecruitedMethodName(method: RecruitedMethod) {
      if (this.$i18n.locale === 'ru') return method.nameRus
      return method.nameKaz
    },

    onMethodUpdate(methodId: number) {
      this.$emit('show-comment', methodId === 4)
    }

  }
})
</script>

<template>
  <v-autocomplete
    label="Откуда подобран кандидат"
    variant="outlined"
    :items="recruitedMethods"
    item-value="id"
    :item-title="getRecruitedMethodName"
    @update:model-value="onMethodUpdate"
    v-model="candidate.recruitedMethodId"
    :disabled="disabled"
    :readonly="readonly"
  />
</template>

<style scoped></style>
