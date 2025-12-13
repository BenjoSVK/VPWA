<template>
  <c-Header v-if="selectedChannel" />
  <c-Channels />
  <c-Chat />
  <c-Users v-if="selectedChannel && channels.showUsersList" />

  <c-InfoPage v-if="!selectedChannel" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import cHeader from '../components/HeaderComponent.vue';
import cChannels from 'src/components/GroupsComponent.vue';
import cChat from 'src/components/ChatComponent.vue';
import cUsers from 'src/components/UsersComponent.vue';
import cInfoPage from 'src/components/InfoPageComponent.vue';
import { useChannelsStore } from 'src/stores/channels/channels';
import { useAuthStore } from 'src/stores/auth/auth';

const channels = useChannelsStore();
const auth = useAuthStore();

const selectedChannel = computed(() => channels.selected);

onMounted(async () => {
  // Initialize auth if not already done
  await auth.initialize();
  
  // Fetch channels
  await channels.fetchChannels();
  
  // Setup realtime subscription
  channels.setupRealtimeSubscription();
});

onUnmounted(() => {
  // Stop polling when leaving the page
  channels.stopPolling();
});
</script>
