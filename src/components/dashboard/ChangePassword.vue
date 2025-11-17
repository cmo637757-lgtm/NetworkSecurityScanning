<template>
  <div class="change-password">
    <h3>Change Password</h3>
    <form @submit.prevent="handlePasswordChange" class="password-form">
      <div class="form-group">
        <label for="current-password">Current Password</label>
        <input
          id="current-password"
          v-model="passwordForm.currentPassword"
          type="password"
          required
          class="form-input"
          :class="{ error: fieldErrors.currentPassword }"
        />
        <span v-if="fieldErrors.currentPassword" class="error-message">{{
          fieldErrors.currentPassword
        }}</span>
      </div>

      <div class="form-group">
        <label for="new-password">New Password</label>
        <input
          id="new-password"
          v-model="passwordForm.newPassword"
          type="password"
          required
          class="form-input"
          :class="{ error: fieldErrors.newPassword }"
        />
        <span v-if="fieldErrors.newPassword" class="error-message">{{
          fieldErrors.newPassword
        }}</span>
      </div>

      <div class="form-group">
        <label for="confirm-new-password">Confirm New Password</label>
        <input
          id="confirm-new-password"
          v-model="passwordForm.confirmNewPassword"
          type="password"
          required
          class="form-input"
          :class="{ error: fieldErrors.confirmNewPassword }"
        />
        <span v-if="fieldErrors.confirmNewPassword" class="error-message">{{
          fieldErrors.confirmNewPassword
        }}</span>
      </div>

      <button type="submit" class="submit-button" :disabled="isLoading">
        {{ isLoading ? 'Updating Password...' : 'Update Password' }}
      </button>
    </form>

    <div v-if="errorMessage" class="error-banner">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="success-banner">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'ChangePassword',
  setup() {
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    })
    const fieldErrors = ref({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    })
    const errorMessage = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)
    const router = useRouter()

    const validateForm = () => {
      clearErrors()
      let isValid = true

      if (!passwordForm.value.currentPassword) {
        fieldErrors.value.currentPassword = 'Current password is required'
        isValid = false
      }

      if (!passwordForm.value.newPassword) {
        fieldErrors.value.newPassword = 'New password is required'
        isValid = false
      } else if (passwordForm.value.newPassword.length < 6) {
        fieldErrors.value.newPassword = 'New password must be at least 6 characters'
        isValid = false
      }

      if (!passwordForm.value.confirmNewPassword) {
        fieldErrors.value.confirmNewPassword = 'Please confirm your new password'
        isValid = false
      } else if (passwordForm.value.newPassword !== passwordForm.value.confirmNewPassword) {
        fieldErrors.value.confirmNewPassword = 'New passwords do not match'
        isValid = false
      }

      return isValid
    }

    const clearErrors = () => {
      fieldErrors.value = {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }
      errorMessage.value = ''
      successMessage.value = ''
    }

    const handlePasswordChange = async () => {
      if (!validateForm()) {
        return
      }

      isLoading.value = true

      try {
        await performPasswordUpdate()
        successMessage.value = 'Password updated successfully! Redirecting to login...'

        // Clear form
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }

        // Redirect to login after success
        setTimeout(() => {
          localStorage.removeItem('authToken')
          router.push('/')
        }, 2000)
      } catch (error) {
        errorMessage.value = error.message || 'Password update failed. Please try again.'
      } finally {
        isLoading.value = false
      }
    }

    const performPasswordUpdate = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const currentUser = localStorage.getItem('user')
          const users = JSON.parse(localStorage.getItem('users') || '[]')
          const user = users.find((u) => u.username === JSON.parse(currentUser)?.username)

          if (!user || user.password !== passwordForm.value.currentPassword) {
            reject(new Error('Current password is incorrect'))
          } else {
            // Update password
            user.password = passwordForm.value.newPassword
            localStorage.setItem('users', JSON.stringify(users))
            resolve()
          }
        }, 1500)
      })
    }

    return {
      passwordForm,
      fieldErrors,
      errorMessage,
      successMessage,
      isLoading,
      handlePasswordChange,
    }
  },
}
</script>

<style scoped>
.change-password {
  max-width: 400px;
  margin: 0 auto;
}

.change-password h3 {
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
}

.password-form {
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

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.submit-button:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-button:disabled {
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

.success-banner {
  background: #27ae60;
  color: white;
  padding: 0.75rem;
  border-radius: 5px;
  margin-top: 1rem;
  text-align: center;
}
</style>
