<template>
  <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
    <q-list>
      <q-item-label header> Nexus </q-item-label>

      <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

      <GroupItem v-for="link in linksList" :key="link.name" v-bind="link" />
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GroupItem, { type GroupProps } from 'components/GroupItem.vue';
const leftDrawerOpen = ref(false);

const linksList: GroupProps[] = [
  {
    icon: 'svguse:/src/assets/favourites.svg',
    name: 'Favorites',
    size: '30px',
  },
  {
    icon: 'svguse:/src/assets/groups.svg',
    name: 'Groups',
  },
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
