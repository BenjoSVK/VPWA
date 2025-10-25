<template>
  <q-page v-if="selectedGroup?.name" class="column col" style="height: calc(100dvh - 65px)">
    <q-scroll-area
      ref="saRef"
      class="col"
      :thumb-style="{ display: 'none' }"
      :bar-style="{ display: 'none' }"
    >
      <q-infinite-scroll @load="onLoad" :offset="250" :disable="!hasMoreMessages" :reverse="true">
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>

        <div class="q-px-md q-pt-md q-pb-lg">
          <template v-if="selectedGroup?.name">
            <q-chat-message
              v-for="(message, index) in messages"
              :key="message.id || index"
              :text="[message.text]"
              :sent="message.sent"
              :name="message.name"
              :avatar="message.avatar"
              :bg-color="message.sent ? 'tertiary' : 'grey-4'"
              :text-color="message.sent ? 'white' : undefined"
            />

            <!-- Quasar typing indikátor -->
            <q-chat-message
              v-if="showTyping"
              :sent="false"
              :name="typingUser"
              :avatar="typingAvatar"
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

    <!-- Input field -->
    <div
      id="Input-field"
      class="row items-center q-pb-md q-px-md"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
      <q-input
        v-model="search"
        rounded
        outlined
        :placeholder="search.startsWith('/') ? 'Príkaz: /list' : 'Write a message'"
        class="q-py-md q-pl-sm q-pr-md col"
        input-style="padding-left: 12px"
        @keyup.enter="sendMessage"
        :color="search.startsWith('/') ? 'primary' : undefined"
        @click.stop
      >
        <template #append>
          <q-btn flat class="q-pa-none">
            <img src="src/assets/EmojiIcon.svg" alt="search" />
          </q-btn>
        </template>
      </q-input>
      <q-btn
        class="bg-primary q-pa-md q-mx-xs"
        rounded
        :disable="!search.trim()"
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
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import type { Message } from 'src/components/models';

const search = ref('');
const hasMoreMessages = ref(true);
const currentPage = ref(1);
const pageSize = 20;

// Quasar typing indikátor
const showTyping = ref(false);
const typingUser = ref('John');
const typingAvatar = ref('https://cdn.quasar.dev/img/avatar4.jpg');

const groups = useGroupsStore();
const chat = useChatStore();
const { selectedId } = storeToRefs(groups);
const selectedGroup = computed(() => groups.selected);

// Použij správy z chat store
const messages = computed(() => chat.messagesForSelected);

const { saRef } = useAutoScroll(selectedId);
const { onMouseEnter, onMouseLeave } = useScrollHandling('#Input-field');

// Načítanie správ z chat store s pagináciou
const loadMessages = async (page: number, size?: number): Promise<Message[]> => {
  // Simulácia API volania
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

// Inicializácia prvých správ
const initializeMessages = () => {
  // Správy sa načítajú automaticky cez computed property
  currentPage.value = 2; // Ďalšia stránka bude 2
};

// Funkcia pre zobrazenie používateľov v paneli
const displayUsersInPanel = () => {
  // Emit event alebo použij global state pre zobrazenie používateľov
  // Pre jednoduchosť použijem window event
  window.dispatchEvent(new CustomEvent('show-users'));
};

// Odoslanie správy
const sendMessage = () => {
  if (!search.value.trim() || !selectedId.value) return;

  const messageText = search.value.trim();

  // Skontroluj či je to /list príkaz
  if (messageText === '/list') {
    chat.addMessage(selectedId.value, 'Zobrazujem používateľov...', true);

    // Zobraz používateľov v pravom paneli
    displayUsersInPanel();
  } else {
    // Normálna správa
    chat.addMessage(selectedId.value, messageText, true);
  }

  // Vyčisti input
  search.value = '';
};

// Inicializuj správy pri zmene skupiny
watch(
  selectedId,
  () => {
    if (selectedId.value) {
      currentPage.value = 1;
      hasMoreMessages.value = true;
      initializeMessages();

      // Spusti Quasar typing indikátor po 3 sekundách
      setTimeout(
        () => {
          showTyping.value = true;

          // Skry typing indikátor po 5 sekundách
          setTimeout(() => {
            showTyping.value = false;
          }, 50000000);
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
</style>
