<template>
  <nav class="sidebar">
    <div class="nav-user" @click="toggleDropdown">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20v-1a8 8 0 0116 0v1"/>
      </svg>
      <span class="nav-user-name">Hello, {{ username }}</span>
      <div class="user-dropdown" :class="{ open: dropdownOpen }">
        <div class="dropdown-email">{{ userEmail }}</div>
        <button class="dropdown-item" @click="openProfile">{{ $t('edit_profile') }}</button>
        <button class="dropdown-item" id="langToggleBtn" @click="toggleLang">{{ langLabel }}</button>
        <button class="dropdown-item logout" @click="handleLogout">{{ $t('logout') }}</button>
      </div>
    </div>

    <div class="nav-items">
      <RouterLink to="/" class="nav-item" :class="{ active: route.path === '/' }">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 12 12 3 21 12"/>
          <path d="M5 10v9a1 1 0 001 1h4v-4h4v4h4a1 1 0 001-1v-9"/>
        </svg>
      </RouterLink>
      <RouterLink to="/add" class="nav-item" :class="{ active: route.path === '/add' }">
        <div class="nav-icon-circle">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </div>
      </RouterLink>
      <RouterLink to="/log" class="nav-item" :class="{ active: route.path === '/log' }">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="9" y2="6"/><line x1="14" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="9" y2="12"/><line x1="14" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="9" y2="18"/><line x1="14" y1="18" x2="21" y2="18"/>
        </svg>
      </RouterLink>
      <RouterLink to="/report" class="nav-item" :class="{ active: route.path === '/report' }">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none"/>
          <line x1="9" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </RouterLink>
    </div>
  </nav>

  <!-- Profile Modal -->
  <div class="modal-overlay" :class="{ open: profileOpen }">
    <div class="modal-card">
      <p class="modal-title">{{ $t('edit_profile_title') }}</p>
      <div class="modal-field">
        <label>{{ $t('username_label') }}</label>
        <input type="text" v-model="profileName">
      </div>
      <div class="modal-field">
        <label>{{ $t('email_label') }}</label>
        <input type="email" v-model="profileEmail">
      </div>
      <div class="modal-field">
        <label>{{ $t('new_password') }}</label>
        <input type="password" v-model="profilePassword" :placeholder="$t('pw_ph')">
      </div>
      <p v-if="profileError" style="color:#e05a3a;font-size:.82rem">{{ profileError }}</p>
      <div class="modal-actions">
        <button class="btn-secondary" @click="profileOpen = false">{{ $t('cancel') }}</button>
        <button class="btn-primary" @click="saveProfile" :disabled="saving">
          {{ saving ? '...' : $t('save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const { locale } = useI18n()

const dropdownOpen = ref(false)
const profileOpen = ref(false)
const profileName = ref('')
const profileEmail = ref('')
const profilePassword = ref('')
const profileError = ref('')
const saving = ref(false)

const username = computed(() => localStorage.getItem('username') || 'Hello')
const userEmail = computed(() => localStorage.getItem('userEmail') || '—')
const langLabel = computed(() => locale.value === 'en' ? '中文' : 'English')

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value
}

function toggleLang() {
  locale.value = locale.value === 'en' ? 'zh' : 'en'
  localStorage.setItem('lang', locale.value)
  dropdownOpen.value = false
}

function openProfile() {
  profileName.value = localStorage.getItem('username') || ''
  profileEmail.value = localStorage.getItem('userEmail') || ''
  profilePassword.value = ''
  profileError.value = ''
  profileOpen.value = true
  dropdownOpen.value = false
}

async function saveProfile() {
  if (!profileName.value || !profileEmail.value) {
    profileError.value = 'Username and email cannot be empty.'
    return
  }
  saving.value = true
  try {
    const body = { username: profileName.value, email: profileEmail.value }
    if (profilePassword.value) body.password = profilePassword.value
    await auth.updateProfile(body)
    profileOpen.value = false
  } catch (e) {
    profileError.value = e.message
  } finally {
    saving.value = false
  }
}

async function handleLogout() {
  if (!confirm('Are you sure you want to log out?')) return
  await auth.logout()
  router.push('/login')
}

function handleClickOutside(e) {
  const navUser = document.querySelector('.nav-user')
  if (navUser && !navUser.contains(e.target)) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>