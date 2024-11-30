<template>
  <div class="forum-view">
    <div class="forum-header">
      <h1>Community Forum</h1>
      <button @click="showNewPostModal = true" class="btn-new-post">
        New Post
      </button>
    </div>

    <div class="forum-categories">
      <button 
        v-for="category in categories" 
        :key="category"
        :class="['category-btn', { active: selectedCategory === category }]"
        @click="selectedCategory = category"
      >
        {{ category }}
      </button>
    </div>

    <div class="forum-posts">
      <div v-for="post in filteredPosts" :key="post.id" class="post-card">
        <div class="post-header">
          <h3>{{ post.title }}</h3>
          <span class="post-meta">
            Posted by {{ post.author }} on {{ formatDate(post.date) }}
          </span>
        </div>
        <p class="post-preview">{{ post.preview }}</p>
        <div class="post-footer">
          <span>{{ post.replies }} replies</span>
          <span>{{ post.views }} views</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Forum',
  data() {
    return {
      showNewPostModal: false,
      selectedCategory: 'All',
      categories: ['All', 'General', 'Technical', 'Flight Planning', 'Support'],
      posts: [] // Will be populated from database
    }
  },
  computed: {
    filteredPosts() {
      if (this.selectedCategory === 'All') return this.posts
      return this.posts.filter(post => post.category === this.selectedCategory)
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.forum-view {
  padding: 2rem;
}

.forum-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-new-post {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.forum-categories {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.category-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.category-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.post-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.post-header {
  margin-bottom: 1rem;
}

.post-meta {
  color: #6b7280;
  font-size: 0.875rem;
}

.post-preview {
  color: #374151;
  margin-bottom: 1rem;
}

.post-footer {
  display: flex;
  gap: 2rem;
  color: #6b7280;
  font-size: 0.875rem;
}
</style> 