<template>
  <q-page v-if="selectedGroup?.name" class="column col" style="height: calc(100dvh - 65px)">
    <q-scroll-area
      ref="saRef"
      class="col"
      :thumb-style="{ display: 'none' }"
      :bar-style="{ display: 'none' }"
    >
      <div class="q-px-md q-pt-md q-pb-lg">
        <q-chat-message :text="['hey, how are you?']" sent bg-color="tertiary" text-color="white" />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        />
        <q-chat-message :text="['hey, how are you?']" sent bg-color="tertiary" text-color="white" />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        />
        <q-chat-message :text="['hey, how are you?']" sent bg-color="tertiary" text-color="white" />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        />
        <q-chat-message :text="['hey, how are you?']" sent bg-color="tertiary" text-color="white" />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        />
        <q-chat-message :text="['hey, how are you?']" sent bg-color="tertiary" text-color="white" />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        />
        <q-chat-message :text="['hey, how are you?']" sent bg-color="tertiary" text-color="white" />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        />
        <q-chat-message :text="['hey, how are you?']" sent bg-color="tertiary" text-color="white" />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        />
        <q-chat-message :text="['hey, how are you?']" sent bg-color="tertiary" text-color="white" />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        />
        <q-chat-message :text="['hey, how are you?']" sent bg-color="tertiary" text-color="white" />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        />
        <q-chat-message :text="['hey, how are you?']" sent bg-color="tertiary" text-color="white" />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        /><q-chat-message
          :text="['hey, how are you?']"
          sent
          bg-color="tertiary"
          text-color="white"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        /><q-chat-message
          :text="['hey, how are you?']"
          sent
          bg-color="tertiary"
          text-color="white"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        /><q-chat-message
          :text="['hey, how are you?']"
          sent
          bg-color="tertiary"
          text-color="white"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        /><q-chat-message
          :text="['hey, how are you?']"
          sent
          bg-color="tertiary"
          text-color="white"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        /><q-chat-message
          :text="['hey, how are you?']"
          sent
          bg-color="tertiary"
          text-color="white"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        /><q-chat-message
          :text="['hey, how are you?']"
          sent
          bg-color="tertiary"
          text-color="white"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        /><q-chat-message
          :text="['hey, how are you?']"
          sent
          bg-color="tertiary"
          text-color="white"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        /><q-chat-message
          :text="['hey, how are you?']"
          sent
          bg-color="tertiary"
          text-color="white"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        /><q-chat-message
          :text="['hey, how are you?']"
          sent
          bg-color="tertiary"
          text-color="white"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        /><q-chat-message
          :text="['hey, how are you?']"
          sent
          bg-color="tertiary"
          text-color="white"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        /><q-chat-message
          :text="['hey, how are you?']"
          sent
          bg-color="tertiary"
          text-color="white"
        />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        />
        <q-chat-message :text="['hey, how are you?']" sent bg-color="tertiary" text-color="white" />
        <q-chat-message
          name="Jane"
          avatar="https://cdn.quasar.dev/img/avatar2.jpg"
          :text="['doing fine, how r you?']"
          bg-color="grey-4"
        />
      </div>
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
        debounce="500"
        placeholder="Write a message"
        class="q-py-md q-pl-sm q-pr-md col"
        input-style="padding-left: 12px"
      >
        <template #append>
          <q-btn flat class="q-pa-none">
            <img src="src/assets/EmojiIcon.svg" alt="search" />
          </q-btn>
        </template>
      </q-input>
      <q-btn class="bg-primary q-pa-md q-mx-xs" rounded>
        <img src="/src/assets/Icon_sent.svg" style="transform: translate(-1px, 1px)" />
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useScrollHandling, useAutoScroll } from '../composables/useScrollHandling';
import { useGroupsStore } from 'src/stores/drawer/groups';
// import { useChatStore } from 'src/stores/chat/chat';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
const search = ref('');

const groups = useGroupsStore();
const { selectedId } = storeToRefs(groups);
const selectedGroup = computed(() => groups.selected);

const { saRef } = useAutoScroll(selectedId);

const { onMouseEnter, onMouseLeave } = useScrollHandling('#Input-field');

// const chat = useChatStore();
// const messages = computed(() => chat.messagesForSelected);

// function onSend() {
//   chat.addMessage();
//   scrollToBottom();
// }
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
