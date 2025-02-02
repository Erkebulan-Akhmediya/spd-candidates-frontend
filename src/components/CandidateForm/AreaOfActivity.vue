<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'

export default defineComponent({
  name: 'AreaOfActivity',

  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      areasOfActivity: new Array<string>(),
    }
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate']),
  },

  async created() {
    await this.fetchAreasOfActivity()
  },

  methods: {
    async fetchAreasOfActivity() {
      try {
        this.areasOfActivity = await this.$http.get<string[]>('/area_of_activity/all')
      } catch (e) {
        console.log(e)
        this.$emit('error', 'Не удалось загрузаить справочные данные по направлениям деятельности')
      }
    },
  },
})
</script>

<template>
  <v-select
    label="Направление деятельности"
    variant="outlined"
    :items="areasOfActivity"
    v-model="candidate.areaOfActivity"
    :rules="[(t: string) => !!t || 'Обязательное поле']"
    :readonly="readonly"
  />
</template>

<style scoped></style>
