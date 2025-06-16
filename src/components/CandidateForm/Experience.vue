<script lang="ts">
import { defineComponent } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'
import type { Experience } from '@/interfaces/candidate.ts'

export default defineComponent({
  name: `Experience`,

  components: {
    VDateInput,
  },

  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      headers: [
        { key: 'startDate', title: 'Дата начала', width: '20%' },
        { key: 'endDate', title: 'Дата окончания', width: '30%' },
        { key: 'position', title: 'Должность', width: '23%' },
        { key: 'companyName', title: 'Компания', width: '22%' },
        { key: 'deleteButton', title: '', width: '5%' },
      ],
    }
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate']),
  },

  methods: {
    addExperience() {
      this.candidate.experiences.push({
        index: this.getNextExperienceIndex(),
        startDate: new Date(),
        untilNow: false,
        endDate: new Date(),
        position: '',
        companyName: '',
      })
    },

    deleteExperience(experienceToDelete: Experience) {
      this.candidate.experiences = this.candidate.experiences.filter(
        (experience: Experience): boolean => experience.index !== experienceToDelete.index,
      )
    },

    getNextExperienceIndex(): number {
      if (this.candidate.experiences.length === 0) return 0
      return this.candidate.experiences[this.candidate.experiences.length - 1].index + 1
    },
  },
})
</script>

<template>
  <v-card elevation="2">
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="candidate.experiences"
        hide-default-footer
        disable-sort
      >
        <template v-slot:top>
          <v-row justify="space-between" align="center" class="pa-3">
            <h2>Опыт работы</h2>
            <v-btn
              v-if="!readonly"
              icon
              @click="addExperience"
              color="primary"
              :disabled="disabled"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-row>
        </template>

        <template v-slot:[`item.startDate`]="{ item }">
          <v-date-input
            class="mt-5"
            prepend-icon=""
            prepend-inner-icon="$calendar"
            v-model="item.startDate"
            variant="outlined"
            :disabled="disabled"
            :readonly="readonly"
          />
        </template>

        <template v-slot:[`item.endDate`]="{ item }">
          <v-row class="pa-0 ma-0">
            <v-col cols="9" class="pa-0 ma-0">
              <v-card
                v-if="item.untilNow"
                variant="outlined"
                class="mt-3"
                text="По настоящее время"
              />
              <v-date-input
                v-else
                class="mt-5"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                v-model="item.endDate"
                variant="outlined"
                :disabled="disabled"
                :readonly="readonly"
              />
            </v-col>
            <v-col cols="3" class="pa-0 ma-0">
              <v-checkbox
                label="По н.в."
                v-model="item.untilNow"
                :readonly="readonly"
                :disabled="disabled"
              >
                <v-tooltip activator="parent" location="bottom">По настоящее время</v-tooltip>
              </v-checkbox>
            </v-col>
          </v-row>
        </template>

        <template v-slot:[`item.position`]="{ item }">
          <v-text-field
            class="mt-5"
            v-model="item.position"
            variant="outlined"
            :disabled="disabled"
            :readonly="readonly"
          />
        </template>

        <template v-slot:[`item.companyName`]="{ item }">
          <v-text-field
            class="mt-5"
            v-model="item.companyName"
            variant="outlined"
            :disabled="disabled"
            :readonly="readonly"
          />
        </template>

        <template v-slot:[`item.deleteButton`]="{ item }">
          <v-btn
            v-if="!readonly"
            icon
            @click="deleteExperience(item)"
            color="error"
            :disabled="disabled"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style scoped></style>
