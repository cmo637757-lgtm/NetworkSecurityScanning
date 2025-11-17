<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">SSIBAL</h1>
      <div class="system-status">
        <div class="status-indicator">
          <div class="status-text">System Status</div>
          <div class="status-value">71%</div>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: '71%' }"></div>
        </div>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card" @click="navigateToFeature('simulations')">
        <div class="feature-icon">🛡️</div>
        <h3 class="feature-title">Web vulnerability simulations</h3>
        <p class="feature-description">Run simulated attacks to test your defenses</p>
        <div class="feature-stats">
          <span class="stat-value">24 Active</span>
          <span class="stat-trend">↑ 12%</span>
        </div>
      </div>

      <div class="feature-card" @click="navigateToFeature('scans')">
        <div class="feature-icon">🔍</div>
        <h3 class="feature-title">Web vulnerability scan</h3>
        <p class="feature-description">Comprehensive security scanning</p>
        <div class="feature-stats">
          <span class="stat-value">12 Completed</span>
          <span class="stat-trend">↑ 8%</span>
        </div>
      </div>

      <div class="feature-card" @click="navigateToFeature('attacks')">
        <div class="feature-icon">⚡</div>
        <h3 class="feature-title">Web vulnerability attacks</h3>
        <p class="feature-description">Monitor and analyze attack patterns</p>
        <div class="feature-stats">
          <span class="stat-value">8 Detected</span>
          <span class="stat-trend">↓ 3%</span>
        </div>
      </div>

      <div class="feature-card" @click="navigateToSettings()">
        <div class="feature-icon">⚙️</div>
        <h3 class="feature-title">Settings</h3>
        <p class="feature-description">Configure your security preferences</p>
        <div class="feature-stats">
          <span class="stat-value">Configure</span>
          <span class="stat-trend">→</span>
        </div>
      </div>
    </div>

    <div class="recent-activity">
      <h2 class="section-title">Recent Activity</h2>
      <div class="activity-list">
        <div class="activity-item">
          <div class="activity-icon success">✓</div>
          <div class="activity-content">
            <div class="activity-title">Security scan completed</div>
            <div class="activity-time">2 minutes ago</div>
          </div>
          <div class="activity-status success">Success</div>
        </div>
        <div class="activity-item">
          <div class="activity-icon warning">⚠</div>
          <div class="activity-content">
            <div class="activity-title">Potential SQL injection detected</div>
            <div class="activity-time">15 minutes ago</div>
          </div>
          <div class="activity-status warning">Warning</div>
        </div>
        <div class="activity-item">
          <div class="activity-icon info">ℹ</div>
          <div class="activity-content">
            <div class="activity-title">New vulnerability patterns added</div>
            <div class="activity-time">1 hour ago</div>
          </div>
          <div class="activity-status info">Info</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'HomePage',
  setup() {
    const router = useRouter()

    const navigateToFeature = (feature) => {
      // 这里可以添加导航到具体功能页面的逻辑
      console.log('Navigating to feature:', feature)
    }

    const navigateToSettings = () => {
      router.push('/settings')
    }

    return {
      navigateToFeature,
      navigateToSettings,
    }
  },
}
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  font-size: 3rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.system-status {
  text-align: center;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.status-text {
  font-size: 1.1rem;
  color: #666;
  font-weight: 500;
}

.status-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #27ae60;
}

.progress-bar {
  width: 200px;
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #2ecc71);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-color: #3498db;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.feature-description {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.feature-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-value {
  font-weight: 600;
  color: #2c3e50;
}

.stat-trend {
  font-weight: 600;
  color: #27ae60;
}

.stat-trend.down {
  color: #e74c3c;
}

.recent-activity {
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.activity-item:hover {
  background: #e9ecef;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.activity-icon.success {
  background: #d4edda;
  color: #155724;
}

.activity-icon.warning {
  background: #fff3cd;
  color: #856404;
}

.activity-icon.info {
  background: #d1ecf1;
  color: #0c5460;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.activity-time {
  font-size: 0.875rem;
  color: #7f8c8d;
}

.activity-status {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.activity-status.success {
  background: #d4edda;
  color: #155724;
}

.activity-status.warning {
  background: #fff3cd;
  color: #856404;
}

.activity-status.info {
  background: #d1ecf1;
  color: #0c5460;
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
