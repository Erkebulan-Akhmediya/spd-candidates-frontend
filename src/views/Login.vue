<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: `Login`,
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
        });
        sessionStorage.setItem('token', data.token);
        await this.$router.push('/');
      } catch (e: unknown) {
        console.log(e);
      }
    },
  },
})
</script>

<template>
  <div class="d-flex flex-column justify-center align-center" style="height: 100vh">
    <v-card width="500" height="300" elevation="5">
      <v-card-title>
        <p>Вход</p>
      </v-card-title>

      <v-card-text>
        <v-col>
          <v-text-field label="Имя пользователя" v-model="username"></v-text-field>
          <v-text-field label="Пароль" v-model="password"></v-text-field>
          <v-btn @click="login">Войти</v-btn>
        </v-col>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped></style>
