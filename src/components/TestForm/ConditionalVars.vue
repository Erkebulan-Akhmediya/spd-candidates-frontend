<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import { ConditionalSectioningVarType } from '@/interfaces/test-evaluation.ts'

interface ConditionalVarTypesItem {
  id: number
  name: string
}

export default defineComponent({
  name: 'ConditionalVars',

  data() {
    return {
      reference: false,
      condVarIndex: -1,
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['test']),
    ConditionalSectioningVarType: () => ConditionalSectioningVarType,
    conditionalVarTypes(): ConditionalVarTypesItem[] {
      return new Array<ConditionalVarTypesItem>(
        { id: 0, name: 'число' },
        { id: 1, name: 'текст' },
        { id: 2, name: 'галочка' },
        { id: 3, name: 'справочник' },
      )
    },
  },

  methods: {
    addVar(): void {
      this.test.conditionalVars.push({
        name: 'Переменная',
        type: ConditionalSectioningVarType.number,
        reference: [],
      })
    },
    delVar(condVarIndex: number) {
      this.test.conditionalVars = this.test.conditionalVars.filter(
        (_, index: number): boolean => index !== condVarIndex,
      )
    },
    openReferenceDialog(condVarIndex: number): void {
      this.reference = true
      this.condVarIndex = condVarIndex
    },
    addRefItem(): void {
      this.test.conditionalVars[this.condVarIndex].reference.push('')
    },
    delRefItem(refItemIndex: number): void {
      this.test.conditionalVars[this.condVarIndex].reference = this.test.conditionalVars[
        this.condVarIndex
      ].reference.filter((_, index: number): boolean => index !== refItemIndex)
    },
  },
})
</script>

<template>
  <v-expansion-panels variant="popout">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <h2>Условные переменные</h2>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-col>
          <v-row v-for="(condVar, index) in test.conditionalVars" :key="index">
            <v-col cols="4">
              <v-text-field v-model="condVar.name" label="Название" variant="outlined" />
            </v-col>
            <v-col cols="4">
              <v-select
                v-model="condVar.type"
                label="Тип"
                variant="outlined"
                :items="conditionalVarTypes"
                item-value="id"
                item-title="name"
              />
            </v-col>
            <v-col cols="3">
              <v-btn
                v-if="condVar.type === ConditionalSectioningVarType.reference"
                @click="openReferenceDialog(index)"
                color="primary"
              >
                Справочник
              </v-btn>
            </v-col>
            <v-col cols="1">
              <v-btn
                icon="mdi-trash-can"
                color="error"
                variant="elevated"
                @click="delRefItem(index)"
              />
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-btn color="primary" @click="addVar">Добавить переменную</v-btn>
          </v-row>
        </v-col>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-dialog v-model="reference" max-width="700">
    <v-card title="Справочник">
      <v-card-text>
        <v-col cols="12">
          <v-row v-for="(_, index) in test.conditionalVars[condVarIndex].reference" :key="index">
            <v-col cols="12">
              <v-text-field
                v-model="test.conditionalVars[condVarIndex].reference[index]"
                variant="outlined"
              >
                <template v-slot:append-inner>
                  <v-btn
                    icon="mdi-trash-can"
                    color="error"
                    @click="delRefItem(index)"
                    variant="text"
                  />
                </template>
              </v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-btn icon="mdi-plus" color="primary" variant="elevated" @click="addRefItem" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
