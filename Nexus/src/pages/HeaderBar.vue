<template>
  <q-header class="bg-white" bordered>
    <q-toolbar>
      <GroupAvatar />
      <q-toolbar-title class="text-dark q-pl-md"> Favourites </q-toolbar-title>
      <SearchBar />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import GroupAvatar from 'src/components/GroupAvatar.vue';
import SearchBar from 'src/components/SearchBar.vue';
</script>
