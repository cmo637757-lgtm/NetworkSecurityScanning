<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Login</h2>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            required
            class="form-input"
            :class="{ error: fieldErrors.username }"
          />
          <span v-if="fieldErrors.username" class="error-message">{{ fieldErrors.username }}</span>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            required
            class="form-input"
            :class="{ error: fieldErrors.password }"
          />
          <span v-if="fieldErrors.password" class="error-message">{{ fieldErrors.password }}</span>
        </div>

        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="loginForm.rememberMe" />
            Remember me
          </label>
          <router-link to="/register" class="register-link">New User? Register</router-link>
        </div>

        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'LoginPage',
  emits: ['login-success'],
  setup(props, { emit }) {
    const loginForm = ref({
      username: '',
      password: '',
      rememberMe: false,
    })
    const fieldErrors = ref({
      username: '',
      password: '',
    })
    const errorMessage = ref('')
    const isLoading = ref(false)
    const router = useRouter()
    const authStore = useAuthStore()

    const validateForm = () => {
      clearErrors()
      let isValid = true

      if (!loginForm.value.username.trim()) {
        fieldErrors.value.username = 'Username is required'
        isValid = false
      }

      if (!loginForm.value.password) {
        fieldErrors.value.password = 'Password is required'
        isValid = false
      }

      return isValid
    }

    const clearErrors = () => {
      fieldErrors.value = {
        username: '',
        password: '',
      }
      errorMessage.value = ''
    }

    const handleLogin = async () => {
      if (!validateForm()) {
        return
      }

      isLoading.value = true

      try {
        // 模拟登录API调用
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            if (loginForm.value.username === 'demo' && loginForm.value.password === 'password') {
              const userData = {
                username: loginForm.value.username,
                email: 'demo@example.com',
              }
              authStore.login(userData)
              resolve()
            } else {
              reject(new Error('Invalid username or password'))
            }
          }, 1000)
        })

        emit('login-success')
      } catch (error) {
        errorMessage.value = error.message || 'Login failed. Please try again.'
      } finally {
        isLoading.value = true
      }
    }

    return {
      loginForm,
      fieldErrors,
      errorMessage,
      isLoading,
      handleLogin,
    }
  },
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.login-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.8rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-input.error {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
}

.register-link {
  color: #667eea;
  text-decoration: none;
}

.register-link:hover {
  text-decoration: underline;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.login-button:hover:not(:disabled) {
  opacity: 0.9;
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-banner {
  background: #e74c3c;
  color: white;
  padding: 0.75rem;
  border-radius: 5px;
  margin-top: 1rem;
  text-align: center;
}
</style>
