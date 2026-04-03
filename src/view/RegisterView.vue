<template>
  <div class="login-page">
    <div class="login-container">
      <img src="../assets/Bea.png" alt="Bea" class="login-bea">
      <div class="login-card">
        <div class="login-logo">PIECE BY PEAS</div>
        <form @submit.prevent="handleRegister">
          <div class="input-group">
            <input
              type="text"
              v-model="username"
              :placeholder="$t('username_label')"
              required
            >
          </div>
          <div class="input-group">
            <input
              type="email"
              v-model="email"
              placeholder="Email"
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
          <p v-if="success" class="success-msg">{{ $t('account_created') }}</p>
          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? '...' : $t('signup_title') }}
          </button>
        </form>
        <button class="signup-btn" @click="$router.push('/login')">
          {{ $t('back_to_login') }}
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

const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    await auth.register(username.value, email.value, password.value)
    success.value = true
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>