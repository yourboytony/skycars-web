<template>
  <div class="messages">
    <div class="messages-container">
      <!-- Header -->
      <div class="messages-header glass">
        <h1>Messages</h1>
        <div class="header-stats">
          <span class="unread-count" v-if="unreadCount">
            {{ unreadCount }} unread
          </span>
        </div>
      </div>

      <!-- Messages List -->
      <div class="messages-content glass">
        <!-- Conversations List -->
        <div class="conversations-list">
          <div 
            v-for="conversation in groupedConversations"
            :key="conversation.id"
            class="conversation-item"
            :class="{ 
              active: selectedConversation?.id === conversation.id,
              unread: conversation.hasUnread 
            }"
            @click="selectConversation(conversation)"
          >
            <div class="conversation-avatar">
              {{ getInitials(conversation.otherUser.name) }}
            </div>
            <div class="conversation-details">
              <div class="conversation-header">
                <h3>{{ conversation.otherUser.name }}</h3>
                <span class="last-time">
                  {{ formatTime(conversation.lastMessage.created_at) }}
                </span>
              </div>
              <div class="conversation-preview">
                <p>{{ conversation.lastMessage.content }}</p>
                <div class="listing-ref">
                  Re: {{ conversation.listing.title }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="!conversations.length" class="empty-conversations">
            <i class="fas fa-comments"></i>
            <p>No messages yet</p>
          </div>
        </div>

        <!-- Message Thread -->
        <div class="message-thread">
          <template v-if="selectedConversation">
            <!-- Thread Header -->
            <div class="thread-header">
              <div class="thread-user">
                <div class="thread-avatar">
                  {{ getInitials(selectedConversation.otherUser.name) }}
                </div>
                <div class="thread-details">
                  <h2>{{ selectedConversation.otherUser.name }}</h2>
                  <p>{{ selectedConversation.listing.title }}</p>
                </div>
              </div>
              <router-link 
                :to="`/listings/${selectedConversation.listing.id}`"
                class="view-listing-btn"
              >
                View Listing
              </router-link>
            </div>

            <!-- Messages -->
            <div class="messages-list" ref="messagesList">
              <div 
                v-for="message in selectedConversation.messages"
                :key="message.id"
                class="message-bubble"
                :class="{ 
                  'sent': message.sender_id === auth.user.id,
                  'received': message.sender_id !== auth.user.id
                }"
              >
                <div class="message-content">
                  {{ message.content }}
                </div>
                <div class="message-time">
                  {{ formatTime(message.created_at) }}
                </div>
              </div>
            </div>

            <!-- Message Input -->
            <div class="message-input">
              <textarea 
                v-model="newMessage"
                placeholder="Type a message..."
                @keydown.enter.prevent="sendMessage"
                rows="1"
                ref="messageInput"
              ></textarea>
              <button 
                class="send-btn"
                :disabled="!newMessage.trim()"
                @click="sendMessage"
              >
                <i class="fas fa-paper-plane"></i>
              </button>
            </div>
          </template>

          <div v-else class="no-conversation-selected">
            <i class="fas fa-comments"></i>
            <h2>Select a conversation</h2>
            <p>Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useMarketplaceStore } from '../stores/marketplace'

const auth = useAuthStore()
const marketplace = useMarketplaceStore()

const conversations = ref([])
const selectedConversation = ref(null)
const newMessage = ref('')
const messagesList = ref(null)
const messageInput = ref(null)

// Group messages into conversations
const groupedConversations = computed(() => {
  const groups = conversations.value.reduce((acc, message) => {
    const otherId = message.sender_id === auth.user.id 
      ? message.receiver_id 
      : message.sender_id

    const conversationId = `${message.listing_id}-${otherId}`
    
    if (!acc[conversationId]) {
      acc[conversationId] = {
        id: conversationId,
        listing: {
          id: message.listing_id,
          title: message.listing_title
        },
        otherUser: {
          id: otherId,
          name: message.sender_id === auth.user.id 
            ? message.receiver_name 
            : message.sender_name
        },
        messages: [],
        hasUnread: false
      }
    }

    acc[conversationId].messages.push(message)
    if (!message.read && message.receiver_id === auth.user.id) {
      acc[conversationId].hasUnread = true
    }

    return acc
  }, {})

  return Object.values(groups).sort((a, b) => {
    const aTime = new Date(a.messages[a.messages.length - 1].created_at)
    const bTime = new Date(b.messages[b.messages.length - 1].created_at)
    return bTime - aTime
  }).map(conv => ({
    ...conv,
    lastMessage: conv.messages[conv.messages.length - 1]
  }))
})

const unreadCount = computed(() => 
  conversations.value.filter(m => 
    !m.read && m.receiver_id === auth.user.id
  ).length
)

// Fetch messages
async function fetchMessages() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/messages`,
      {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      }
    )
    const data = await response.json()
    if (response.ok) {
      conversations.value = data.messages
    }
  } catch (error) {
    console.error('Failed to fetch messages:', error)
  }
}

// Select conversation
function selectConversation(conversation) {
  selectedConversation.value = conversation
  markAsRead(conversation)
  nextTick(() => {
    scrollToBottom()
    messageInput.value?.focus()
  })
}

// Mark messages as read
async function markAsRead(conversation) {
  const unreadMessages = conversation.messages.filter(m => 
    !m.read && m.receiver_id === auth.user.id
  )

  for (const message of unreadMessages) {
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/messages/${message.id}/read`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        }
      )
      message.read = true
    } catch (error) {
      console.error('Failed to mark message as read:', error)
    }
  }
}

// Send message
async function sendMessage() {
  if (!newMessage.value.trim()) return

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver_id: selectedConversation.value.otherUser.id,
          listing_id: selectedConversation.value.listing.id,
          content: newMessage.value
        })
      }
    )
    const data = await response.json()
    
    if (response.ok) {
      conversations.value.push(data.message)
      newMessage.value = ''
      nextTick(() => {
        scrollToBottom()
      })
    }
  } catch (error) {
    console.error('Failed to send message:', error)
    alert('Failed to send message. Please try again.')
  }
}

// Helper functions
function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function formatTime(date) {
  const messageDate = new Date(date)
  const now = new Date()
  
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    })
  }
  
  if (now.getTime() - messageDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
    return messageDate.toLocaleDateString('en-US', { weekday: 'short' })
  }
  
  return messageDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

function scrollToBottom() {
  if (messagesList.value) {
    messagesList.value.scrollTop = messagesList.value.scrollHeight
  }
}

// Auto-resize textarea
function resizeTextarea() {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto'
    messageInput.value.style.height = messageInput.value.scrollHeight + 'px'
  }
}

// Watchers
watch(newMessage, resizeTextarea)

// Lifecycle
onMounted(() => {
  fetchMessages()
})
</script> 

<style scoped>
.messages {
  min-height: 100vh;
  padding: 2rem;
  background: var(--background-primary);
}

.messages-container {
  max-width: 1200px;
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
.messages-header {
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.messages-header h1 {
  margin: 0;
  color: var(--text-color);
}

.unread-count {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border-radius: 1rem;
  font-size: 0.875rem;
}

/* Messages Content */
.messages-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  min-height: calc(100vh - 200px);
}

/* Conversations List */
.conversations-list {
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.conversation-item {
  padding: 1rem;
  display: flex;
  gap: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--border-color);
}

.conversation-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.conversation-item.active {
  background: rgba(var(--primary-rgb), 0.1);
}

.conversation-item.unread {
  background: rgba(var(--primary-rgb), 0.05);
}

.conversation-avatar {
  width: 3rem;
  height: 3rem;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  flex-shrink: 0;
}

.conversation-details {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
}

.conversation-header h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-time {
  color: var(--text-light);
  font-size: 0.75rem;
  flex-shrink: 0;
}

.conversation-preview {
  color: var(--text-light);
  font-size: 0.875rem;
}

.conversation-preview p {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.listing-ref {
  font-size: 0.75rem;
  color: var(--primary-color);
  margin-top: 0.25rem;
}

.empty-conversations {
  padding: 2rem;
  text-align: center;
  color: var(--text-light);
}

.empty-conversations i {
  font-size: 2rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

/* Message Thread */
.message-thread {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.thread-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.thread-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.thread-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.thread-details h2 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.125rem;
}

.thread-details p {
  margin: 0.25rem 0 0;
  color: var(--text-light);
  font-size: 0.875rem;
}

.view-listing-btn {
  padding: 0.5rem 1rem;
  background: var(--background-secondary);
  color: var(--text-color);
  border-radius: 0.5rem;
  text-decoration: none;
  font-size: 0.875rem;
  transition: transform 0.2s;
}

.view-listing-btn:hover {
  transform: translateY(-2px);
}

/* Messages List */
.messages-list {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-bubble {
  max-width: 70%;
  display: flex;
  flex-direction: column;
}

.message-bubble.sent {
  align-self: flex-end;
}

.message-bubble.received {
  align-self: flex-start;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  color: var(--text-color);
  line-height: 1.4;
}

.message-bubble.sent .message-content {
  background: var(--primary-color);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

.message-bubble.received .message-content {
  background: var(--background-secondary);
  border-bottom-left-radius: 0.25rem;
}

.message-time {
  font-size: 0.75rem;
  color: var(--text-light);
  margin-top: 0.25rem;
  align-self: flex-end;
}

/* Message Input */
.message-input {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}

.message-input textarea {
  flex: 1;
  padding: 0.75rem;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-color);
  font-size: 0.875rem;
  resize: none;
  max-height: 150px;
  line-height: 1.4;
}

.message-input textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.send-btn {
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.send-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* No Conversation Selected */
.no-conversation-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-light);
  padding: 2rem;
  text-align: center;
}

.no-conversation-selected i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.no-conversation-selected h2 {
  margin: 0 0 0.5rem;
  color: var(--text-color);
}

.no-conversation-selected p {
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .messages-content {
    grid-template-columns: 300px 1fr;
  }
}

@media (max-width: 768px) {
  .messages {
    padding: 1rem;
  }

  .messages-content {
    grid-template-columns: 1fr;
  }

  .conversations-list {
    display: none;
  }

  .conversations-list.active {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background: var(--background-primary);
  }

  .message-thread {
    display: none;
  }

  .message-thread.active {
    display: flex;
  }

  .thread-header {
    padding: 0.75rem;
  }

  .messages-list {
    padding: 0.75rem;
  }

  .message-input {
    padding: 0.75rem;
  }

  .message-bubble {
    max-width: 85%;
  }
}
</style> 