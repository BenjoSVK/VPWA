<template>
  <q-drawer
    class="bg-gradient-primary"
    show-if-above
    :mini="ui.drawerState"
    :mini-width="80"
    bordered
  >
    <div class="justify-between column full-height">
      <div class="items-center flex" :class="ui.drawerState ? 'q-pt-md' : 'q-py-md q-px-lg row'">
        <div
          class="items-center justify-center bg-gradient-secondary logo row shadow-xs"
          v-if="!ui.drawerState"
        >
          <img src="/src/assets/Icon.svg" alt="Icon" />
        </div>
        <div
          class="col row items-center align-center"
          :class="ui.drawerState ? 'justify-center' : 'justify-between'"
        >
          <q-item-label header class="text-h6 text-light logo-label"> Nexus </q-item-label>
          <div class="hamburger-menu">
            <button class="hamburger-btn" @click="ui.toggleDrawer" aria-label="Menu">
              <img src="/src/assets/menu.svg" alt="menu-icon" />
            </button>
          </div>
        </div>
      </div>
      <div class="col" :class="ui.drawerState ? 'q-mt-md' : 'q-pt-md'">
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
        <div :class="ui.drawerState ? 'q-py-lg' : 'q-pa-md'">
          <UserProfile />
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import GroupItem, { type GroupProps } from 'components/GroupItem.vue';
import UserProfile from 'components/UserProfileCard.vue';
import AdminPanel from 'components/AdminPanel.vue';
import { useDrawerStore } from 'src/stores/drawer';
//ui
const ui = useDrawerStore();

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
</script>

<style lang="scss" scoped>
@import '../css/leftpanel.scss';
</style>
