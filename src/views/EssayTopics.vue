<script lang="ts">
import { defineComponent } from 'vue'
import { useIrohaStore } from '@/stores/iroha.ts'
import { mapWritableState } from 'pinia'
import { useTestStore } from '@/stores/test.ts'
import TestConverterService from '@/services/TestConverterService.ts'
import { type SendableTest, TestType } from '@/interfaces/test.ts'
import TestCreatorService from '@/services/TestCreatorService.ts'
import type { Translatable } from '@/interfaces/global.ts'

interface EssayTopic extends Translatable {
  variantId: number
}

export default defineComponent({
  name: 'EssayTopics',

  data() {
    return {
      topics: new Array<EssayTopic>(),
      topicDialog: false,
      loading: false,
      error: false,
      topicDialogData: {
        variantId: null as number | null,
        nameKaz: '',
        nameRus: '',
      },
    }
  },

  computed: {
    ...mapWritableState(useIrohaStore, ['irohasMode']),
    ...mapWritableState(useTestStore, ['test']),
    testConverter(): TestConverterService {
      return TestConverterService.getInstance(this.$file)
    },
    testCreator(): TestCreatorService {
      return TestCreatorService.getInstance()
    },
  },

  async created() {
    await this.fetchEssayTopics()
  },

  methods: {
    async createEssayTest(): Promise<void> {
      try {
        this.test.nameRus = 'Эссе'
        this.test.nameKaz = 'Эссе'
        this.test.descriptionRus = 'Напишите эссе'
        this.test.descriptionKaz = 'Эссе жазыңыз'
        this.test.isLimitless = true
        this.test.areasOfActivities = ['01', '02', '03']
        this.test.type = TestType.withOpenQuestions.valueOf()
        this.test.scales = [this.testCreator.newScale(1)]
        this.test.variants = []
        const test: SendableTest = await this.testConverter.convertTestToSend(this.test)
        await this.$http.post('/test', test)
      } catch (e: unknown) {
        console.log(e)
      }
    },

    async fetchEssayTopics(): Promise<void> {
      try {
        this.loading = true
        this.topics = await this.$http.get<EssayTopic[]>('/test/essay/topic/all')
        this.error = false
      } catch (e: unknown) {
        console.log(e)
        this.error = true
      } finally {
        this.loading = false
      }
    },

    async saveEssayTopics(): Promise<void> {
      try {
        if (this.topicDialogData.variantId) {
          await this.$http.put(
            `/test/essay/topic/${this.topicDialogData.variantId}`,
            this.topicDialogData,
          )
        } else {
          await this.$http.post('/test/essay/topic', this.topicDialogData)
        }
        this.topicDialog = false
        this.topicDialogData.nameKaz = ''
        this.topicDialogData.nameRus = ''
        this.topicDialogData.variantId = null
        await this.fetchEssayTopics()
        this.error = false
      } catch (e) {
        this.error = true
        console.log(e)
      }
    },

    async deleteEssayTopic(variantId: number): Promise<void> {
      try {
        await this.$http.delete(`/test/essay/topic/${variantId}`)
        this.topics = this.topics.filter(
          (topic: EssayTopic): boolean => topic.variantId !== variantId,
        )
        this.error = false
      } catch (e) {
        this.error = true
        console.log(e)
      }
    },

    openUpdateDialog(topic: EssayTopic) {
      this.topicDialogData.variantId = topic.variantId
      this.topicDialogData.nameRus = topic.nameRus
      this.topicDialogData.nameKaz = topic.nameKaz
      this.topicDialog = true
    },
  },
})
</script>

<template>
  <v-col cols="12">
    <v-row align="center">
      <v-btn
        v-if="irohasMode"
        @click="createEssayTest"
        color="success"
        class="ma-3"
        text="Создать эссе тест"
      />
      <v-btn icon="mdi-plus" @click="topicDialog = true" color="primary" class="ma-3" />
    </v-row>
    <v-progress-linear v-if="loading" indeterminate />
    <p v-if="error">Ошибка :/</p>
    <v-row v-for="(topic, index) in topics" :key="index">
      <v-col cols="5">
        <v-text-field v-model="topic.nameKaz" label="Тема (каз)" variant="outlined" readonly />
      </v-col>
      <v-col cols="5">
        <v-text-field v-model="topic.nameRus" label="Тема (рус)" variant="outlined" readonly />
      </v-col>
      <v-col cols="1">
        <v-btn text="Изменить" color="primary" @click="openUpdateDialog(topic)" />
      </v-col>
      <v-col cols="1">
        <v-btn text="Удалить" color="error" @click="deleteEssayTopic(topic.variantId)" />
      </v-col>
    </v-row>
  </v-col>
  <v-dialog v-model="topicDialog" max-width="700px">
    <v-card title="Тема эссе">
      <v-card-text>
        <v-text-field v-model="topicDialogData.nameKaz" label="Тема (каз)" variant="outlined" />
        <v-text-field v-model="topicDialogData.nameRus" label="Тема (рус)" variant="outlined" />
      </v-card-text>
      <v-card-actions>
        <v-btn variant="tonal" @click="topicDialog = false">Отмена</v-btn>
        <v-btn variant="elevated" @click="saveEssayTopics" color="primary">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
