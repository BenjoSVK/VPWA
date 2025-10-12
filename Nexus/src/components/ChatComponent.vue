<template>
  <div class="q-px-md q-pt-md justify-center">
    <div>
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
    </div>
  </div>
  <div class="flex q-pb-md q-pr-lg q-pl-sm items-center justify-center align-center">
    <q-input
      v-model="search"
      rounded
      outlined
      debounce="500"
      placeholder="Search"
      class="q-pa-md col"
      input-style="padding-left: 12px"
    >
      <template #append>
        <q-btn flat class="q-pa-none">
          <img :src="searchIcon" alt="search" />
        </q-btn>
      </template>
    </q-input>
    <q-btn class="bg-primary q-pa-md q-mx-sx" rounded>
      <img src="/src/assets/Icon_sent.svg" style="transform: translate(-1px, 1px)" />
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import searchIcon from 'src/assets/EmojiIcon.svg';
const search = ref('');
</script>
<style lang="scss" scoped>
@import '../css/index.scss';
</style>
