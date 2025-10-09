<template>
  <Groups
    icon="/src/assets/settings.svg"
    name="Settings"
    class="text-light"
    :class="drawerState ? 'q-py-none' : ''"
  />
</template>
<script setup lang="ts">
import Groups from 'components/GroupsComponent.vue';
import { useDrawerStore } from 'src/stores/drawer';
import { computed } from 'vue';

const ui = useDrawerStore();
const drawerState = computed(() => ui.drawerState);
</script>
