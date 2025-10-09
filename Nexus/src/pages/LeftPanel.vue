<template>
  <q-drawer
    class="bg-gradient-primary"
    :width="370"
    show-if-above
    :mini="ui.drawerState"
    :mini-width="80"
    bordered
  >
    <div class="justify-between column full-height">
      <div class="items-center flex" :class="ui.drawerState ? 'q-pt-md' : 'q-py-md q-px-lg row'">
        <div
          class="items-center justify-center bg-gradient-secondary row logo q-pa-sm border-rad"
          v-if="!ui.drawerState"
        >
          <img src="/src/assets/Icon.svg" alt="Icon" />
        </div>
        <div
          class="col row items-center align-center"
          :class="ui.drawerState ? 'justify-center' : 'justify-between'"
        >
          <q-item-label header class="text-h6 text-light q-pl-md text-weight-bold">
            Nexus
          </q-item-label>
          <button
            class="hamburger-icon border-rad flex q-pa-xs"
            @click="ui.toggleDrawer"
            aria-label="Menu"
          >
            <img src="/src/assets/menu.svg" alt="menu-icon" class="q-pa-sm" />
          </button>
        </div>
      </div>
      <div class="col" :class="ui.drawerState ? 'q-mt-md' : 'q-pt-md'">
        <Groups
          v-for="link in linksList"
          :key="link.name"
          v-bind="link"
          class="text-light q-pa-none text-weight-medium"
        />
      </div>
      <div>
        <div>
          <Panel />
        </div>
        <div :class="ui.drawerState ? 'q-py-lg' : 'q-pa-lg'">
          <Profile />
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import Groups, { type GroupsProps } from 'components/GroupsComponent.vue';
import Profile from 'components/ProfileComponent.vue';
import Panel from 'components/PanelComponent.vue';
import { useDrawerStore } from 'src/stores/drawer';

const ui = useDrawerStore();

const linksList: GroupsProps[] = [
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
.hamburger-icon {
  background-color: rgba(255, 255, 255, 0.1);
}
.hamburger-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transition: background-color 0.3s ease;
}
.logo > img {
  width: 25px;
  height: 25px;
}
@import '../css/index.scss';
</style>
