<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LocaleChanger',

  data() {
    return {
      currentLocale: this.$i18n.locale,
      availableLocales: this.$i18n.availableLocales,
    };
  },

  methods: {

    onLocaleChange(newLocale: string) {
      this.$i18n.locale = newLocale;
      sessionStorage.setItem('locale', this.$i18n.locale);
    }

  },

})
</script>

<template>
  <v-select
    class="mt-5"
    @update:model-value="onLocaleChange"
    v-model="currentLocale"
    :items="availableLocales"
    dense
  />
</template>

<style scoped>

</style>
