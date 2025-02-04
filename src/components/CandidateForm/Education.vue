<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useCandidateStore } from '@/stores/candidate.ts'
import type { Education, EducationType } from '@/interfaces/candidate.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import { VDateInput } from 'vuetify/labs/VDateInput'

export default defineComponent({
  name: `Education`,

  components: {
    VDateInput
  },

  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      educationTypes: new Array<EducationType>(),
      headers: [
        { key: 'startDate', title: 'Дата начала' },
        { key: 'endDate', title: 'Дата окончания' },
        { key: 'type', title: 'Тип' },
        { key: 'organization', title: 'Заведение' },
        { key: 'major', title: 'Специальность' },
        { key: 'deleteButton', title: '' }
      ]
    }
  },

  async created() {
    await this.fetchEducationTypes()
  },

  computed: {
    ...mapWritableState(useCandidateStore, ['candidate']),

    nextEducationIndex(): number {
      if (this.candidate.education.length === 0) return 0
      return this.lastEducationIndex + 1
    },

    lastEducationIndex(): number {
      return this.lastEducation.index
    },

    lastEducation(): Education {
      return this.candidate.education[this.candidate.education.length - 1]
    }
  },

  methods: {
    getTranslatedName,
    addEducation(): void {
      this.candidate.education.push({
        index: this.nextEducationIndex,
        startDate: new Date(),
        endDate: new Date(),
        type: 1,
        organization: '',
        major: ''
      })
    },

    deleteEducation(educationToDelete: Education): void {
      this.candidate.education = this.candidate.education.filter(
        (education: Education): boolean => education.index !== educationToDelete.index
      )
    },

    async fetchEducationTypes() {
      try {
        this.educationTypes = await this.$http.get<EducationType[]>('/education/type/all')
      } catch (e: unknown) {
        console.log(e)
        this.$emit('error', 'Не удалось вывести справочные данные по типам образования')
      }
    }
  }
})
</script>

<template>
  <v-card elevation="2">
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="candidate.education"
        hide-default-footer
        disable-sort
      >
        <template v-slot:top>
          <v-row justify="space-between" align="center" class="pa-3">
            <h2>Образование</h2>
            <v-btn v-if="!readonly" icon @click="addEducation" color="primary" :disabled="disabled">
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

        <template v-slot:[`item.type`]="{ item }">
          <v-select
            class="mt-5"
            :items="educationTypes"
            item-value="id"
            :item-title="getTranslatedName"
            v-model="item.type"
            variant="outlined"
          />
        </template>

        <template v-slot:[`item.organization`]="{ item }">
          <v-text-field
            class="mt-5"
            v-model="item.organization"
            variant="outlined"
            :disabled="disabled"
            :readonly="readonly"
          />
        </template>

        <template v-slot:[`item.major`]="{ item }">
          <v-text-field
            class="mt-5"
            v-model="item.major"
            variant="outlined"
            :disabled="disabled"
            :readonly="readonly"
          />
        </template>

        <template v-slot:[`item.deleteButton`]="{ item }">
          <v-btn
            v-if="!readonly"
            icon
            @click="deleteEducation(item)"
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
