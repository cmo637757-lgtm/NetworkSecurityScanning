<template>
  <div id="app">
    <div class="app-container">
      <header v-if="isAuthenticated" class="app-header">
        <h1>SSIBAL</h1>
        <nav class="navigation">
          <router-link to="/home">Home</router-link>
          <router-link to="/settings">Settings</router-link>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </nav>
      </header>
      <main class="main-content">
        <router-view @login-success="handleLoginSuccess" />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const isAuthenticated = ref(false)
    const router = useRouter()

    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken')
      isAuthenticated.value = !!token
    }

    const handleLoginSuccess = () => {
      isAuthenticated.value = true
      router.push('/home')
    }

    const handleLogout = () => {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      isAuthenticated.value = false
      router.push('/')
    }

    onMounted(() => {
      checkAuthStatus()
    })

    return {
      isAuthenticated,
      handleLoginSuccess,
      handleLogout,
    }
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Arial, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  color: white;
  font-size: 2rem;
  font-weight: bold;
}

.navigation {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.navigation a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.navigation a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.navigation a.router-link-active {
  background: rgba(255, 255, 255, 0.3);
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.main-content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}
</style>
