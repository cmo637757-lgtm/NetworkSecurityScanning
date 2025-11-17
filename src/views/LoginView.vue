<template>
  <LoginPage @login-success="$emit('login-success')" />
</template>

<script>
import LoginPage from '../components/auth/LoginPage.vue'

export default {
  name: 'LoginView',
  components: {
    LoginPage,
  },
  emits: ['login-success'],
}
</script>
