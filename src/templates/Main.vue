<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: `Main template`,
  data() {
    return {
      sideBarItems: [
        {
          name: 'Главная страница',
          path: '/',
        },
        {
          name: 'Пользователи',
          path: '/user',
        },
      ],
    }
  },
})
</script>

<template>
  <v-row height="100vh">
    <v-list>
      <v-list-item>
        <router-link v-for="item in sideBarItems" :key="item.name" :to="item.path">
          <v-list-item-title>
            <p>{{ item.name }}</p>
          </v-list-item-title>
        </router-link>
      </v-list-item>
    </v-list>

    <div style="padding: 20px">
      <router-view />
    </div>
  </v-row>
</template>

<style scoped></style>
