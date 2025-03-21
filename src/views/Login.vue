<script lang="ts">
import { defineComponent } from 'vue'
import LocaleChanger from '@/components/LocaleChanger.vue'
import { mapWritableState } from 'pinia'
import { useRegionStore } from '@/stores/region.ts'

interface LoginResponse {
  token: string,
  roles: string[],
  regionId: number | null
}

export default defineComponent({
  name: `Login`,

  components: { LocaleChanger },

  data() {
    return {
      username: '',
      password: '',
      isPasswordVisible: false,
    }
  },

  computed: {
    ...mapWritableState(useRegionStore, ['selectedRegionId']),
  },

  methods: {
    async login(): Promise<void> {
      try {
        const { token, roles, regionId } = await this.$http.post<LoginResponse>('/auth/login', {
          username: this.username,
          password: this.password,
        })
        if (regionId !== null) {
          this.selectedRegionId = [regionId]
        }
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('roles', JSON.stringify(roles))

        if (roles.includes('candidate')) {
          await this.$router.push('/test/all')
        } else {
          await this.$router.push('/candidate/all')
        }
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
          <v-text-field
            :label="$t('login.username')"
            v-model="username"
            prepend-inner-icon="mdi-account-circle-outline"
          />
          <v-text-field
            :label="$t('login.password')"
            v-model="password"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="isPasswordVisible ? 'text' : 'password'"
            @click:append-inner="isPasswordVisible = !isPasswordVisible"
          />
          <v-btn
            @click="login"
            block
            variant="tonal"
            color="primary"
            size="large"
          >
            {{ $t('login.button') }}
          </v-btn>
        </v-col>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<style scoped></style>
