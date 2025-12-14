<template>
  <q-header
    class="bg-white q-py-sm q-pt-md"
    bordered
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    v-if="selectedChannel"
  >
    <q-toolbar class="q-py-xs">
      <q-avatar>
        <img src="/src/assets/GroupDefault.svg" alt="avatar" />
      </q-avatar>
      
      <div class="column q-pl-md">
        <q-toolbar-title class="text-dark q-pa-none" style="font-size: 1.1rem">
          {{ selectedChannel.name }}
        </q-toolbar-title>
        <div class="text-caption text-grey-6 row items-center">
          <q-icon v-if="selectedChannel.isPrivate" size="12px" class="q-mr-xs">
            <img src="/src/assets/Lock.svg" alt="private" style="width: 12px; height: 12px;" />
          </q-icon>
          <q-icon v-else size="12px" class="q-mr-xs">
            <img src="/src/assets/public.svg" alt="public" style="width: 12px; height: 12px;" />
          </q-icon>
          {{ selectedChannel.isPrivate ? 'Private' : 'Public' }}
          <span v-if="selectedChannel.isAdmin" class="q-ml-sm row items-center">
            <q-icon size="12px" class="q-mr-xs">
              <img src="/src/assets/star.svg" alt="admin" style="width: 12px; height: 12px;" />
            </q-icon>
            Admin
          </span>
        </div>
      </div>

      <q-space />

      <!-- Channel actions -->
      <q-btn flat round dense class="text-grey-7">
        <img src="/src/assets/menu.svg" alt="menu" style="width: 20px; height: 20px;" />
        <q-menu>
          <q-list style="min-width: 180px">
            <q-item clickable v-close-popup @click="showMembers = true">
              <q-item-section avatar>
                <img src="/src/assets/users.svg" alt="members" style="width: 20px; height: 20px;" />
              </q-item-section>
              <q-item-section>Members</q-item-section>
            </q-item>
            
            <q-separator v-if="selectedChannel.isAdmin" />
            
            <q-item 
              v-if="selectedChannel.isAdmin" 
              clickable 
              v-close-popup 
              @click="showInviteDialog = true"
            >
              <q-item-section avatar>
                <img src="/src/assets/plus.svg" alt="invite" style="width: 20px; height: 20px;" />
              </q-item-section>
              <q-item-section>Invite User</q-item-section>
            </q-item>

            <q-separator />
            
            <q-item 
              clickable 
              v-close-popup 
              @click="handleLeave"
              class="text-negative"
            >
              <q-item-section avatar>
                <img src="/src/assets/outBox.svg" alt="leave" style="width: 20px; height: 20px;" />
              </q-item-section>
              <q-item-section>
                {{ selectedChannel.isAdmin ? 'Delete Channel' : 'Leave Channel' }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>

  <!-- Members dialog -->
  <q-dialog v-model="showMembers">
    <q-card style="min-width: 350px; border-radius: 16px">
      <q-card-section class="row items-center bg-primary text-white">
        <img src="/src/assets/users.svg" alt="members" style="width: 24px; height: 24px; filter: brightness(0) invert(1);" class="q-mr-sm" />
        <span class="text-h6">Channel Members</span>
        <q-space />
        <q-btn flat round dense v-close-popup>
          <img src="/src/assets/close.svg" alt="close" style="width: 16px; height: 16px; filter: brightness(0) invert(1);" />
        </q-btn>
      </q-card-section>
      
      <q-card-section style="max-height: 400px; overflow: auto">
        <q-list>
          <q-item v-for="member in members" :key="member.id">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ member.user?.nickName?.[0]?.toUpperCase() ?? '?' }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ member.user?.nickName }}</q-item-label>
              <q-item-label caption>
                {{ member.user?.firstName }} {{ member.user?.lastName }}
              </q-item-label>
            </q-item-section>
            <q-item-section side v-if="isChannelAdmin(member.userId)">
              <q-badge color="amber" text-color="dark">Admin</q-badge>
            </q-item-section>
          </q-item>
          
          <q-item v-if="members.length === 0">
            <q-item-section class="text-center text-grey">
              No members found
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>

  <!-- Invite dialog -->
  <q-dialog v-model="showInviteDialog">
    <q-card style="min-width: 350px; border-radius: 16px">
      <q-card-section class="row items-center bg-primary text-white">
        <img src="/src/assets/plus.svg" alt="invite" style="width: 24px; height: 24px; filter: brightness(0) invert(1);" class="q-mr-sm" />
        <span class="text-h6">Invite User</span>
        <q-space />
        <q-btn flat round dense v-close-popup>
          <img src="/src/assets/close.svg" alt="close" style="width: 16px; height: 16px; filter: brightness(0) invert(1);" />
        </q-btn>
      </q-card-section>
      
      <q-card-section>
        <q-input
          v-model="inviteNickname"
          label="User Nickname"
          outlined
          :error="!!inviteError"
          :error-message="inviteError"
        />
      </q-card-section>
      
      <q-card-actions align="right">
        <q-btn flat label="Cancel" v-close-popup />
        <q-btn 
          color="primary" 
          label="Invite" 
          :loading="inviting"
          @click="handleInvite"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useChannelsStore } from 'src/stores/channels/channels';
import { useScrollHandling } from '../composables/useScrollHandling';

const { onMouseEnter, onMouseLeave } = useScrollHandling('.q-header');
const channels = useChannelsStore();

const selectedChannel = computed(() => channels.selected);
const members = computed(() => channels.selectedMembers);

const showMembers = ref(false);
const showInviteDialog = ref(false);
const inviteNickname = ref('');
const inviteError = ref('');
const inviting = ref(false);

function isChannelAdmin(userId: number): boolean {
  return selectedChannel.value?.adminId === userId;
}

async function handleInvite() {
  if (!inviteNickname.value.trim()) {
    inviteError.value = 'Please enter a nickname';
    return;
  }

  inviting.value = true;
  inviteError.value = '';

  const result = await channels.inviteUser(inviteNickname.value.trim());

  if (result.success) {
    inviteNickname.value = '';
    showInviteDialog.value = false;
  } else {
    inviteError.value = result.error ?? 'Failed to invite user';
  }

  inviting.value = false;
}

async function handleLeave() {
  if (selectedChannel.value?.isAdmin) {
    await channels.deleteChannel();
  } else {
    await channels.leaveChannel();
  }
}

// Update document title
watch(selectedChannel, (val) => {
  document.title = val ? `${val.name} – Nexus` : 'Nexus';
});
</script>
