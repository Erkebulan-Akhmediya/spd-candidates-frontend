<script lang="ts">
import { defineComponent } from 'vue'
import LocaleChanger from '@/components/LocaleChanger.vue'

interface SideBarItem {
  name: string
  icon: string
  path: string
}

export default defineComponent({
  name: `Main template`,
  components: { LocaleChanger },

  data() {
    return {
      toHideSideBar: false,
      selectedSideBarItem: new Array<string>('sideBarItems.main'),
      sideBarItems: new Array<SideBarItem>(
        {
          name: 'sideBarItems.candidates',
          path: '/candidate/all',
          icon: 'mdi-account-school',
        },
        {
          name: 'sideBarItems.employees',
          path: '/employee/all',
          icon: 'mdi-account-tie',
        },
      ),
    }
  },

  watch: {
    selectedSideBarItem(newVal: string[], oldVal: string[]) {
      if (!newVal[0]) this.selectedSideBarItem = oldVal
    },
  },

  mounted() {
    this.setSelectedSideBarItem()
  },

  methods: {
    setSelectedSideBarItem(): void {
      const selectedSideBarItem: SideBarItem | undefined = this.sideBarItems.find(
        (item: SideBarItem): boolean => item.path === this.$route.path,
      )

      if (selectedSideBarItem === undefined) {
        this.selectedSideBarItem[0] = 'sideBarItems.main'
      } else {
        this.selectedSideBarItem[0] = selectedSideBarItem.name
      }
    },

    async exit(): Promise<void> {
      await this.$router.push('/login')
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
      <locale-changer />
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
    <template v-slot:append>
      <v-btn block color="primary" variant="tonal" size="large" @click="exit">
        {{ $t('sideBarItems.exit') }}
      </v-btn>
    </template>
  </v-navigation-drawer>

  <v-main>
    <router-view></router-view>
  </v-main>
</template>

<style scoped></style>
