<script lang="ts">
import { defineComponent } from 'vue'

interface Region {
  id: number,
  nameRus: string,
  nameKaz: string,
}

export default defineComponent({
  name: `Candidate`,

  data() {
    return {
      regions: new Array<Region>(),
      selectedRegion: Number(),
    };
  },

  async created(): Promise<void> {
    await this.getAllRegions();
  },

  methods: {
    async getAllRegions(): Promise<void> {
      try {
        const {data} = await this.axios.get('/reference/region/all');
        this.regions = data;
        this.regions.unshift({
          id: -1,
          nameRus: 'Все регионы',
          nameKaz: 'Барлық аумақтар',
        });
      } catch (e: unknown) {
        console.log(e)
      }
    },
  },

})
</script>

<template>
  <v-container>
    <v-navigation-drawer permanent>
      <v-list v-model:selected="selectedRegion" density="compact">
        <v-list-item
          v-for="region in regions"
          :key="region.id"
          :title="region.nameRus"
          :value="region.id"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main></v-main>
  </v-container>
</template>

<style scoped>

</style>
