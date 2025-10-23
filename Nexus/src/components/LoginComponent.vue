<template>
  <q-input
    v-model="name"
    label="Search"
    rounded
    outlined
    dense
    debounce="500"
    class="q-pa-md"
    standout
  >
    <template #append>
      <q-btn flat class="q-pa-none">
        <img src="src/assets/EmojiIcon.svg" alt="search" />
      </q-btn>
    </template>
  </q-input>
</template>
<script setup lang="ts">
import { ref } from 'vue';
const name = ref('');
// const surname = ref('');
</script>
