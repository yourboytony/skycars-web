<template>
  <div class="about-view">
    <div class="about-header">
      <h1>About Us</h1>
      <p class="mission-statement">
        Dedicated to providing the best aviation tracking and planning tools for the flight simulation community.
      </p>
    </div>

    <div class="team-section">
      <h2>Our Team</h2>
      
      <div class="team-grid">
        <div class="team-member">
          <div class="member-photo">
            <img src="../assets/sean-davis.jpg" alt="Sean Davis" />
          </div>
          <h3>Sean Davis</h3>
          <p class="member-title">Founder</p>
          <p class="member-bio">
            Aviation enthusiast and software developer with over 10 years of experience in flight simulation.
          </p>
        </div>

        <div class="team-member">
          <div class="member-photo">
            <img src="../assets/anthony-nigro.jpg" alt="Anthony Nigro" />
          </div>
          <h3>Anthony Nigro</h3>
          <p class="member-title">Founder</p>
          <p class="member-bio">
            Expert in aviation systems and former air traffic controller with a passion for flight simulation.
          </p>
        </div>

        <div class="team-member">
          <div class="member-photo">
            <img src="../assets/spencer-parkinson.jpg" alt="Spencer Parkinson" />
          </div>
          <h3>Spencer Parkinson</h3>
          <p class="member-title">Instructor</p>
          <p class="member-bio">
            Certified flight instructor bringing real-world aviation experience to the virtual world.
          </p>
        </div>
      </div>
    </div>

    <div class="values-section">
      <h2>Our Values</h2>
      <div class="values-grid">
        <div class="value-card">
          <h3>Excellence</h3>
          <p>Committed to providing the highest quality tools and services.</p>
        </div>
        <div class="value-card">
          <h3>Community</h3>
          <p>Building and supporting the flight simulation community.</p>
        </div>
        <div class="value-card">
          <h3>Innovation</h3>
          <p>Constantly improving and advancing our technology.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about-view {
  padding: 2rem;
}

.about-header {
  text-align: center;
  margin-bottom: 4rem;
}

.mission-statement {
  max-width: 600px;
  margin: 1rem auto;
  color: #6b7280;
  font-size: 1.2rem;
}

.team-section {
  margin-bottom: 4rem;
}

.team-section h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.team-member {
  text-align: center;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.member-photo {
  width: 150px;
  height: 150px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
}

.member-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.member-title {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.member-bio {
  color: #6b7280;
}

.values-section {
  margin-bottom: 4rem;
}

.values-section h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.value-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}

.value-card h3 {
  color: var(--primary-color);
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .team-grid,
  .values-grid {
    grid-template-columns: 1fr;
  }
}
</style> 