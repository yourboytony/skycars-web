<template>
  <div class="about">
    <div class="content">
      <h1>About <span class="accent">SkyCars</span></h1>
      <p class="description">
        Experience the future of aviation simulation with unparalleled realism and detail.
      </p>
      <div class="features">
        <div class="feature-card card">
          <h3>Premium Quality</h3>
          <p>Ultra-realistic aircraft models and physics</p>
        </div>
        <div class="feature-card card">
          <h3>Innovation</h3>
          <p>Next-generation flight dynamics</p>
        </div>
        <div class="feature-card card">
          <h3>Community</h3>
          <p>Join global aviation enthusiasts</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about {
  min-height: 100vh;
  padding: 6rem 2rem;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
}

.accent {
  color: var(--accent);
}

.description {
  font-size: 1.2rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin-bottom: 4rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.feature-card {
  text-align: center;
}

.feature-card h3 {
  color: var(--accent);
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--text-secondary);
}
</style> 