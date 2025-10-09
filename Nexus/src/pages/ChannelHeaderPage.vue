<template>
  <q-header class="bg-white q-pt-sm" bordered>
    <q-toolbar>
      <q-avatar>
        <img :src="GroupAvatar" alt="avatar" />
      </q-avatar>
      <q-toolbar-title class="text-dark q-pl-md"> Názov Skupiny </q-toolbar-title>
      <Search />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import GroupAvatar from 'src/assets/GroupDefault.svg';
import Search from 'src/components/SearchComponent.vue';
</script>
