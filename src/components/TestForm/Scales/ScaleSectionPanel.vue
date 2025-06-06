<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import type { ScaleSection } from '@/interfaces/test-evaluation.ts'
import SectionConditions from '@/components/TestForm/Scales/SectionConditions.vue'

export default defineComponent({
  name: 'ScaleSectionPanel',
  components: { SectionConditions },
  props: {
    scaleIndex: {
      type: Number,
      required: true,
    },
    sectionIndex: {
      type: Number,
      required: true,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['test']),
  },

  methods: {
    deleteSection() {
      this.test.scales[this.scaleIndex-1].sections = this.test.scales[this.scaleIndex-1].sections
        .filter((section: ScaleSection): boolean => section.index !== this.sectionIndex)
        .map((section: ScaleSection, index: number): ScaleSection => ({
          ...section,
          index: index + 1
        }))
    }
  }
})
</script>

<template>
  <v-expansion-panel>
    <v-expansion-panel-title>
      <h3>Секция {{sectionIndex}}</h3>
    </v-expansion-panel-title>
    <v-expansion-panel-text>
      <v-col cols="12">
        <v-row>
          <v-col cols="3">
            <v-text-field
              label="Нижний балл"
              type="number"
              variant="outlined"
              v-model="test.scales[scaleIndex-1].sections[sectionIndex-1].lowerBound"
            />
          </v-col>
          <v-col cols="3">
            <v-text-field
              label="Верхний балл"
              type="number"
              variant="outlined"
              v-model="test.scales[scaleIndex-1].sections[sectionIndex-1].upperBound"
            />
          </v-col>
          <v-col cols="3" v-if="test.scales[scaleIndex-1].sections.length > 1">
            <v-btn color="error" @click="deleteSection">Удалить секцию</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-textarea
              label="Описание (каз)"
              variant="outlined"
              rows="7"
              v-model="test.scales[scaleIndex-1].sections[sectionIndex-1].descriptionKaz"
            />
          </v-col>
          <v-col cols="6">
            <v-textarea
              label="Описание (рус)"
              variant="outlined"
              rows="7"
              v-model="test.scales[scaleIndex-1].sections[sectionIndex-1].descriptionRus"
            />
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="12">
            <section-conditions :scale-index="scaleIndex" :section-index="sectionIndex" />
          </v-col>
        </v-row>
      </v-col>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>

<style scoped></style>
