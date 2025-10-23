<template>
  <q-header
    class="bg-white q-pt-sm"
    bordered
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    v-if="selectedGroup?.name"
  >
    <q-toolbar>
      <q-avatar>
        <img :src="GroupAvatar" alt="avatar" />
      </q-avatar>
      <q-toolbar-title class="text-dark q-pl-md">{{ selectedGroup?.name }}</q-toolbar-title>
      <Search />
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import GroupAvatar from 'src/assets/GroupDefault.svg';
import Search from 'src/components/SearchComponent.vue';
import { useGroupsStore } from 'src/stores/drawer/groups';
import { computed, watch } from 'vue';
import { useScrollHandling } from '../composables/useScrollHandling';

const { onMouseEnter, onMouseLeave } = useScrollHandling('.q-header');
const groups = useGroupsStore();

const selectedGroup = computed(() => groups.selected);

watch(selectedGroup, (val) => {
  document.title = val ? `${val.name} – Nexus` : 'Nexus';
});
</script>
