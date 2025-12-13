<template>
  <q-page v-if="selectedChannel" class="column col" style="height: calc(100dvh - 65px)">
    <!-- Command result notification -->
    <q-banner v-if="commandResult" :class="bannerClass" class="q-mx-md q-mt-sm" rounded>
      <template v-slot:avatar>
        <img :src="bannerIcon" alt="status" style="width: 24px; height: 24px; filter: brightness(0) invert(1);" />
      </template>
      {{ commandResult.message }}
      <template v-slot:action>
        <q-btn flat color="white" label="Dismiss" @click="commandResult = null" />
      </template>
    </q-banner>

    <q-scroll-area
      ref="scrollAreaRef"
      :key="scrollAreaKey"
      class="col"
      :thumb-style="{ display: 'none' }"
      :bar-style="{ display: 'none' }"
    >
      <q-infinite-scroll @load="onLoadMore" :offset="250" :disable="!hasMoreMessages" reverse>
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <div class="q-px-md q-pt-md q-pb-lg">
          <!-- Messages -->
            <q-chat-message
            v-for="message in messages"
            :key="message.id"
            :sent="message.userId === currentUserId"
            :name="message.author?.nickName ?? 'Unknown'"
            :stamp="formatTime(message.createdAt)"
            :bg-color="getMessageBgColor(message)"
            :text-color="getMessageTextColor(message)"
            class="message-item"
          >
            <div v-html="formatMessageContent(message.content, message.userId === currentUserId)" />
            </q-chat-message>
        </div>
      </q-infinite-scroll>
    </q-scroll-area>

    <!-- Typing indicator -->
    <div v-if="typingText" class="q-px-md q-py-xs text-grey-6 text-caption typing-indicator">
      <q-spinner-dots size="16px" color="grey-6" class="q-mr-xs" />
      {{ typingText }}
    </div>

    <!-- Input field -->
    <div
      class="row items-center q-px-md q-pb-md q-pt-sm"
    >
      <q-input
        v-model="messageInput"
        rounded
        outlined
        :placeholder="inputPlaceholder"
        input-style="padding-left: 12px"
        class="col q-mr-sm"
        :loading="sending"
        @keyup.enter="handleSend"
        @update:model-value="handleTyping"
      >
        <template #prepend>
          <img 
            v-if="isCommand" 
            src="/src/assets/bolt_blue.svg" 
            alt="command"
            style="width: 18px; height: 18px;"
            class="q-ml-sm"
          />
        </template>
        <template #append>
          <q-btn
            flat
            dense
            rounded
            size="md"
            class="q-pa-none"
          >
            <img src="src/assets/EmojiIcon.svg" alt="emoji" />
          </q-btn>
        </template>
      </q-input>
      <q-btn
        rounded
        class="bg-primary q-pa-md"
        :disable="!messageInput.trim() || sending"
        :loading="sending"
        @click="handleSend"
      >
        <img src="/src/assets/Icon_sent.svg" style="transform: translate(-1px, 1px)" />
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { QScrollArea } from 'quasar'
import { useChannelsStore } from 'src/stores/channels/channels'
import { useMessagesStore } from 'src/stores/messages/messages'
import { useAuthStore } from 'src/stores/auth/auth'
import { executeCommand, isCommand as checkIsCommand, type CommandResult } from 'src/services/commandParser'
import type { Message } from 'src/lib/api'

const channels = useChannelsStore()
const messagesStore = useMessagesStore()
const auth = useAuthStore()

const scrollAreaRef = ref<InstanceType<typeof QScrollArea> | null>(null)
const messageInput = ref('')
const sending = ref(false)
const commandResult = ref<CommandResult | null>(null)

const selectedChannel = computed(() => channels.selected)
const messages = computed(() => messagesStore.currentMessages)
const hasMoreMessages = computed(() => messagesStore.hasMoreMessages)
const currentUserId = computed(() => auth.currentUserId)
const currentNickName = computed(() => auth.currentNickName)

// Key to force re-render of scroll area when channel changes
const scrollAreaKey = computed(() => `scroll-${channels.selectedId}-${messages.value.length > 0 ? 'loaded' : 'empty'}`)

const isCommand = computed(() => checkIsCommand(messageInput.value))

// Typing indicator
const typingText = computed(() => {
  const typers = channels.typingUsers
  if (typers.length === 0) return ''
  if (typers.length === 1) return `${typers[0]} is typing...`
  if (typers.length === 2) return `${typers[0]} and ${typers[1]} are typing...`
  return `${typers[0]} and ${typers.length - 1} others are typing...`
})

// Debounce typing notification
let typingTimeout: ReturnType<typeof setTimeout> | null = null

function handleTyping() {
  if (isCommand.value) return // Don't send typing for commands
  
  // Debounce: only send typing status every 3 seconds
  if (!typingTimeout) {
    void channels.sendTyping()
    typingTimeout = setTimeout(() => {
      typingTimeout = null
    }, 3000)
  }
}

const inputPlaceholder = computed(() => {
  if (isCommand.value) return 'Enter command...'
  return 'Write a message or /help for commands'
})

const bannerClass = computed(() => {
  if (!commandResult.value) return ''
  switch (commandResult.value.type) {
    case 'success': return 'bg-positive text-white'
    case 'error': return 'bg-negative text-white'
    case 'info': return 'bg-info text-white'
    default: return 'bg-grey-7 text-white'
  }
})

const bannerIcon = computed(() => {
  if (!commandResult.value) return '/src/assets/chat.svg'
  switch (commandResult.value.type) {
    case 'success': return '/src/assets/check.svg'
    case 'error': return '/src/assets/close.svg'
    case 'info': return '/src/assets/chat.svg'
    default: return '/src/assets/chat.svg'
  }
})

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  
  if (isToday) {
    return date.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('sk-SK', { 
    day: '2-digit', 
    month: '2-digit',
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

function formatMessageContent(content: string, isOwnMessage: boolean): string {
  // Highlight @mentions - use different color for own messages (white bg) vs others (blue)
  const mentionClass = isOwnMessage ? 'mention-own' : 'mention-other'
  return content.replace(/@(\w+)/g, `<strong class="${mentionClass}">@$1</strong>`)
}

function getMessageBgColor(message: Message): string {
  const isMentioned = message.mentionedUsers?.includes(currentNickName.value ?? '')
  
  if (message.userId === currentUserId.value) {
    return 'primary'
  }
  if (isMentioned) {
    return 'amber-2'
  }
  return 'grey-3'
}

function getMessageTextColor(message: Message): string {
  if (message.userId === currentUserId.value) {
    return 'white'
  }
  return 'grey-9'
}

async function handleSend() {
  const text = messageInput.value.trim()
  if (!text || sending.value) return

  sending.value = true
  commandResult.value = null

  try {
    if (checkIsCommand(text)) {
      const result = await executeCommand(text)
      if (result) {
        commandResult.value = result
        // Auto-hide success messages after 3 seconds
        if (result.type === 'success') {
          setTimeout(() => {
            if (commandResult.value === result) {
              commandResult.value = null
            }
          }, 3000)
        }
      }
    } else {
      await messagesStore.sendMessage(text)
      scrollToBottom()
    }
    
    messageInput.value = ''
  } catch (error) {
    console.error('Error sending:', error)
    commandResult.value = {
      success: false,
      message: 'Failed to send message',
      type: 'error'
    }
  } finally {
    sending.value = false
  }
}

async function onLoadMore(index: number, done: (stop?: boolean) => void) {
  if (!channels.selectedId) {
    done(true)
    return
  }

  try {
    await messagesStore.fetchMessages(channels.selectedId, true)
    done(!hasMoreMessages.value)
  } catch (error) {
    console.error('Error loading more messages:', error)
    done(true)
  }
}

function scrollToBottom() {
  setTimeout(() => {
    const scrollTarget = scrollAreaRef.value?.getScrollTarget()
    if (scrollTarget) {
      scrollTarget.scrollTo({
        top: scrollTarget.scrollHeight,
        behavior: 'instant'
      })
    }
  }, 50)
}

// Watch for channel changes - scroll to bottom on initial load
watch(() => channels.selectedId, async (newId) => {
  if (newId) {
    commandResult.value = null
    await messagesStore.fetchMessages(newId)
    messagesStore.setupRealtimeSubscription(newId)
    
    // Start typing indicator polling
    channels.startTypingPolling()
    
    // Scroll to bottom after initial load (multiple attempts for Safari)
    await nextTick()
    setTimeout(scrollToBottom, 100)
    setTimeout(scrollToBottom, 300)
  } else {
    channels.stopTypingPolling()
  }
}, { immediate: true })

// Request notification permission on mount
onMounted(() => {
  void messagesStore.requestNotificationPermission()
})

// Cleanup on unmount
onUnmounted(() => {
  messagesStore.cleanup()
  channels.stopTypingPolling()
})
</script>

<style lang="scss" scoped>
.message-item {
  :deep(.q-message-text) {
    white-space: pre-wrap;
    word-break: break-word;
  }
  
  :deep(.mention-own) {
    color: #bbdefb; // Light blue on dark blue background
    font-weight: bold;
  }
  
  :deep(.mention-other) {
    color: #1976d2; // Primary blue on light background
    font-weight: bold;
  }
}

.typing-indicator {
  display: flex;
  align-items: center;
  font-style: italic;
}
</style>
