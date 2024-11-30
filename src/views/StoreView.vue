<template>
  <div class="store">
    <div class="content">
      <h1>Aircraft <span class="accent">Collection</span></h1>
      <div class="aircraft-grid">
        <div v-for="aircraft in aircraftCollection" 
             :key="aircraft.id" 
             class="aircraft-card card">
          <div class="card-image">
            <img :src="aircraft.image" :alt="aircraft.name">
          </div>
          <div class="card-content">
            <h3>{{ aircraft.name }}</h3>
            <p class="price">{{ aircraft.price }}</p>
            <button class="btn">
              Add to Cart
              <div class="btn-glow"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.store {
  min-height: 100vh;
  padding: 6rem 2rem;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 3.5rem;
  margin-bottom: 3rem;
}

.aircraft-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.aircraft-card {
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.aircraft-card:hover .card-image img {
  transform: scale(1.1);
}

.card-content {
  text-align: center;
}

.price {
  color: var(--accent);
  margin: 1rem 0;
  font-weight: 600;
}
</style> 