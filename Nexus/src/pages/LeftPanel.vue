<template class="left-panel">
  <q-drawer class="bg-gradient-primary" v-model="leftDrawerOpen" show-if-above>
    <q-list>
      <div class="row justify-between q-pa-md q-mb-md">
        <div
          style="width: 60px; height: 60px; border-radius: 18px"
          class="row items-center justify-center bg-gradient-secondary"
        >
          <img src="~assets/Icon.svg" alt="Icon" width="40px" height="40px" />
        </div>
        <q-item-label header class="text-light"> Nexus </q-item-label>

        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
      </div>

      <GroupItem v-for="link in linksList" :key="link.name" v-bind="link" class="text-light" />
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GroupItem, { type GroupProps } from 'components/GroupItem.vue';
const leftDrawerOpen = ref(false);

const linksList: GroupProps[] = [
  {
    icon: 'svguse:@/favourites.svg',
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
