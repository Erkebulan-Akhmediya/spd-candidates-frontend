<script lang="ts">
import { defineComponent } from 'vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import VariantComponent from '@/components/TestForm/Variant.vue'
import { type Question, QuestionType } from '@/interfaces/interfaces.ts'

export default defineComponent({
  name: `Variants`,
  components: { VariantComponent },

  data() {
    return {
      isConfirmDeleteDialogOpen: false,
      confirmDeleteDialogData: {
        index: 0
      }
    }
  },

  computed: {
    ...mapWritableState(useTestStore, ['test'])
  },

  methods: {

    addVariant() {
      this.test.variants.push({
        questions: new Array<Question>(
          {
            withFile: false,
            nameRus: '',
            nameKaz: '',
            type: QuestionType.mcqWithOneCorrect,
          },
        )
      })
    },

    deleteVariant() {
      this.test.variants = this.test.variants
        .filter(
          (_, index: number): boolean => index !== this.confirmDeleteDialogData.index
        )
      this.isConfirmDeleteDialogOpen = false
    },

    openConfirmDeleteDialog(index: number) {
      this.confirmDeleteDialogData.index = index
      this.isConfirmDeleteDialogOpen = true
    }

  }
})
</script>

<template>
  <v-expansion-panels variant="popout">
    <variant-component
      v-for="(_, index) in test.variants"
      :key="index"
      :index="index"
      @delete="openConfirmDeleteDialog"
    />
  </v-expansion-panels>

  <v-row justify="center" class="ma-5">
    <v-btn color="primary" @click="addVariant">
      добавить вариант
    </v-btn>
  </v-row>

  <v-dialog v-model="isConfirmDeleteDialogOpen" max-width="300">
    <v-card>
      <v-card-title>
        Удалить вариант {{ confirmDeleteDialogData.index + 1 }}?
      </v-card-title>
      <v-card-actions>
        <v-row justify="end" class="pa-2">
          <v-btn @click="isConfirmDeleteDialogOpen = false" class="mr-2" variant="tonal">
            Отмена
          </v-btn>
          <v-btn color="error" variant="elevated" @click="deleteVariant">Удалить</v-btn>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>
