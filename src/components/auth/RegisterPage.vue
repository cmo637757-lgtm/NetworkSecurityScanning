<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="register-title">Create New Account</h2>
      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="reg-username">Username</label>
          <input
            id="reg-username"
            v-model="registerForm.username"
            type="text"
            required
            class="form-input"
            :class="{ error: fieldErrors.username }"
          />
          <span v-if="fieldErrors.username" class="error-message">{{ fieldErrors.username }}</span>
        </div>

        <div class="form-group">
          <label for="reg-email">Email</label>
          <input
            id="reg-email"
            v-model="registerForm.email"
            type="email"
            required
            class="form-input"
            :class="{ error: fieldErrors.email }"
          />
          <span v-if="fieldErrors.email" class="error-message">{{ fieldErrors.email }}</span>
        </div>

        <div class="form-group">
          <label for="reg-password">Password</label>
          <input
            id="reg-password"
            v-model="registerForm.password"
            type="password"
            required
            class="form-input"
            :class="{ error: fieldErrors.password }"
          />
          <span v-if="fieldErrors.password" class="error-message">{{ fieldErrors.password }}</span>
        </div>

        <div class="form-group">
          <label for="reg-confirm-password">Confirm Password</label>
          <input
            id="reg-confirm-password"
            v-model="registerForm.confirmPassword"
            type="password"
            required
            class="form-input"
            :class="{ error: fieldErrors.confirmPassword }"
          />
          <span v-if="fieldErrors.confirmPassword" class="error-message">{{
            fieldErrors.confirmPassword
          }}</span>
        </div>

        <button type="submit" class="register-button" :disabled="isLoading">
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <div class="login-link">
        Already have an account? <router-link to="/">Login here</router-link>
      </div>

      <div v-if="errorMessage" class="error-banner">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="success-banner">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'RegisterPage',
  setup() {
    const registerForm = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
    const fieldErrors = ref({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
    const errorMessage = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)
    const router = useRouter()

    const validateForm = () => {
      clearErrors()
      let isValid = true

      if (!registerForm.value.username.trim()) {
        fieldErrors.value.username = 'Username is required'
        isValid = false
      }

      if (!registerForm.value.email.trim()) {
        fieldErrors.value.email = 'Email is required'
        isValid = false
      } else if (!isValidEmail(registerForm.value.email)) {
        fieldErrors.value.email = 'Please enter a valid email address'
        isValid = false
      }

      if (!registerForm.value.password) {
        fieldErrors.value.password = 'Password is required'
        isValid = false
      } else if (registerForm.value.password.length < 6) {
        fieldErrors.value.password = 'Password must be at least 6 characters'
        isValid = false
      }

      if (!registerForm.value.confirmPassword) {
        fieldErrors.value.confirmPassword = 'Please confirm your password'
        isValid = false
      } else if (registerForm.value.password !== registerForm.value.confirmPassword) {
        fieldErrors.value.confirmPassword = 'Passwords do not match'
        isValid = false
      }

      return isValid
    }

    const isValidEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    }

    const clearErrors = () => {
      fieldErrors.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
      }
      errorMessage.value = ''
      successMessage.value = ''
    }

    const handleRegister = async () => {
      if (!validateForm()) {
        return
      }

      isLoading.value = true

      try {
        await performRegistration()
        successMessage.value = 'Account created successfully! Redirecting to login...'
        setTimeout(() => {
          router.push('/')
        }, 2000)
      } catch (error) {
        errorMessage.value = error.message || 'Registration failed. Please try again.'
      } finally {
        isLoading.value = false
      }
    }

    const performRegistration = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const existingUsers = JSON.parse(localStorage.getItem('users') || '[]')
          const userExists = existingUsers.some(
            (user) => user.username === registerForm.value.username,
          )

          if (userExists) {
            reject(new Error('Username already taken'))
          } else {
            const newUser = {
              username: registerForm.value.username,
              email: registerForm.value.email,
              password: registerForm.value.password,
            }
            existingUsers.push(newUser)
            localStorage.setItem('users', JSON.stringify(existingUsers))
            resolve()
          }
        }, 1500)
      })
    }

    return {
      registerForm,
      fieldErrors,
      errorMessage,
      successMessage,
      isLoading,
      handleRegister,
    }
  },
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.register-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
}

.register-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  font-size: 1.8rem;
}

.register-form {
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

.register-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.register-button:hover:not(:disabled) {
  opacity: 0.9;
}

.register-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  color: #555;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

.error-banner {
  background: #e74c3c;
  color: white;
  padding: 0.75rem;
  border-radius: 5px;
  margin-top: 1rem;
  text-align: center;
}

.success-banner {
  background: #27ae60;
  color: white;
  padding: 0.75rem;
  border-radius: 5px;
  margin-top: 1rem;
  text-align: center;
}
</style>
