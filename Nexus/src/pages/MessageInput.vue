<template>
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
