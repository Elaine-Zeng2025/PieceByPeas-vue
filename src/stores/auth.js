import { defineStore } from 'pinia'
import { authApi } from '../api/index.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),

  actions: {
    async login(email, password) {
      const data = await authApi.login(email, password)
      this.user = data.user
      this.isLoggedIn = true
      localStorage.setItem('username', data.user.username)
      localStorage.setItem('userEmail', data.user.email)
      return data
    },

    async register(username, email, password) {
      return await authApi.register(username, email, password)
    },

    async logout() {
      await authApi.logout()
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('username')
      localStorage.removeItem('userEmail')
    },

    async checkAuth() {
      try {
        const data = await authApi.me()
        this.user = { id: data.user_id, username: data.username }
        this.isLoggedIn = true
      } catch {
        this.user = null
        this.isLoggedIn = false
      }
    },

    async updateProfile(profileData) {
      const data = await authApi.updateProfile(profileData)
      this.user = data.user
      localStorage.setItem('username', data.user.username)
      localStorage.setItem('userEmail', data.user.email)
      return data
    },
  },
})