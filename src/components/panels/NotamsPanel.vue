<template>
  <div class="notams-panel">
    <div class="unavailable-content">
      <div class="message-box">
        <i class="fas fa-tools maintenance-icon"></i>
        <h2>NOTAMs Coming Soon</h2>
        <p>We're currently working on integrating a reliable NOTAMs service.</p>
        <div class="features-preview">
          <h3>Planned Features:</h3>
          <ul>
            <li>
              <i class="fas fa-check"></i>
              Real-time NOTAM updates
            </li>
            <li>
              <i class="fas fa-check"></i>
              Route-based NOTAM filtering
            </li>
            <li>
              <i class="fas fa-check"></i>
              Interactive map visualization
            </li>
            <li>
              <i class="fas fa-check"></i>
              Category-based filtering
            </li>
            <li>
              <i class="fas fa-check"></i>
              Automatic relevance sorting
            </li>
          </ul>
        </div>
        <div class="alternative">
          <p>In the meantime, please check NOTAMs at:</p>
          <a 
            href="https://www.notams.faa.gov/dinsQueryWeb/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="external-link"
          >
            <i class="fas fa-external-link-alt"></i>
            FAA NOTAM Search
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No functionality needed for now
</script>

<style scoped>
.notams-panel {
  height: 100%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.unavailable-content {
  text-align: center;
  max-width: 600px;
  width: 100%;
}

.message-box {
  background: #f8fafc;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.maintenance-icon {
  font-size: 3rem;
  color: #2563eb;
  margin-bottom: 1rem;
}

h2 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

p {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.features-preview {
  text-align: left;
  margin: 2rem 0;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
}

.features-preview h3 {
  color: #1e293b;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.features-preview ul {
  list-style: none;
  padding: 0;
}

.features-preview li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: #64748b;
}

.features-preview li i {
  color: #22c55e;
}

.alternative {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e2e8f0;
}

.external-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  margin-top: 1rem;
  transition: background-color 0.2s;
}

.external-link:hover {
  background: #1d4ed8;
}

@media (max-width: 640px) {
  .notams-panel {
    padding: 1rem;
  }

  .message-box {
    padding: 1.5rem;
  }

  .features-preview {
    padding: 1rem;
  }
}
</style> 