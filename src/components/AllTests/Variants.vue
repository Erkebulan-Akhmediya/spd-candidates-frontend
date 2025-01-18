<script lang="ts">
import { defineComponent } from 'vue'

interface Variant {
  title: string
}


export default defineComponent({
  name: 'Variants',

  data() {
    return {
      isConfirmDeleteDialogOpen: false,
      confirmDeleteDialogData: {
        title: '',
      },
      variants: new Array<Variant>(
        {
          title: 'Вариант 1'
        }
      )
    };
  },

  methods: {

    addVariant() {
      this.variants.push({
        title: `Вариант ${this.variants.length + 1}`
      })
    },

    deleteVariant() {
      this.variants = this.variants
        .filter(
          (variant: Variant): boolean => variant.title !== this.confirmDeleteDialogData.title
        )
        .map(
          (variant: Variant, index: number): Variant => ({
            ...variant,
            title: `Вариант ${index + 1}`
          })
        )
      this.isConfirmDeleteDialogOpen = false
    },

    openConfirmDeleteDialog(title: string) {
      this.confirmDeleteDialogData.title = title
      this.isConfirmDeleteDialogOpen = true
    },

  },
})
</script>

<template>
  <v-expansion-panels variant="popout">
    <v-expansion-panel v-for="variant in variants">
      <v-expansion-panel-title>
        {{ variant.title }}
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-row justify="center" class="ma-3" v-if="variants.length > 1">
          <v-btn icon="mdi-minus" @click="openConfirmDeleteDialog(variant.title)" />
        </v-row>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>

  <v-row justify="center" class="ma-5">
    <v-btn icon="mdi-plus" color="primary" @click="addVariant" />
  </v-row>

  <v-dialog v-model="isConfirmDeleteDialogOpen" max-width="300">
    <v-card>
      <v-card-title>
        Удалить {{ confirmDeleteDialogData.title }}?
      </v-card-title>
      <v-card-actions>
        <v-row justify="end" class="pa-2">
          <v-btn @click="isConfirmDeleteDialogOpen = false" class="mr-2" variant="tonal">Отмена</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteVariant">Удалить</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
