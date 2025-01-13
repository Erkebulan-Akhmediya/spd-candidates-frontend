<script lang="ts">
import { defineComponent } from 'vue'

interface SideBarItem {
  name: string,
  icon: string,
  path: string,
}

export default defineComponent({
  name: `Main template`,

  data() {
    return {
      toHideSideBar: false,
      selectedSideBarItem: new Array<string>('sideBarItems.main'),
      sideBarItems: new Array<SideBarItem>(
        {
          name: 'sideBarItems.main',
          path: '/',
          icon: 'mdi-home',
        },
        {
          name: 'sideBarItems.employees',
          path: '/employee/all',
          icon: 'mdi-account-tie',
        },
        {
          name: 'sideBarItems.candidates',
          path: '/candidate/all',
          icon: 'mdi-account-school',
        },
      ),
    }
  },

  watch: {
    selectedSideBarItem(newVal: string[], oldVal: string[]) {
      if (!newVal[0]) this.selectedSideBarItem = oldVal;
    },
  },
})
</script>

<template>
  <v-app-bar color="primary">
    <v-app-bar-nav-icon @click.stop="toHideSideBar = !toHideSideBar" />

    <v-app-bar-title>{{ $t(selectedSideBarItem[0]) }}</v-app-bar-title>

    <v-spacer />

    <template v-slot:append>
      <v-select class="mt-5" v-model="$i18n.locale" :items="$i18n.availableLocales" dense />
    </template>
  </v-app-bar>

  <v-navigation-drawer :rail="toHideSideBar" permanent>
    <v-list v-model:selected="selectedSideBarItem">
      <v-list-item
        v-for="item in sideBarItems"
        :key="item.name"
        :prepend-icon="item.icon"
        :title="$t(item.name)"
        :value="item.name"
        :to="item.path"
        :active="selectedSideBarItem[0] === item.name"
      />
    </v-list>
  </v-navigation-drawer>

  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<style scoped></style>
