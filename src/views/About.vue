<template>
  <div class="about">
    <section class="about-hero">
      <h1>About <span class="accent">SkyCars</span></h1>
      <p class="subtitle">Revolutionizing the future of flight</p>
    </section>
  </div>
</template>

<style scoped>
.about {
  min-height: 100vh;
  padding-top: 80px;
}

.about-hero {
  text-align: center;
  padding: 4rem 2rem;
}

h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1rem;
}

.accent {
  color: var(--accent);
}

.subtitle {
  color: var(--text-secondary);
  font-size: 1.2rem;
}
</style> 