<template>
  <c-Header v-if="selectedGroup?.name" />
  <c-Channels />
  <c-Chat v-if="selectedGroup?.name" />
  <c-Users v-if="selectedGroup?.name" />

  <c-InfoPage v-else />
</template>
<script setup lang="ts">
import cHeader from '../components/HeaderComponent.vue';
import cChannels from 'src/components/GroupsComponent.vue';
import cChat from 'src/components/ChatComponent.vue';
import cUsers from 'src/components/UsersComponent.vue';
import cInfoPage from 'src/components/InfoPageComponent.vue';
import { useGroupsStore } from 'src/stores/drawer/groups';
import { computed } from 'vue';

const groups = useGroupsStore();
const selectedGroup = computed(() => groups.selected);
</script>
