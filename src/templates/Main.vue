<script lang="ts">
import LocaleChanger from '@/components/LocaleChanger.vue'
import RegionService from '@/services/RegionService.ts'
import { useRegionStore } from '@/stores/region.ts'
import { mapWritableState } from 'pinia'
import { defineComponent } from 'vue'
import hasRole from '@/utils/HasRole.ts'

interface SideBarItem {
  name: string
  icon: string
  path: string
}

export default defineComponent({
  name: 'MainTemplate',
  components: { LocaleChanger },

  data() {
    return {
      toHideSideBar: false,
      selectedSideBarItem: new Array<string>('sideBarItems.candidates'),
      sideBarItems: new Array<SideBarItem>(
        {
          name: 'sideBarItems.candidates',
          path: '/candidate/all',
          icon: 'mdi-account-school',
        },
        {
          name: 'sideBarItems.testsConstructor',
          path: '/test/constructor/all',
          icon: 'mdi-book-plus',
        },
        {
          name: 'sideBarItems.tests',
          path: '/test/all',
          icon: 'mdi-book-edit-outline',
        },
        {
          name: 'sideBarItems.testAssessment',
          path: '/test/assessment/all',
          icon: 'mdi-book-check',
        },
        {
          name: 'sideBarItems.testResults',
          path: '/test/result/all',
          icon: 'mdi-book-open-variant-outline',
        },
        {
          name: 'sideBarItems.essayTopics',
          path: '/test/constructor/essay',
          icon: 'mdi-pen-plus',
        },
      ),
    }
  },

  watch: {
    selectedSideBarItem(newVal: string[], oldVal: string[]) {
      if (!newVal[0]) this.selectedSideBarItem = oldVal
    },
  },

  computed: {
    ...mapWritableState(useRegionStore, ['regions']),
    regionService(): RegionService {
      return RegionService.getInstance(this.$http)
    },
  },

  async created() {
    await this.fetchAllRegions()
  },

  mounted() {
    this.filterSideBarItems()
    this.setSelectedSideBarItem()
  },

  methods: {
    filterSideBarItems(): void {
      switch (true) {
        case hasRole('candidate'):
          this.sideBarItems = this.sideBarItems.filter(
            (item: SideBarItem): boolean => item.path === '/test/all',
          )
          break
        case hasRole('admin'):
          this.sideBarItems = this.sideBarItems.filter(
            (item: SideBarItem): boolean => item.path !== '/test/all',
          )
          break
        case hasRole('security'):
          this.sideBarItems = this.sideBarItems.filter(
            (item: SideBarItem): boolean => item.path === '/candidate/all',
          )
          break
        case hasRole('hr'):
          this.sideBarItems = this.sideBarItems.filter(
            (item: SideBarItem): boolean => item.path === '/candidate/all',
          )
          break
        case hasRole('psycho'):
          this.sideBarItems = this.sideBarItems.filter(
            (item: SideBarItem): boolean =>
              item.path !== '/candidate/all' &&
              item.path !== '/test/constructor/essay' &&
              item.path !== '/test/constructor/all' &&
              item.path !== '/test/all',
          )
          break
        default:
          this.sideBarItems = []
      }
    },

    setSelectedSideBarItem(): void {
      const selectedSideBarItem: SideBarItem | undefined = this.sideBarItems.find(
        (item: SideBarItem): boolean => item.path === this.$route.path,
      )

      if (selectedSideBarItem === undefined) {
        this.selectedSideBarItem[0] = 'sideBarItems.candidates'
      } else {
        this.selectedSideBarItem[0] = selectedSideBarItem.name
      }
    },

    async fetchAllRegions(): Promise<void> {
      try {
        this.regions = await this.regionService.fetch()
      } catch (e: unknown) {
        console.log(e)
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
    <router-view />
  </v-main>
</template>

<style scoped></style>
