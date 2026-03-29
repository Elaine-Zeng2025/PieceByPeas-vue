<template>
  <div class="login-page">
    <div class="login-container">
      <img src="../assets/Bea.png" alt="Bea" class="login-bea">
      <div class="login-card">
        <div class="login-logo">PIECE BY PEAS</div>
        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <input
              type="email"
              v-model="email"
              :placeholder="$t('username_ph')"
              required
            >
          </div>
          <div class="input-group">
            <input
              type="password"
              v-model="password"
              :placeholder="$t('password_ph')"
              required
            >
          </div>
          <p v-if="error" class="error-msg">{{ error }}</p>
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '...' : $t('login_title') }}
          </button>
        </form>
        <button class="signup-btn" @click="$router.push('/register')">
          {{ $t('signup_title') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>