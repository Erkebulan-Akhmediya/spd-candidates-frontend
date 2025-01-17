<script lang="ts">
import { defineComponent } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'

export interface Experience {
  index: number
  startDate: Date
  endDate: Date
  position: string
  companyName: string
}

export default defineComponent({
  name: `Experience`,

  components: {
    VDateInput,
  },

  props: {
    disabled: Boolean,
    readonly: Boolean,
  },

  data() {
    return {
      headers: [
        {
          key: 'startDate',
          title: 'Дата начала',
        },
        {
          key: 'endDate',
          title: 'Дата начала',
        },
        {
          key: 'position',
          title: 'Должность',
        },
        {
          key: 'companyName',
          title: 'Компания',
        },
        {
          key: 'deleteButton',
          title: '',
        },
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
            v-model="item.startDate"
            variant="outlined"
            :disabled="disabled"
            :readonly="readonly"
          />
        </template>

        <template v-slot:[`item.endDate`]="{ item }">
          <v-date-input
            class="mt-5"
            v-model="item.endDate"
            variant="outlined"
            :disabled="disabled"
            :readonly="readonly"
          />
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
