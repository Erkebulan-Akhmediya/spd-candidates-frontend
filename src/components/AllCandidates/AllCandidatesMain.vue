<script lang="ts">
import { defineComponent } from 'vue'
import AllCandidatesTab from '@/components/AllCandidates/AllCandidatesTab.vue'

export default defineComponent({
  name: 'AllCandidatesMain',

  components: { AllCandidatesTab },

  props: {
    regionId: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      tab: '1',
    }
  },
})
</script>

<template>
  <v-col class="pa-0 ma-0">
    <v-tabs v-model="tab">
      <v-tab value="new">{{ $t('allCandidates.tabs.new') }}</v-tab>
      <v-tab value="onRevision">{{ $t('allCandidates.tabs.onRevision') }}</v-tab>
      <v-tab value="onApproval">{{ $t('allCandidates.tabs.onApproval') }}</v-tab>
      <v-tab value="approved">{{ $t('allCandidates.tabs.approved') }}</v-tab>
      <v-tab value="rejected">{{ $t('allCandidates.tabs.rejected') }}</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="new">
        <all-candidates-tab :tab-type="tab" :regionId="regionId" />
      </v-tabs-window-item>

      <v-tabs-window-item value="onRevision">
        <all-candidates-tab :tab-type="tab" :regionId="regionId" />
      </v-tabs-window-item>

      <v-tabs-window-item value="onApproval">
        <all-candidates-tab :tab-type="tab" :regionId="regionId" />
      </v-tabs-window-item>

      <v-tabs-window-item value="approved">
        <all-candidates-tab :tab-type="tab" :regionId="regionId" />
      </v-tabs-window-item>

      <v-tabs-window-item value="rejected">
        <all-candidates-tab :tab-type="tab" :regionId="regionId" />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-col>
</template>

<style scoped></style>
