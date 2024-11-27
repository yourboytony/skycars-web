<template>
  <div class="not-found">
    <div class="content glass">
      <h1>404</h1>
      <p>Page Not Found</p>
      <router-link to="/" class="home-button">
        Go Home
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--background-primary);
}

.content {
  text-align: center;
  padding: 3rem;
  border-radius: 1rem;
}

h1 {
  font-size: 6rem;
  margin: 0;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: 1.5rem;
  color: var(--text-light);
  margin: 1rem 0 2rem;
}

.home-button {
  display: inline-block;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.home-button:hover {
  opacity: 0.9;
}
</style> 