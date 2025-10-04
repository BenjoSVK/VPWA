<template class="left-panel">
  <q-drawer class="bg-gradient-primary" show-if-above :mini="DrawerOpen" :mini-width="80" bordered>
    <div class="justify-between column full-height">
      <div class="items-center" :class="DrawerOpen ? 'q-pt-md' : 'q-py-md q-px-lg row'">
        <div
          class="items-center justify-center bg-gradient-secondary"
          :class="DrawerOpen ? 'logo-hidden logo-container' : 'logo-visible row shadow-xs'"
        >
          <img src="~assets/Icon.svg" alt="Icon" />
        </div>
        <div
          class="col row items-center align-center"
          :class="DrawerOpen ? 'justify-center' : 'justify-between'"
        >
          <q-item-label header class="text-h6 text-light logo-label"> Nexus </q-item-label>
          <div class="hamburger-menu">
            <button class="hamburger-btn" @click="toggleLeftDrawer" aria-label="Menu">
              <img src="/src/assets/menu.svg" alt="menu-icon" />
            </button>
          </div>
        </div>
      </div>
      <div class="col" :class="DrawerOpen ? 'q-mt-md' : 'q-pt-md'">
        <GroupItem
          v-for="link in linksList"
          :key="link.name"
          v-bind="link"
          class="text-light q-pa-none channel-name"
        />
      </div>
      <!-- Admin pannel && Profile card -->
      <div>
        <!-- Admin pannel-->
        <div>
          <AdminPanel />
        </div>
        <!-- Profile card -->
        <div class="q-pa-md">
          <UserProfile />
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GroupItem, { type GroupProps } from 'components/GroupItem.vue';
import UserProfile from 'components/UserProfileCard.vue';
import AdminPanel from 'components/AdminPanel.vue';
const DrawerOpen = ref(false);

const linksList: GroupProps[] = [
  {
    icon: '/src/assets/favourites.svg',
    name: 'Favorites',
  },
  {
    icon: '/src/assets/groups.svg',
    name: 'Groups',
  },
];

function toggleLeftDrawer() {
  DrawerOpen.value = !DrawerOpen.value;
}
</script>

<style lang="scss" scoped>
@import '../css/leftpanel.scss';
</style>
