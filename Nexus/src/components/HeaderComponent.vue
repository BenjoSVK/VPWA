<template>
  <q-header
    class="bg-white q-pt-sm"
    bordered
    @mouseenter="onDrawerMouseEnter"
    @mouseleave="onDrawerMouseLeave"
  >
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
function onDrawerMouseEnter() {
  document.body.style.overflow = 'hidden';
  const drawer = document.querySelector('.q-header');
  if (drawer) {
    (drawer as HTMLElement).style.overflow = 'auto';
  }
}

function onDrawerMouseLeave() {
  document.body.style.overflow = '';
  const drawer = document.querySelector('.q-header');
  if (drawer) {
    (drawer as HTMLElement).style.overflow = '';
  }
}
</script>
