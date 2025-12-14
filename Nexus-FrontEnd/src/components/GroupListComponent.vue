<template>
  <q-list class="column">
    <!-- Loading state -->
    <div v-if="channels.loading" class="q-pa-md text-center">
      <q-spinner color="white" size="24px" />
    </div>

    <!-- Channel list -->
    <q-btn
      v-for="channel in sortedChannels"
      :key="channel.id"
      @click="selectChannel(channel)"
      align="left"
      flat
      :active="channels.selectedId === channel.id"
      class="q-my-xs border-rad"
      size="md"
      :class="[
        drw.isMini ? 'q-mx-md flex items-center' : 'q-mx-lg',
        channels.selectedId === channel.id ? 'active-group' : 'inactive-group',
        channel.isInvited ? 'invited-channel' : ''
      ]"
    >
      <template #default>
        <div class="row items-center full-width">
          <!-- Channel type icon -->
          <q-icon v-if="channel.isPrivate && !drw.isMini" size="18px" class="q-mr-sm">
            <img src="../assets/Lock.svg" alt="private" />
          </q-icon>
          <q-icon v-else-if="!drw.isMini" size="18px" class="q-mr-sm">
            <img
              src="../assets/public.svg"
              alt="public"
              style="filter: brightness(0) invert(1)"
            />
          </q-icon>

          <!-- Channel name -->
          <span v-if="!drw.isMini" class="text-weight-medium ellipsis" style="max-width: 180px">
            {{ channel.name }}
          </span>
          <span v-else class="text-weight-medium">
            {{ channel.name?.[0]?.toUpperCase() ?? '#' }}
          </span>

          <!-- Invited badge -->
          <div
            v-if="channel.isInvited && !drw.isMini"
            class="invite-badge q-ml-auto q-mr-sm"
          >
            <span class="text-caption text-weight-medium">Invited</span>
          </div>

          <!-- Admin badge -->
          <q-icon
            v-else-if="channel.isAdmin && !drw.isMini"
            name="img:src/assets/star.svg"
            size="14px"
            class="q-ml-auto q-mr-sm"
          >
            <q-tooltip>You are the admin</q-tooltip>
          </q-icon>

          <!-- Leave/Close button -->
          <q-icon
            v-if="channels.selectedId === channel.id && !drw.isMini && !channel.isInvited"
            name="img:src/assets/close.svg"
            size="18px"
            class="q-ml-auto cursor-pointer"
            style="filter: brightness(0) invert(1) opacity(0.5)"
            @click.stop="handleLeaveChannel(channel)"
          />
        </div>
      </template>
    </q-btn>
  </q-list>

  <!-- Confirm leave dialog -->
  <q-dialog v-model="showLeaveDialog">
    <q-card style="min-width: 300px; border-radius: 16px">
      <q-card-section class="row items-center">
        <img src="/src/assets/shield.svg" alt="warning" style="width: 24px; height: 24px;" class="q-mr-sm" />
        <span class="text-h6">{{ leaveDialogTitle }}</span>
      </q-card-section>
      <q-card-section>
        {{ leaveDialogMessage }}
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn 
          flat 
          :label="channelToLeave?.isAdmin ? 'Delete' : 'Leave'" 
          color="negative" 
          @click="confirmLeave" 
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDrawerStore } from 'src/stores/drawer/drawer';
import { useChannelsStore } from 'src/stores/channels/channels';
import type { Channel } from 'src/lib/api';

const drw = useDrawerStore();
const channels = useChannelsStore();

const showLeaveDialog = ref(false);
const channelToLeave = ref<Channel | null>(null);

const sortedChannels = computed(() => {
  const list = channels.sortedChannels;
  
  return [...list].sort((a, b) => {
    // Invited channels first
    if (a.isInvited && !b.isInvited) return -1;
    if (!a.isInvited && b.isInvited) return 1;
    
    // Then selected channel
    if (a.id === channels.selectedId) return -1;
    if (b.id === channels.selectedId) return 1;
    
    // Then alphabetically
    return a.name.localeCompare(b.name);
  });
});

const leaveDialogTitle = computed(() => {
  if (!channelToLeave.value) return '';
  return channelToLeave.value.isAdmin ? 'Delete Channel?' : 'Leave Channel?';
});

const leaveDialogMessage = computed(() => {
  if (!channelToLeave.value) return '';
  if (channelToLeave.value.isAdmin) {
    return `Are you sure you want to delete "${channelToLeave.value.name}"? This will remove the channel and all messages for all members.`;
  }
  return `Are you sure you want to leave "${channelToLeave.value.name}"?`;
});

async function selectChannel(channel: Channel) {
  if (channel.isInvited) {
    // Accept invitation
    await channels.joinChannel(channel.name);
  }
  channels.setSelected(channel.id);
}

function handleLeaveChannel(channel: Channel) {
  channelToLeave.value = channel;
  showLeaveDialog.value = true;
}

async function confirmLeave() {
  if (!channelToLeave.value) return;
  
  if (channelToLeave.value.isAdmin) {
    await channels.deleteChannel();
  } else {
    await channels.leaveChannel();
  }
  
  showLeaveDialog.value = false;
  channelToLeave.value = null;
}
</script>

<style lang="scss" scoped>
.active-group {
  background-color: rgba(111, 178, 255, 0.399);
  color: rgba(255, 255, 255, 0.95);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.inactive-group {
  background-color: transparent;
  color: rgba(255, 255, 255, 0.5);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.invited-channel {
  border-left: 3px solid #4caf50;
  animation: inviteGlow 2s ease-in-out infinite;
}

.invite-badge {
  background: rgba(76, 175, 80, 0.15);
  border: 1px solid rgba(76, 175, 80, 0.4);
  border-radius: 8px;
  padding: 2px 6px;
  display: flex;
  align-items: center;
  color: #4caf50;
  font-size: 10px;
  animation: invitePulse 2s ease-in-out infinite;
}

@keyframes invitePulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes inviteGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
  }
  50% {
    box-shadow: 0 0 8px 2px rgba(76, 175, 80, 0.3);
  }
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
