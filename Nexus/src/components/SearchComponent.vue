<template>
  <div class="search-box" :width="300">
    <q-input
      v-model="search"
      label="Search"
      rounded
      outlined
      dense
      debounce="500"
      class="q-pa-md"
      standout
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
.search-box {
  min-width: 300px;
  max-width: 600px;
}
</style>
