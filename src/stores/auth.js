import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const login = (userData) => {
    user.value = userData
    isAuthenticated.value = true
    localStorage.setItem('authToken', 'mock-token')
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  }

  const checkAuth = () => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('user')
    if (token && userData) {
      user.value = JSON.parse(userData)
      isAuthenticated.value = true
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }
})
