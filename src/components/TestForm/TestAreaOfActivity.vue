<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'

export default defineComponent({
  name: 'TestAreaOfActivity',

  data() {
    return {
      areasOfActivity: new Array<string>(),
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['test']),
  },

  async created() {
    await this.fetchAreasOfActivity()
  },

  methods: {
    async fetchAreasOfActivity() {
      try {
        const { data } = await this.axios.get('/area_of_activity/all')
        this.areasOfActivity = data
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
    label="Направления деяельности"
    :items="areasOfActivity"
    variant="outlined"
    v-model="test.areasOfActivities"
    multiple
    clearable
    chips
    closable-chips
  />
</template>

<style scoped></style>
