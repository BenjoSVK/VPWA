<template>
  <q-drawer
    class="bg-gradient-primary"
    :mini-width="80"
    :width="370"
    :mini="drw.isMini"
    :content-class="drw.isMini ? 'drawer--mini' : 'drawer--full'"
    :breakpoint="0"
    :overlay="!drw.isMini"
    v-model="drw.isOpen"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="justify-between column full-height">
      <div 
        class="items-center flex q-pt-md cursor-pointer" 
        :class="drw.isMini ? '' : 'q-px-lg row'"
        @click="goToInfoPage"
      >
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
            @click.stop="drw.toggleMini"
            aria-label="Menu"
          >
            <img :src="menuIcon" alt="menu-icon" class="q-pa-sm" />
          </button>
        </div>
      </div>

      <div class="col q-pt-md">
        <q-list padding>
          <q-item dense class="bg-transparent text-h6 text-white q-px-lg q-pb-md">
            <q-item-section avatar class="items-center justify-center q-pr-sm">
              <img src="/src/assets/groups.svg" width="25" height="25" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Skupiny</q-item-label>
            </q-item-section>
          </q-item>

          <div class="column">
            <q-btn
              v-for="g in groups.groups"
              @click="groups.setSelected(g.id)"
              align="left"
              :key="g.id"
              flat
              :active="groups.selectedId === g.id"
              class="q-my-xs border-rad"
              size="md"
              :class="[
                drw.isMini ? 'q-mx-md flex items-center' : 'q-mx-lg',
                groups.selectedId === g.id ? 'active-group' : 'inactive-group',
              ]"
            >
              <span v-if="!drw.isMini" class="text-weight-medium q-pl-sm">
                {{ g.name ?? 'Unknown' }}
              </span>
              <span v-else class="text-weight-medium">
                {{ g.name?.[0] ?? '•' }}
              </span>
            </q-btn>
          </div>
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
import { useScrollHandling } from '../composables/useScrollHandling';
import { useRouter } from 'vue-router';
import brandIcon from '../assets/Icon.svg';
import menuIcon from '../assets/menu.svg';

const drw = useDrawerStore();
const groups = useGroupsStore();
const router = useRouter();

const { onMouseEnter, onMouseLeave } = useScrollHandling('.q-drawer');

function goToInfoPage() {
  groups.setSelected('');
  router.push('/chat').catch(() => {
    console.error('Failed to navigate to chat');
  });
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
.active-group {
  background-color: rgba(111, 178, 255, 0.399);
  color: rgba(255, 255, 255, 0.95);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.inactive-group {
  background-color: transparent;
  color: rgba(255, 255, 255, 0.5);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
</style>
