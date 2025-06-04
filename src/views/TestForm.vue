<script lang="ts">
import { defineComponent } from 'vue'
import VariantConstructorList from '@/components/TestForm/VariantConstructorList.vue'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import TestAreaOfActivity from '@/components/TestForm/TestAreaOfActivity.vue'
import { type SendableTest, TestType, type TestTypeApi } from '@/interfaces/test.ts'
import TestConverterService from '@/services/TestConverterService.ts'
import TestValidatorService from '@/services/TestValidatorService.ts'
import { getTranslatedName } from '@/utils/Translate.ts'
import OptionsPerQuestion from '@/components/TestForm/OptionsPerQuestion.vue'
import Scales from '@/components/TestForm/Scales.vue'
import ConditionalVars from '@/components/TestForm/ConditionalVars.vue'

export default defineComponent({
  name: 'TestForm',
  components: {
    ConditionalVars,
    Scales,
    OptionsPerQuestion,
    TestAreaOfActivity,
    VariantConstructorList,
  },

  computed: {
    ...mapWritableState(useTestStore, ['test', 'testTypes']),

    TestType: () => TestType,

    testConverter(): TestConverterService {
      return TestConverterService.getInstance(this.$file)
    },

    testValidator: () => TestValidatorService.getInstance(),

    edit(): boolean {
      const pathParts: string[] = this.$route.path.split('/')
      return pathParts.length === 4 && pathParts[1] == 'test' && pathParts[3] == 'edit'
    },

    testId(): number {
      const pathParts: string[] = this.$route.path.split('/')
      return parseInt(pathParts[2])
    },

    automaticallyEvaluated(): boolean {
      const autoEvaluatedTestTypes: TestTypeApi[] = this.testTypes.filter(
        (type: TestTypeApi): boolean => type.automaticallyEvaluated,
      )

      const autoEvaluatedTestTypeIds: number[] = autoEvaluatedTestTypes.map(
        (type: TestTypeApi): number => type.id,
      )

      return autoEvaluatedTestTypeIds.includes(this.test.type)
    },
  },

  data() {
    return {
      emptyFields: new Array<string>(),
      errors: new Array<string>(),
      isConfirmSaveDialogOpen: false,
      errMsg: String(),
      toShowErr: false,
    }
  },

  async created() {
    await this.fetchTestTypes()
  },

  async mounted() {
    if (this.edit) {
      await this.fetchTest()
    }
  },

  methods: {
    getTranslatedName,
    async goBack(): Promise<void> {
      await this.$router.push('/test/constructor/all')
    },

    async fetchTestTypes(): Promise<void> {
      try {
        this.testTypes = await this.$http.get<TestTypeApi[]>('/test/type/all')
      } catch (e) {
        console.log(e)
      }
    },

    async saveTest(): Promise<void> {
      try {
        this.testValidator.validate(this.test)

        const test: SendableTest = await this.testConverter.convertTestToSend(this.test)

        if (this.edit) {
          await this.$http.put(`/test/${this.testId}`, test)
        } else {
          await this.$http.post('/test', test)
        }

        await this.$router.push('/test/constructor/all')
      } catch (e) {
        this.isConfirmSaveDialogOpen = false
        console.log(e)
        await this.showErr(`${e}`)
      }
    },

    async fetchTest(): Promise<void> {
      try {
        const test: SendableTest = await this.$http.get<SendableTest>(`/test/${this.testId}`)
        this.test = await this.testConverter.convertTestToEdit(test)
      } catch (e) {
        console.log(e)
        await this.showErr(`${e}`)
      }
    },

    async showErr(msg: string): Promise<void> {
      this.errMsg = msg
      this.toShowErr = true
    },
  },
})
</script>

<template>
  <v-alert
    title="Ошибка"
    :text="errMsg"
    type="error"
    closable
    class="ma-2"
    v-model="toShowErr"
    width="600"
  />
  <v-card>
    <v-card-title>
      <v-row class="pa-5">
        <v-btn @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
          <p>Назад</p>
        </v-btn>
        <p class="ml-5">Новый тест</p>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field label="Название теста (каз)" variant="outlined" v-model="test.nameKaz" />
        </v-col>
        <v-col cols="6">
          <v-text-field label="Название теста (рус)" variant="outlined" v-model="test.nameRus" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-textarea label="Описание (каз)" variant="outlined" v-model="test.descriptionKaz" />
        </v-col>
        <v-col cols="6">
          <v-textarea label="Описание (рус)" variant="outlined" v-model="test.descriptionRus" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-text-field
            label="Длительность"
            variant="outlined"
            type="number"
            suffix="мин"
            v-model="test.duration"
            :disabled="test.isLimitless"
          />
        </v-col>
        <v-col cols="2">
          <v-checkbox label="Без ограничений" v-model="test.isLimitless" />
        </v-col>
        <v-col cols="3">
          <test-area-of-activity @error="showErr" />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="4">
          <v-select
            label="Тип вопросов в тесте"
            :items="testTypes"
            :item-title="getTranslatedName"
            item-value="id"
            v-model="test.type"
            variant="outlined"
          />
        </v-col>
        <v-col cols="3">
          <options-per-question />
        </v-col>
        <v-col cols="3" v-if="test.type === TestType.pointDistribution.valueOf()">
          <v-text-field
            label="Макс кл-во баллов"
            variant="outlined"
            type="number"
            v-model="test.maxPointsPerQuestion"
          />
        </v-col>
        <v-col cols="3" v-else-if="test.type === TestType.withMcqHavingNoCorrect">
          <v-checkbox label="Усолвные секции" v-model="test.conditionallySectioned" />
        </v-col>
      </v-row>

      <v-row v-if="test.conditionallySectioned">
        <v-col cols="12">
          <conditional-vars />
        </v-col>
      </v-row>

      <v-row v-if="automaticallyEvaluated">
        <v-col cols="12">
          <scales />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <variant-constructor-list />
        </v-col>
      </v-row>

      <v-dialog v-model="isConfirmSaveDialogOpen" max-width="400">
        <v-card>
          <v-card-title>Сохранить тест?</v-card-title>
          <v-card-actions>
            <v-row justify="end" class="pa-3">
              <v-btn color="error" variant="tonal" @click="isConfirmSaveDialogOpen = false">
                Отмена
              </v-btn>
              <v-btn color="primary" variant="elevated" @click="saveTest" class="ml-3">
                Сохранить
              </v-btn>
            </v-row>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>

    <v-card-actions>
      <v-row class="pa-2">
        <v-btn variant="tonal" class="mr-2">Отмена</v-btn>
        <v-btn variant="elevated" color="primary" @click="isConfirmSaveDialogOpen = true">
          Сохранить
        </v-btn>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
