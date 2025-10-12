<template>
  <q-drawer
    show-if-above
    class="bg-gradient-primary"
    :mini-width="80"
    :width="370"
    :mini="drw.isMini"
    :content-class="drw.isMini ? 'drawer--mini' : 'drawer--full'"
    v-model="drw.isOpen"
    @mouseenter="onDrawerMouseEnter"
    @mouseleave="onDrawerMouseLeave"
  >
    <div class="justify-between column full-height">
      <div class="items-center flex q-pt-md" :class="drw.isMini ? '' : 'q-px-lg row'">
        <div
          class="items-center justify-center bg-gradient-secondary row q-pa-sm border-rad"
          v-show="!drw.isMini"
        >
          <img :src="brandIcon" alt="Icon" />
        </div>
        <div
          class="col row items-center align-center"
          :class="drw.isMini ? 'justify-center' : 'justify-between'"
        >
          <q-item-label
            v-show="!drw.isMini"
            header
            class="text-h6 text-light q-pl-md text-weight-bold"
          >
            Nexus
          </q-item-label>
          <button
            class="hamburger-icon border-rad flex q-pa-xs"
            @click="drw.toggleMini"
            aria-label="Menu"
          >
            <img :src="menuIcon" alt="menu-icon" class="q-pa-sm" />
          </button>
        </div>
      </div>

      <div class="col q-pt-md">
        <q-list padding>
          <q-item
            v-for="g in groups.groups"
            :key="g.id"
            :active="groups.selectedId === g.id"
            @click="groups.setSelected(g.id)"
            class="q-px-lg"
          >
            <q-item-section avatar class="items-center justify-center q-pr-md">
              <img :src="g.icon" :alt="g.name" width="25" height="25" />
            </q-item-section>
            <q-item-section v-show="!drw.isMini">
              <q-item-label class="text-light text-weight-medium">
                {{ g.name ?? 'Unknown' }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div>
        <div class="col flex items-center" :class="drw.isMini ? 'justify-center' : 'q-pl-lg'">
          <button class="hamburger-icon border-rad flex" :class="drw.isMini ? '' : 'q-mr-sm'">
            <img
              src="/src/assets/settings.svg"
              class="q-ma-sm user-settings"
              style="width: 20px; fill: #d1d5dc"
            />
          </button>
          <p v-if="!drw.isMini" class="text-subtitle2 text-grey-5 q-ma-none">Settings</p>
        </div>
        <div :class="drw.isMini ? 'q-py-lg' : 'q-pa-lg'">
          <InfoCard />
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import InfoCard from 'components/InfoCardComponent.vue';
import { useDrawerStore } from 'src/stores/drawer/drawer';
import { useGroupsStore } from '../stores/drawer/groups';
import brandIcon from '../assets/Icon.svg';
import menuIcon from '../assets/menu.svg';

const drw = useDrawerStore();
const groups = useGroupsStore();

function onDrawerMouseEnter() {
  document.body.style.overflow = 'hidden';
  const drawer = document.querySelector('.q-drawer');
  if (drawer) {
    (drawer as HTMLElement).style.overflow = 'auto';
  }
}

function onDrawerMouseLeave() {
  document.body.style.overflow = '';
  const drawer = document.querySelector('.q-drawer');
  if (drawer) {
    (drawer as HTMLElement).style.overflow = '';
  }
}
</script>

<style lang="scss" scoped>
.hamburger-icon {
  background-color: rgba(255, 255, 255, 0.1);
}
.hamburger-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transition: background-color 0.3s ease;
}
.user-settings {
  transition: transform 0.8s ease;
}
.hamburger-icon:hover .user-settings {
  transform: rotate(135deg);
}

@import '../css/index.scss';
</style>
