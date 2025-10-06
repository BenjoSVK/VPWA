<template>
  <div class="search-box">
    <q-input
      v-model="search"
      rounded
      outlined
      dense
      debounce="500"
      placeholder="Search"
      class="q-pa-md"
    >
      <template #prepend>
        <img :src="searchIcon" alt="search" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import searchIcon from 'src/assets/SearchIcon.svg';
const search = ref('');
</script>

<style lang="scss" scoped>
@import '../css/index.scss';
</style>
