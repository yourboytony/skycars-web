<template>
  <div class="dashboard">
    <div class="dashboard-container">
      <h1>Welcome, {{ user?.name }}</h1>
      <div class="dashboard-content">
        <div class="stats-grid">
          <div class="stat-card glass">
            <h3>Total Cars</h3>
            <p class="stat-value">0</p>
          </div>
          <div class="stat-card glass">
            <h3>Active Listings</h3>
            <p class="stat-value">0</p>
          </div>
          <div class="stat-card glass">
            <h3>Views</h3>
            <p class="stat-value">0</p>
          </div>
          <div class="stat-card glass">
            <h3>Messages</h3>
            <p class="stat-value">0</p>
          </div>
        </div>

        <div class="actions-grid">
          <button class="action-btn glass">
            <i class="fas fa-plus"></i>
            Add New Car
          </button>
          <button class="action-btn glass">
            <i class="fas fa-list"></i>
            View Listings
          </button>
          <button class="action-btn glass">
            <i class="fas fa-envelope"></i>
            Messages
          </button>
          <button class="action-btn glass">
            <i class="fas fa-cog"></i>
            Settings
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const user = auth.user
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 2rem;
  background: var(--background-primary);
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 60px;
}

h1 {
  margin-bottom: 2rem;
  color: var(--text-color);
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 1rem;
  text-align: center;
}

.stat-card h3 {
  color: var(--text-light);
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary-color);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  border: none;
  border-radius: 1rem;
  background: none;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.action-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .stats-grid,
  .actions-grid {
    grid-template-columns: 1fr;
  }
}
</style> 