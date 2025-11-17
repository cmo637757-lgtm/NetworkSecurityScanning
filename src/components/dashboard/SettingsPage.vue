<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1 class="settings-main-title">SSIBAL</h1>
      <h2 class="settings-subtitle">Account settings</h2>
    </div>

    <div class="settings-content">
      <div class="settings-nav">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          class="nav-item"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          <div class="nav-icon">{{ tab.icon }}</div>
          <div class="nav-content">
            <div class="nav-title">{{ tab.title }}</div>
            <div class="nav-description">{{ tab.description }}</div>
          </div>
          <div class="nav-arrow">→</div>
        </div>
      </div>

      <div class="settings-panel">
        <!-- Profile Settings -->
        <div v-if="activeTab === 'profile'" class="tab-content">
          <h3 class="panel-title">Profile Settings</h3>
          <div class="profile-form">
            <div class="form-group">
              <label for="username">Username</label>
              <input id="username" v-model="profile.username" type="text" class="form-input" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" v-model="profile.email" type="email" class="form-input" />
            </div>
            <button class="save-button" @click="saveProfile">Save Changes</button>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeTab === 'security'" class="tab-content">
          <h3 class="panel-title">Security Settings</h3>
          <ChangePassword />
        </div>

        <!-- Reports & Records -->
        <div v-if="activeTab === 'reports'" class="tab-content">
          <h3 class="panel-title">Reports & Records</h3>
          <div class="reports-grid">
            <div class="report-card" v-for="report in reports" :key="report.id">
              <div class="report-icon">📊</div>
              <div class="report-content">
                <h4 class="report-title">{{ report.title }}</h4>
                <p class="report-date">Generated: {{ report.date }}</p>
                <p class="report-status" :class="report.status">{{ report.status }}</p>
              </div>
              <div class="report-actions">
                <button class="action-btn download" @click="downloadReport(report.id)">
                  Download
                </button>
                <button class="action-btn view" @click="viewReport(report.id)">View</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Logs -->
        <div v-if="activeTab === 'logs'" class="tab-content">
          <h3 class="panel-title">Activity Logs</h3>
          <div class="logs-container">
            <div class="logs-filter">
              <select v-model="logFilter" class="filter-select">
                <option value="all">All Activities</option>
                <option value="login">Login Events</option>
                <option value="scan">Scan Activities</option>
                <option value="security">Security Events</option>
              </select>
              <input
                v-model="logSearch"
                type="text"
                placeholder="Search logs..."
                class="search-input"
              />
            </div>
            <div class="logs-list">
              <div v-for="log in filteredLogs" :key="log.id" class="log-entry" :class="log.type">
                <div class="log-time">{{ formatTime(log.timestamp) }}</div>
                <div class="log-message">{{ log.message }}</div>
                <div class="log-type">{{ log.type }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Account Management -->
        <div v-if="activeTab === 'account'" class="tab-content">
          <h3 class="panel-title">Account Management</h3>
          <div class="danger-zone">
            <h4 class="danger-title">Danger Zone</h4>
            <p class="danger-description">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button class="danger-button" @click="showCancelConfirm = true">Delete Account</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Account Deletion Confirmation Modal -->
    <div v-if="showCancelConfirm" class="modal-overlay">
      <div class="modal-content">
        <h3 class="modal-title">Confirm Account Deletion</h3>
        <p class="modal-description">
          Are you sure you want to delete your account? This will permanently remove all your data
          and cannot be undone.
        </p>
        <div class="modal-actions">
          <button class="confirm-button" @click="handleAccountDeletion">
            Yes, Delete My Account
          </button>
          <button class="cancel-button" @click="showCancelConfirm = false">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ChangePassword from './ChangePassword.vue'

export default {
  name: 'SettingsPage',
  components: {
    ChangePassword,
  },
  setup() {
    const activeTab = ref('profile')
    const showCancelConfirm = ref(false)
    const logFilter = ref('all')
    const logSearch = ref('')
    const router = useRouter()
    const authStore = useAuthStore()

    const profile = ref({
      username: '',
      email: '',
    })

    const tabs = [
      {
        id: 'profile',
        icon: '👤',
        title: 'Profile',
        description: 'Manage your personal information',
      },
      {
        id: 'security',
        icon: '🔒',
        title: 'Security',
        description: 'Password and security settings',
      },
      {
        id: 'reports',
        icon: '📊',
        title: 'Reports & Records',
        description: 'View and download security reports',
      },
      {
        id: 'logs',
        icon: '📝',
        title: 'Logs',
        description: 'Activity and security logs',
      },
      {
        id: 'account',
        icon: '⚙️',
        title: 'Account Management',
        description: 'Account deletion and preferences',
      },
    ]

    const reports = ref([
      {
        id: 1,
        title: 'Security Scan Report - November 2024',
        date: '2024-11-07',
        status: 'completed',
      },
      {
        id: 2,
        title: 'Vulnerability Analysis - October 2024',
        date: '2024-10-25',
        status: 'completed',
      },
      {
        id: 3,
        title: 'Penetration Test Results',
        date: '2024-10-15',
        status: 'in-progress',
      },
    ])

    const logs = ref([
      {
        id: 1,
        timestamp: new Date('2024-11-07T11:46:00'),
        message: 'User login successful',
        type: 'login',
      },
      {
        id: 2,
        timestamp: new Date('2024-11-06T14:23:00'),
        message: 'Security scan completed',
        type: 'scan',
      },
      {
        id: 3,
        timestamp: new Date('2024-11-05T09:15:00'),
        message: 'Potential XSS vulnerability detected',
        type: 'security',
      },
      {
        id: 4,
        timestamp: new Date('2024-11-04T16:45:00'),
        message: 'Password changed successfully',
        type: 'security',
      },
    ])

    const filteredLogs = computed(() => {
      return logs.value.filter((log) => {
        const matchesFilter = logFilter.value === 'all' || log.type === logFilter.value
        const matchesSearch = log.message.toLowerCase().includes(logSearch.value.toLowerCase())
        return matchesFilter && matchesSearch
      })
    })

    const formatTime = (timestamp) => {
      return timestamp.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    }

    const saveProfile = () => {
      // 保存个人资料逻辑
      console.log('Saving profile:', profile.value)
      alert('Profile updated successfully!')
    }

    const downloadReport = (reportId) => {
      console.log('Downloading report:', reportId)
      alert('Report download started')
    }

    const viewReport = (reportId) => {
      console.log('Viewing report:', reportId)
      alert('Opening report viewer')
    }

    const handleAccountDeletion = () => {
      authStore.logout()
      showCancelConfirm.value = false
      router.push('/')
    }

    onMounted(() => {
      // 加载用户资料
      if (authStore.user) {
        profile.value.username = authStore.user.username || ''
        profile.value.email = authStore.user.email || ''
      }
    })

    return {
      activeTab,
      showCancelConfirm,
      logFilter,
      logSearch,
      profile,
      tabs,
      reports,
      filteredLogs,
      formatTime,
      saveProfile,
      downloadReport,
      viewReport,
      handleAccountDeletion,
    }
  },
}
</script>

<style scoped>
.settings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-header {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.settings-main-title {
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.settings-subtitle {
  font-size: 1.5rem;
  color: #7f8c8d;
  margin: 0;
  font-weight: 500;
}

.settings-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
}

.settings-nav {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid #ecf0f1;
  transition: background-color 0.3s ease;
}

.nav-item:last-child {
  border-bottom: none;
}

.nav-item:hover {
  background: #f8f9fa;
}

.nav-item.active {
  background: #3498db;
  color: white;
}

.nav-item.active .nav-description {
  color: rgba(255, 255, 255, 0.8);
}

.nav-icon {
  font-size: 1.5rem;
}

.nav-content {
  flex: 1;
}

.nav-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.nav-description {
  font-size: 0.875rem;
  color: #7f8c8d;
}

.nav-arrow {
  font-weight: bold;
}

.settings-panel {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.panel-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.profile-form {
  max-width: 400px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
}

.save-button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.save-button:hover {
  background: #2980b9;
}

.reports-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.report-card:hover {
  background: #e9ecef;
}

.report-icon {
  font-size: 2rem;
}

.report-content {
  flex: 1;
}

.report-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.report-date {
  font-size: 0.875rem;
  color: #7f8c8d;
  margin-bottom: 0.25rem;
}

.report-status {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  display: inline-block;
}

.report-status.completed {
  background: #d4edda;
  color: #155724;
}

.report-status.in-progress {
  background: #fff3cd;
  color: #856404;
}

.report-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-btn.download {
  background: #3498db;
  color: white;
}

.action-btn.download:hover {
  background: #2980b9;
}

.action-btn.view {
  background: #ecf0f1;
  color: #2c3e50;
}

.action-btn.view:hover {
  background: #bdc3c7;
}

.logs-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.logs-filter {
  display: flex;
  gap: 1rem;
}

.filter-select,
.search-input {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
}

.filter-select {
  min-width: 150px;
}

.search-input {
  flex: 1;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 400px;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.log-entry:hover {
  background: #e9ecef;
}

.log-entry.login {
  border-left: 4px solid #3498db;
}

.log-entry.scan {
  border-left: 4px solid #27ae60;
}

.log-entry.security {
  border-left: 4px solid #e74c3c;
}

.log-time {
  min-width: 180px;
  font-size: 0.875rem;
  color: #7f8c8d;
}

.log-message {
  flex: 1;
  font-weight: 500;
  color: #2c3e50;
}

.log-type {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
}

.log-entry.login .log-type {
  background: #d6eaf8;
  color: #21618c;
}

.log-entry.scan .log-type {
  background: #d4edda;
  color: #155724;
}

.log-entry.security .log-type {
  background: #fadbd8;
  color: #922b21;
}

.danger-zone {
  border: 2px solid #e74c3c;
  border-radius: 12px;
  padding: 2rem;
  background: #fdf2f2;
}

.danger-title {
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.danger-description {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.danger-button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.danger-button:hover {
  background: #c0392b;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  text-align: center;
}

.modal-title {
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.modal-description {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.confirm-button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background: #c0392b;
}

.cancel-button {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background: #7f8c8d;
}

@media (max-width: 768px) {
  .settings-content {
    grid-template-columns: 1fr;
  }

  .logs-filter {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>
