<script lang="ts">
import { defineComponent } from 'vue'
import LocaleChanger from '@/components/LocaleChanger.vue'

export default defineComponent({
  name: `Login`,

  components: { LocaleChanger },

  data() {
    return {
      username: '',
      password: '',
    }
  },

  methods: {
    async login(): Promise<void> {
      try {
        const { data } = await this.axios.post('/auth/login', {
          username: this.username,
          password: this.password,
        })
        sessionStorage.setItem('token', data.token)
        await this.$router.push('/')
      } catch (e: unknown) {
        console.log(e)
      }
    },
  },
})
</script>

<template>
  <v-app-bar elevation="0">
    <template v-slot:append>
      <locale-changer />
    </template>
  </v-app-bar>
  <v-main class="d-flex flex-column justify-center align-center">
    <v-card width="500" height="300" elevation="5">
      <v-card-title>
        <p>{{ $t('login.title') }}</p>
      </v-card-title>

      <v-card-text>
        <v-col>
          <v-text-field :label="$t('login.username')" v-model="username"></v-text-field>
          <v-text-field :label="$t('login.password')" v-model="password"></v-text-field>
          <v-btn @click="login">{{ $t('login.button') }}</v-btn>
        </v-col>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<style scoped></style>
