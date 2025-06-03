<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import {
  type ConditionalSectioningVar,
  ConditionalSectioningVarType,
} from '@/interfaces/test-evaluation.ts'

interface Operator {
  code: string
  name: string
}

export default defineComponent({
  name: 'SectionConditions',

  props: {
    scaleIndex: {
      type: Number,
      required: true,
    },
    sectionIndex: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      dialog: false,
      operators: new Array<Operator>(
        { code: 'equals', name: 'равно' },
        { code: 'not equals', name: 'не равно' },
        { code: 'greater', name: 'больше' },
        { code: 'greater or equal', name: 'больше или равно' },
        { code: 'less', name: 'меньше' },
        { code: 'less or equal', name: 'меньше или равно' },
        { code: 'in', name: 'в' },
        { code: 'not in', name: 'не в' },
      ),
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['test']),
    ConditionalSectioningVarType: () => ConditionalSectioningVarType,
  },

  methods: {
    addCondition(): void {
      this.test.scales[this.scaleIndex - 1].sections[this.sectionIndex - 1].conditions.push({
        varName: '',
        operator: '',
        value: [],
      })
    },
    allowedOperators(varName: string): Operator[] {
      try {
        const varType: number = this.getCondVarType(varName)
        if (varType === ConditionalSectioningVarType.number) {
          return this.operators.filter((operator: Operator): boolean =>
            [
              'equals',
              'not equals',
              'greater',
              'greater or equal',
              'less',
              'less or equal',
            ].includes(operator.code),
          )
        }
        if (
          varType === ConditionalSectioningVarType.string ||
          varType === ConditionalSectioningVarType.boolean
        ) {
          return this.operators.filter((operator: Operator): boolean =>
            ['equals', 'not equals'].includes(operator.code),
          )
        }
        if (varType === ConditionalSectioningVarType.reference) {
          return this.operators.filter((operator: Operator): boolean =>
            ['in', 'not in'].includes(operator.code),
          )
        }
        return []
      } catch {
        return []
      }
    },
    getCondVarType(varName: string): number {
      const condVar: ConditionalSectioningVar | undefined = this.getCondVar(varName)
      if (condVar === undefined) return -1
      return condVar.type
    },
    getCondVarReference(varName: string): string[] {
      return this.getCondVar(varName)?.reference ?? []
    },
    getCondVar(varName: string): ConditionalSectioningVar | undefined {
      return this.test.conditionalVars.find(
        (condVar: ConditionalSectioningVar): boolean => condVar.name === varName,
      )
    },
  },
})
</script>

<template>
  <v-row justify="center">
    <v-btn color="primary" @click="dialog = true">Условия</v-btn>
  </v-row>
  <v-dialog v-model="dialog" max-width="700">
    <v-card title="Условия">
      <v-card-text>
        <v-col cols="12">
          <v-row
            v-for="(condition, index) in test.scales[scaleIndex - 1].sections[sectionIndex - 1]
              .conditions"
            :key="index"
          >
            <v-col cols="4">
              <v-select
                v-model="condition.varName"
                variant="outlined"
                label="Переменная"
                :items="test.conditionalVars"
                item-title="name"
                item-value="name"
              />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="condition.operator"
                variant="outlined"
                label="Оператор"
                :items="allowedOperators(condition.varName)"
                item-title="name"
                item-value="code"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-if="getCondVarType(condition.varName) !== ConditionalSectioningVarType.reference"
                v-model="condition.value[0]"
                variant="outlined"
                label="Значение"
              />
              <v-select
                v-else
                v-model="condition.value"
                variant="outlined"
                :items="getCondVarReference(condition.varName)"
                multiple
                clearable
              />
            </v-col>
          </v-row>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-btn icon="mdi-plus" color="primary" variant="elevated" @click="addCondition" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
