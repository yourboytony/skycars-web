<template>
  <div class="dashboard">
    <!-- Side Navigation -->
    <nav class="side-nav" :class="{ 'collapsed': isNavCollapsed }">
      <!-- Logo Section -->
      <div class="nav-header">
        <PlaceholderIcon 
          type="appLogo" 
          size="lg"
          :showLabel="true"
        />
        <button @click="toggleNav" class="collapse-btn">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <!-- User Profile -->
      <div class="user-profile">
        <div class="user-info">
          <img 
            :src="user?.avatar || '/default-avatar.png'" 
            alt="User avatar" 
            class="avatar"
          />
          <div class="user-details" v-if="!isNavCollapsed">
            <span class="user-name">{{ user?.name || 'Pilot' }}</span>
            <span class="user-role">Commercial Pilot</span>
          </div>
        </div>
      </div>

      <!-- Navigation Items -->
      <div class="nav-menu">
        <!-- Flight Planning Section -->
        <div class="nav-section">
          <span class="nav-section-title" v-if="!isNavCollapsed">FLIGHT PLANNING</span>
          <button 
            @click="activePanel = 'flight-plan'"
            :class="['nav-item', { active: activePanel === 'flight-plan' }]"
          >
            <i class="fas fa-plane"></i>
            <span v-if="!isNavCollapsed">Flight Plan</span>
          </button>
          <button 
            @click="activePanel = 'charts'"
            :class="['nav-item', { active: activePanel === 'charts' }]"
          >
            <i class="fas fa-map"></i>
            <span v-if="!isNavCollapsed">Charts</span>
          </button>
          <button 
            @click="activePanel = 'weather'"
            :class="['nav-item', { active: activePanel === 'weather' }]"
          >
            <i class="fas fa-cloud"></i>
            <span v-if="!isNavCollapsed">Weather</span>
          </button>
        </div>

        <!-- Performance Section -->
        <div class="nav-section">
          <span class="nav-section-title" v-if="!isNavCollapsed">PERFORMANCE</span>
          <button 
            @click="activePanel = 'weights'"
            :class="['nav-item', { active: activePanel === 'weights' }]"
          >
            <i class="fas fa-balance-scale"></i>
            <span v-if="!isNavCollapsed">W&B</span>
          </button>
        </div>

        <!-- Information Section -->
        <div class="nav-section">
          <span class="nav-section-title" v-if="!isNavCollapsed">INFORMATION</span>
          <button 
            @click="activePanel = 'notams'"
            :class="['nav-item', { active: activePanel === 'notams' }]"
          >
            <i class="fas fa-exclamation-circle"></i>
            <span v-if="!isNavCollapsed">NOTAMs</span>
          </button>
        </div>
      </div>

      <!-- Bottom Actions -->
      <div class="nav-footer">
        <button 
          @click="toggleDarkMode" 
          class="nav-item"
        >
          <i :class="['fas', isDarkMode ? 'fa-sun' : 'fa-moon']"></i>
          <span v-if="!isNavCollapsed">{{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}</span>
        </button>
        <button 
          @click="router.push('/profile')" 
          class="nav-item"
        >
          <i class="fas fa-cog"></i>
          <span v-if="!isNavCollapsed">Settings</span>
        </button>
        <button 
          @click="handleLogout" 
          class="nav-item text-red-500"
        >
          <i class="fas fa-sign-out-alt"></i>
          <span v-if="!isNavCollapsed">Logout</span>
        </button>
      </div>
    </nav>

    <!-- Rest of your dashboard content -->
  </div>
</template>

<style scoped>
.side-nav {
  width: 260px;
  background: #1e293b;
  height: 100vh;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  left: 0;
  top: 0;
}

.side-nav.collapsed {
  width: 70px;
}

.nav-header {
  height: 70px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  height: 32px;
  width: auto;
}

.collapse-btn {
  color: #94a3b8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.collapse-btn:hover {
  color: #e2e8f0;
}

.user-profile {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 14px;
}

.user-role {
  color: #94a3b8;
  font-size: 12px;
}

.nav-menu {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section-title {
  padding: 0 20px;
  color: #64748b;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.05em;
  margin-bottom: 8px;
  display: block;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  width: 100%;
  border: none;
  background: none;
  color: #94a3b8;
  font-size: 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.nav-item.active {
  background: #2563eb;
  color: white;
}

.nav-item i {
  width: 20px;
  text-align: center;
  font-size: 16px;
}

.nav-footer {
  padding: 16px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Main content adjustment */
.main-content {
  margin-left: 260px;
  transition: margin-left 0.3s ease;
}

.collapsed + .main-content {
  margin-left: 70px;
}

@media (max-width: 768px) {
  .side-nav {
    transform: translateX(-100%);
  }

  .side-nav.open {
    transform: translateX(0);
  }

  .main-content {
    margin-left: 0;
  }
}
</style>