<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: `Main template`,

  data() {
    return {
      toHideSideBar: false,
      selectedSideBarItem: ['/'],
      sideBarItems: [
        {
          name: 'Главная страница',
          path: '/',
          icon: 'mdi-home'
        },
        {
          name: 'Сотрудники',
          path: '/employee/all',
          icon: 'mdi-account-tie'
        },
        {
          name: 'Кандидаты',
          path: '/candidate/all',
          icon: 'mdi-account-school'
        }
      ]
    }
  },

  mounted() {
    this.selectedSideBarItem[0] = this.$route.path;
  },

})
</script>

<template>
  <v-app>
    <v-app-bar color="primary">
      <v-app-bar-nav-icon @click.stop="toHideSideBar = !toHideSideBar" />
    </v-app-bar>

    <v-navigation-drawer :rail="toHideSideBar" permanent>
      <v-list v-model:selected="selectedSideBarItem">
        <v-list-item
          v-for="item in sideBarItems"
          :key="item.name"
          :prepend-icon="item.icon"
          :title="item.name"
          :value="item.path"
          :to="item.path"
          :active="selectedSideBarItem[0] === item.path"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style scoped></style>
