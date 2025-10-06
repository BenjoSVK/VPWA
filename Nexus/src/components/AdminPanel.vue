<template>
  <GroupItem
    icon="/src/assets/settings.svg"
    name="Settings"
    class="text-light"
    :class="drawerState ? 'q-py-none' : ''"
  />
</template>
<script setup lang="ts">
import GroupItem from 'components/GroupItem.vue';
import { useDrawerStore } from 'src/stores/drawer';
import { computed } from 'vue';

const ui = useDrawerStore();
const drawerState = computed(() => ui.drawerState);
</script>
