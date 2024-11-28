<template>
  <div class="new-listing">
    <div class="listing-container">
      <!-- Header -->
      <div class="listing-header glass">
        <h1>{{ isEditing ? 'Edit Listing' : 'Create New Listing' }}</h1>
        <div class="header-actions">
          <button 
            v-if="isEditing"
            class="preview-btn"
            @click="previewListing"
          >
            <i class="fas fa-eye"></i>
            Preview
          </button>
          <button 
            class="save-draft-btn"
            @click="saveDraft"
            :disabled="isSaving"
          >
            <i class="fas fa-save"></i>
            Save Draft
          </button>
          <button 
            class="publish-btn"
            @click="publishListing"
            :disabled="!isValid || isSaving"
          >
            <i class="fas fa-paper-plane"></i>
            Publish
          </button>
        </div>
      </div>

      <!-- Form -->
      <form class="listing-form" @submit.prevent>
        <!-- Basic Info -->
        <div class="form-section glass">
          <h2>Basic Information</h2>
          
          <div class="form-group">
            <label for="title">Title</label>
            <input 
              id="title"
              v-model="form.title"
              type="text"
              placeholder="e.g., PMDG 737 for MSFS"
              :class="{ error: errors.title }"
            >
            <span class="error-message" v-if="errors.title">
              {{ errors.title }}
            </span>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="simulator">Flight Simulator</label>
              <select 
                id="simulator"
                v-model="form.simulator"
                :class="{ error: errors.simulator }"
              >
                <option value="">Select Simulator</option>
                <option value="msfs">Microsoft Flight Simulator</option>
                <option value="xplane">X-Plane</option>
                <option value="p3d">Prepar3D</option>
                <option value="fsx">FSX</option>
              </select>
              <span class="error-message" v-if="errors.simulator">
                {{ errors.simulator }}
              </span>
            </div>

            <div class="form-group">
              <label for="aircraft_type">Aircraft Type</label>
              <select 
                id="aircraft_type"
                v-model="form.aircraft_type"
                :class="{ error: errors.aircraft_type }"
              >
                <option value="">Select Type</option>
                <option value="airliner">Airliner</option>
                <option value="ga">General Aviation</option>
                <option value="military">Military</option>
                <option value="helicopter">Helicopter</option>
              </select>
              <span class="error-message" v-if="errors.aircraft_type">
                {{ errors.aircraft_type }}
              </span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="developer">Developer</label>
              <input 
                id="developer"
                v-model="form.developer"
                type="text"
                placeholder="e.g., PMDG"
                :class="{ error: errors.developer }"
              >
              <span class="error-message" v-if="errors.developer">
                {{ errors.developer }}
              </span>
            </div>

            <div class="form-group">
              <label for="price">Price (Credits)</label>
              <input 
                id="price"
                v-model.number="form.price_credits"
                type="number"
                min="0"
                step="100"
                placeholder="e.g., 1000"
                :class="{ error: errors.price_credits }"
              >
              <span class="error-message" v-if="errors.price_credits">
                {{ errors.price_credits }}
              </span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="form-section glass">
          <h2>Description</h2>
          
          <div class="form-group">
            <label for="description">Detailed Description</label>
            <textarea 
              id="description"
              v-model="form.description"
              rows="6"
              placeholder="Describe your license, including any important details about activation, transfer process, etc."
              :class="{ error: errors.description }"
            ></textarea>
            <span class="error-message" v-if="errors.description">
              {{ errors.description }}
            </span>
          </div>
        </div>

        <!-- Images -->
        <div class="form-section glass">
          <h2>Images</h2>
          
          <div class="image-upload">
            <div 
              class="image-dropzone"
              :class="{ 'drag-over': isDragging }"
              @dragenter.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @dragover.prevent
              @drop.prevent="handleImageDrop"
              @click="$refs.fileInput.click()"
            >
              <input 
                type="file"
                ref="fileInput"
                accept="image/*"
                multiple
                @change="handleImageSelect"
                class="hidden"
              >
              <i class="fas fa-cloud-upload-alt"></i>
              <p>Drag and drop images here or click to browse</p>
              <span>Supported formats: JPG, PNG (max 5MB each)</span>
            </div>

            <div v-if="form.images.length" class="image-previews">
              <div 
                v-for="(image, index) in form.images"
                :key="index"
                class="image-preview"
              >
                <img :src="image.url" :alt="`Preview ${index + 1}`">
                <button 
                  class="remove-image"
                  @click="removeImage(index)"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- Preview Modal -->
    <div v-if="showPreview" class="modal-overlay" @click="showPreview = false">
      <div class="preview-modal glass" @click.stop>
        <div class="preview-header">
          <h2>Preview Listing</h2>
          <button class="close-btn" @click="showPreview = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="preview-content">
          <!-- Similar to ListingDetail layout but simplified -->
          <h1>{{ form.title }}</h1>
          
          <div class="preview-details">
            <span>
              <i :class="getSimulatorIcon(form.simulator)"></i>
              {{ getSimulatorName(form.simulator) }}
            </span>
            <span>
              <i class="fas fa-plane"></i>
              {{ formatType(form.aircraft_type) }}
            </span>
            <span>
              <i class="fas fa-code"></i>
              {{ form.developer }}
            </span>
            <span>
              <i class="fas fa-coins"></i>
              {{ form.price_credits }} Credits
            </span>
          </div>

          <div class="preview-description">
            <h3>Description</h3>
            <p>{{ form.description }}</p>
          </div>

          <div v-if="form.images.length" class="preview-images">
            <h3>Images</h3>
            <div class="image-gallery">
              <img 
                v-for="(image, index) in form.images"
                :key="index"
                :src="image.url"
                :alt="`Image ${index + 1}`"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
            <div class="form-group">
              <label for="category">Category*</label>
              <select id="category" v-model="form.category" required>
                <option value="">Select Category</option>
                <option value="single-engine">Single Engine</option>
                <option value="multi-engine">Multi Engine</option>
                <option value="turboprop">Turboprop</option>
                <option value="jet">Jet</option>
                <option value="helicopter">Helicopter</option>
              </select>
            </div>

            <div class="form-group">
              <label for="price">Price (USD)*</label>
              <input 
                type="number" 
                id="price" 
                v-model="form.price" 
                required
                min="0"
                step="1000"
              >
            </div>
          </div>
        </div>

        <!-- Technical Details -->
        <div class="form-section">
          <h2>Technical Details</h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="registration">Registration Number</label>
              <input 
                type="text" 
                id="registration" 
                v-model="form.registration" 
                placeholder="e.g., N12345"
              >
            </div>

            <div class="form-group">
              <label for="total_time">Total Time (hours)</label>
              <input 
                type="number" 
                id="total_time" 
                v-model="form.total_time"
                min="0"
              >
            </div>

            <div class="form-group">
              <label for="engine_hours">Engine Hours</label>
              <input 
                type="number" 
                id="engine_hours" 
                v-model="form.engine_hours"
                min="0"
              >
            </div>

            <div class="form-group">
              <label for="condition">Condition*</label>
              <select id="condition" v-model="form.condition" required>
                <option value="">Select Condition</option>
                <option value="new">New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="form-section">
          <h2>Location</h2>
          
          <div class="form-group">
            <label for="location">Location*</label>
            <input 
              type="text" 
              id="location" 
              v-model="form.location" 
              required
              placeholder="e.g., Toronto, ON, Canada"
            >
          </div>
        </div>

        <!-- Description -->
        <div class="form-section">
          <h2>Description</h2>
          
          <div class="form-group">
            <label for="description">Description*</label>
            <textarea 
              id="description" 
              v-model="form.description" 
              required
              rows="6"
              placeholder="Provide detailed information about your aircraft..."
            ></textarea>
          </div>
        </div>

        <!-- Submit -->
        <div class="form-actions">
          <button 
            type="button" 
            class="cancel-btn" 
            @click="router.back()"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="isLoading"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <span v-else>Create Listing</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const isLoading = ref(false)

const form = ref({
  title: '',
  manufacturer: '',
  model: '',
  year: new Date().getFullYear(),
  category: '',
  price: '',
  registration: '',
  total_time: '',
  engine_hours: '',
  condition: '',
  location: '',
  description: ''
})

async function handleSubmit() {
  if (!auth.isAuthenticated()) {
    router.push('/login')
    return
  }

  try {
    isLoading.value = true

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify(form.value)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error)
    }

    router.push(`/listings/${data.listing.id}`)
  } catch (error) {
    console.error('Failed to create listing:', error)
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.new-listing {
  min-height: 100vh;
  padding: 2rem;
  background: var(--background-primary);
}

.listing-container {
  max-width: 1000px;
  margin: 0 auto;
  padding-top: 60px;
}

.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Header */
.listing-header {
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.listing-header h1 {
  margin: 0;
  color: var(--text-color);
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.header-actions button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s;
}

.header-actions button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.preview-btn {
  background: var(--background-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.save-draft-btn {
  background: var(--background-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.publish-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.publish-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Form */
.listing-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  padding: 2rem;
}

.form-section h2 {
  margin: 0 0 1.5rem;
  color: var(--text-color);
  font-size: 1.25rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-row:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  font-weight: 500;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-color);
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.error {
  border-color: var(--error-color);
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: var(--error-color);
  font-size: 0.875rem;
}

/* Image Upload */
.image-upload {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.image-dropzone {
  padding: 3rem 2rem;
  border: 2px dashed var(--border-color);
  border-radius: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.image-dropzone:hover,
.image-dropzone.drag-over {
  border-color: var(--primary-color);
  background: rgba(var(--primary-rgb), 0.05);
}

.image-dropzone i {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.image-dropzone p {
  margin: 0 0 0.5rem;
  color: var(--text-color);
  font-size: 1.125rem;
}

.image-dropzone span {
  color: var(--text-light);
  font-size: 0.875rem;
}

.hidden {
  display: none;
}

.image-previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.image-preview {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 0.5rem;
  overflow: hidden;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.remove-image:hover {
  background: rgba(0, 0, 0, 0.75);
}

/* Preview Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.preview-modal {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.preview-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: inherit;
  backdrop-filter: blur(10px);
}

.preview-header h2 {
  margin: 0;
  color: var(--text-color);
}

.close-btn {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--background-secondary);
  color: var(--text-color);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: var(--border-color);
}

.preview-content {
  padding: 2rem;
}

.preview-content h1 {
  margin: 0 0 1.5rem;
  color: var(--text-color);
}

.preview-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.preview-details span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
}

.preview-description h3 {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.preview-description p {
  margin: 0;
  color: var(--text-light);
  line-height: 1.6;
  white-space: pre-line;
}

.preview-images {
  margin-top: 2rem;
}

.preview-images h3 {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.image-gallery img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .new-listing {
    padding: 1rem;
  }

  .listing-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-actions {
    width: 100%;
  }

  .header-actions button {
    flex: 1;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .preview-details {
    justify-content: center;
  }
}
</style> 