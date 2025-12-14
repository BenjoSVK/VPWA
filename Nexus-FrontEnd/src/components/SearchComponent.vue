<template>
  <div class="col">
    <q-input
      v-model="search"
      placeholder="Search users"
      outlined
      rounded
      dense
      debounce="500"
      class="q-pt-md q-pb-sm"
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
:deep(.q-field__label) {
  padding-top: 1.5px;
}
</style>
