<template>
  <q-header
    class="bg-white q-py-sm q-pt-md"
    bordered
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    v-if="selectedGroup?.name"
  >
    <q-toolbar class="q-py-xs">
      <q-avatar>
        <img src="/src/assets/GroupDefault.svg" alt="avatar" />
      </q-avatar>
      <q-toolbar-title class="text-dark q-pl-md">{{ selectedGroup?.name }}</q-toolbar-title>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useGroupsStore } from 'src/stores/drawer/groups';
import { useScrollHandling } from '../composables/useScrollHandling';

const { onMouseEnter, onMouseLeave } = useScrollHandling('.q-header');
const groups = useGroupsStore();

const selectedGroup = computed(() => groups.selected);

watch(selectedGroup, (val) => {
  document.title = val ? `${val.name} – Nexus` : 'Nexus';
});
</script>
