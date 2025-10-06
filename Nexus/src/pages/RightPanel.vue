<template>
  <q-drawer side="right" arial-label="Users online" show-if-above bordered :width="300">
    <p class="q-pa-md">Users online</p>
    <GroupItem v-for="link in linksList" :key="link.name" v-bind="link" />
  </q-drawer>
</template>
<script setup lang="ts">
import GroupItem, { type GroupProps } from 'components/GroupItem.vue';
const linksList: GroupProps[] = [
  {
    icon: 'svguse:/src/assets/favourites.svg',
    name: 'Favorites',
  },
  {
    icon: 'svguse:/src/assets/groups.svg',
    name: 'Groups',
  },
];
</script>
