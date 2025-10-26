<template>
  <q-page v-if="selectedGroup?.name" class="column col" style="height: calc(100dvh - 65px)">
    <q-scroll-area
      ref="saRef"
      class="col"
      :thumb-style="{ display: 'none' }"
      :bar-style="{ display: 'none' }"
    >
      <q-infinite-scroll @load="onLoad" :offset="250" :disable="!hasMoreMessages" reverse>
        <!-- Loading indicator when waiting to load more messages -->
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner color="primary" name="dots" size="40px" />
          </div>
        </template>

        <!-- Chat messages -->
        <div class="q-px-md q-pt-md q-pb-lg">
          <template v-if="selectedGroup?.name">
            <q-chat-message
              v-for="(message, index) in messages"
              :key="message.id || index"
              :text="[formatMessage(message.text)]"
              :sent="message.sent"
              :name="message.name"
              :avatar="message.avatar"
              :bg-color="message.sent ? 'tertiary' : 'grey-4'"
              :text-color="message.isPinged ? 'white' : message.sent ? 'white' : 'black'"
              class="ping-message"
            />
            <q-chat-message
              :text="['@Alice ahoj, ako sa máš?']"
              :sent="false"
              name="Anna"
              avatar="https://cdn.quasar.dev/img/avatar2.jpg"
              bg-color="grey-4"
              text-color="primary"
              class="ping-message"
            />

            <!-- Invite message example -->
            <q-chat-message
              :sent="false"
              name="Admin"
              avatar="https://cdn.quasar.dev/img/avatar1.jpg"
              bg-color="green-2"
              text-color="green-8"
            >
              <template #default>
                <div class="row items-center justify-between full-width">
                  <div class="col">
                    <div class="text-weight-medium">Pozvánka do skupiny</div>
                    <div class="text-caption text-grey-6 q-mr-sm">
                      @Alice, tím „Developers" ťa pozýva, aby si sa pripojila! Klikni a pridaj sa.
                    </div>
                  </div>
                  <div class="invite-badge">
                    <q-icon name="img:src/assets/plus.svg" size="18px" class="q-mr-xs" />
                    <span class="text-caption text-weight-medium">Invited</span>
                  </div>
                </div>
              </template>
            </q-chat-message>

            <!-- Typing indicator for the user who is typing, only shows when the user is typing -->
            <q-chat-message
              v-if="showTyping"
              :sent="false"
              name="John"
              avatar="https://cdn.quasar.dev/img/avatar4.jpg"
              bg-color="grey-4"
            >
              <template #default>
                <span>
                  Is typing
                  <q-spinner-dots size="1rem" class="q-ml-none q-pl-none q-pt-xs" />
                </span>
              </template>
            </q-chat-message>
          </template>
        </div>
      </q-infinite-scroll>
    </q-scroll-area>

    <!-- Input field and send button -->
    <div
      id="Input-field"
      :class="{ 'q-pb-lg': !drw.isMini }"
      class="row items-center q-px-md q-pb-md easy-out"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <q-input
        v-model="messageInput"
        rounded
        outlined
        placeholder="Write a message"
        input-style="padding-left: 12px"
        class="col q-pb-md q-pt-sm q-pl-sm q-pr-md"
        @keyup.enter="sendMessage"
        @click.stop
      >
        <template #append>
          <q-btn
            flat
            dense
            rounded
            size="md"
            class="q-pa-none"
            icon="img:src/assets/EmojiIcon.svg"
            alt="emoji"
          />
        </template>
      </q-input>
      <q-btn
        rounded
        class="bg-primary q-pa-md q-mx-xs q-mb-sm"
        :disable="!messageInput.trim()"
        @click="sendMessage"
      >
        <img src="/src/assets/Icon_sent.svg" style="transform: translate(-1px, 1px)" />
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useScrollHandling, useAutoScroll } from '../composables/useScrollHandling';
import { useGroupsStore } from 'src/stores/drawer/groups';
import { useChatStore } from 'src/stores/chat/chat';
import { computed, ref, watch, nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import type { Message } from 'src/components/models';
import { useDrawerStore } from 'src/stores/drawer/drawer';

const drw = useDrawerStore();
const groups = useGroupsStore();
const chat = useChatStore();

const { selectedId } = storeToRefs(groups);
const selectedGroup = computed(() => groups.selected);

const { saRef } = useAutoScroll(selectedId);
const { onMouseEnter, onMouseLeave } = useScrollHandling('#Input-field');

const messageInput = ref('');

// Typing indicator for the user who is typing, only shows when the user is typing
const showTyping = ref(false);
const hasMoreMessages = ref(true);
const currentPage = ref(1);
const pageSize = 20;

// Lokálny state pre načítané správy (infinite scroll)
const loadedMessages = ref<Message[]>([]);

// Použij lokálne načítané správy namiesto všetkých správ z store
const messages = computed(() => loadedMessages.value);

// Načítanie správ z chat store s pagináciou
const loadMessages = async (page: number, size?: number): Promise<Message[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allMessages = chat.messagesForSelected;
  const loadSize = size || pageSize;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + loadSize;

  return allMessages.slice(startIndex, endIndex);
};

// Infinite scroll handler
const onLoad = async (index: number, done: (stop?: boolean) => void) => {
  try {
    const newMessages = await loadMessages(currentPage.value);

    if (newMessages.length === 0) {
      hasMoreMessages.value = false;
      done(true);
      return;
    }

    // Pridať nové správy do lokálneho state
    loadedMessages.value = [...loadedMessages.value, ...newMessages];
    currentPage.value++;

    // Ak je menej správ ako pageSize, už nie sú ďalšie
    if (newMessages.length < pageSize) {
      hasMoreMessages.value = false;
    }

    done();
  } catch (error) {
    console.error('Error loading messages:', error);
    done(true);
  }
};

// Inicializácia prvých správ - okamžite bez oneskorenia
const initializeMessages = () => {
  // Načítať prvú stránku správ okamžite
  const allMessages = chat.messagesForSelected;
  const firstPageMessages = allMessages.slice(0, pageSize);

  loadedMessages.value = firstPageMessages;
  currentPage.value = 2; // Ďalšia stránka bude 2

  // Ak je menej správ ako pageSize, už nie sú ďalšie
  if (firstPageMessages.length < pageSize) {
    hasMoreMessages.value = false;
  }
};

const formatMessage = (text: string) => {
  // zvýrazni mená, ktoré boli pingnuté (napr. /ping John)
  return text.replace(/\/ping\s+(\w+)/gi, (_, nick) => `@${nick}`);
};

// Funkcia pre zobrazenie používateľov v paneli
const displayUsersInPanel = () => {
  window.dispatchEvent(new CustomEvent('show-users'));
};

// Odoslanie správy
const sendMessage = async () => {
  if (!messageInput.value.trim() || !selectedId.value) return;

  const messageText = messageInput.value.trim();

  // Skontroluj či je to /list príkaz
  if (messageText === '/list') {
    console.log('List of users');
    // Zobraz používateľov v pravom paneli
    displayUsersInPanel();
  } else {
    const msg = chat.addMessage(selectedId.value, messageText, true);

    // zobraz ju hneď v lokálnom zozname
    loadedMessages.value = [...loadedMessages.value, msg];

    await nextTick();
    const scrollTarget = saRef.value?.getScrollTarget();
    if (scrollTarget) {
      scrollTarget.scrollTo({
        top: scrollTarget.scrollHeight,
        behavior: 'smooth',
      });
    }
  }

  messageInput.value = '';
};

// Inicializuju sa správy pri zmene skupiny
watch(
  selectedId,
  () => {
    if (selectedId.value) {
      // Reset lokálneho state
      loadedMessages.value = [];
      currentPage.value = 1;
      hasMoreMessages.value = true;
      initializeMessages(); // Okamžite bez await

      // Spusti Quasar typing indikátor po 3 sekundách
      setTimeout(
        () => {
          showTyping.value = true;
        },
        Math.floor(Math.random() * 4000) + 1000,
      );
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
:deep(.q-scrollarea__container) {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
}

:deep(.q-scrollarea__content) {
  overscroll-behavior: none;
}

:deep(.q-scrollarea) {
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
}
.easy-out {
  transition: all 0.2s ease-out;
}
.ping-message {
  transition: background-color 0.4s ease;
}

.ping-message[style*='accent'],
.ping-message[style*='orange-3'] {
  animation: pingFlash 1s ease-out;
}

.invite-badge {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.3);
  border-radius: 12px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  color: #4caf50;
}

@keyframes pingFlash {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 20px 6px rgba(255, 165, 0, 0.5);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(255, 165, 0, 0);
  }
}

@keyframes inviteGlow {
  0% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
  }
  50% {
    box-shadow: 0 0 15px 4px rgba(76, 175, 80, 0.3);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
}
</style>
