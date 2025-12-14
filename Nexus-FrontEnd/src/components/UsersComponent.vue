<template>
  <q-drawer
    side="right"
    aria-label="Members"
    :model-value="true"
    :width="320"
    :breakpoint="0"
    :overlay="$q.screen.lt.md"
    style="border-left: 1px solid #e0e0e0"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="q-px-md q-pt-md q-pb-sm">
      <p class="text-weight-bold text-subtitle1 q-ma-none q-pl-xs">Channel Members</p>
      <q-input
        v-model="searchQuery"
        dense
        outlined
        placeholder="Search members..."
        class="q-mt-sm"
      >
        <template #prepend>
          <img src="/src/assets/SearchIcon.svg" alt="search" style="width: 18px; height: 18px; opacity: 0.6;" />
        </template>
        <template #append v-if="searchQuery">
          <img src="/src/assets/close.svg" alt="close" style="width: 14px; height: 14px; cursor: pointer; opacity: 0.6;" @click="searchQuery = ''" />
        </template>
      </q-input>
    </div>
    
    <q-separator class="q-my-sm" />
    
    <p class="text-grey text-subtitle2 text-weight-bold q-pt-xs q-px-md q-ma-none">
      MEMBERS — {{ filteredMembers.length }}
    </p>
    
    <!-- Loading state -->
    <div v-if="loading" class="q-pa-md text-center">
      <q-spinner color="primary" size="24px" />
    </div>
    
    <!-- Empty state -->
    <div v-else-if="filteredMembers.length === 0" class="q-pa-md text-center text-grey">
      <img src="/src/assets/users.svg" alt="no members" style="width: 48px; height: 48px; opacity: 0.5;" class="q-mb-sm" />
      <div>{{ searchQuery ? 'No matching members' : 'No members' }}</div>
    </div>
    
    <!-- Members list -->
    <q-list v-else>
      <q-item
        v-for="member in filteredMembers"
        :key="member.id"
        class="member-item"
        clickable
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" size="40px">
            {{ getInitials(member.user?.firstName, member.user?.lastName, member.user?.nickName) }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-medium row items-center q-gutter-xs">
            <span>{{ member.user?.nickName ?? 'Unknown' }}</span>
            <span
              v-if="getMemberStatus(member)"
              class="row items-center q-gutter-xs status-badge"
              style="vertical-align: middle;"
            >
              <div
                class="status-dot"
                :class="getStatusDotClass(getMemberStatus(member)!)"
              />
              <span class="text-caption" :class="getStatusTextClass(getMemberStatus(member)!)">{{ getStatusLabel(getMemberStatus(member)!) }}</span>
            </span>
          </q-item-label>
          <q-item-label caption class="text-grey">
            {{ member.user?.firstName }} {{ member.user?.lastName }}
          </q-item-label>
        </q-item-section>

        <q-item-section side v-if="isAdmin(member.userId)">
          <q-badge color="amber" text-color="dark">
            <img src="/src/assets/star.svg" alt="admin" style="width: 12px; height: 12px;" class="q-mr-xs" />
            Admin
          </q-badge>
        </q-item-section>
        
        <q-item-section side v-else-if="member.isInvited">
          <q-badge color="green" text-color="white">
            Invited
          </q-badge>
        </q-item-section>

        <!-- Context menu for admin actions -->
        <q-menu touch-position context-menu v-if="channels.isAdmin && !isAdmin(member.userId)">
          <q-list dense style="min-width: 150px">
            <q-item clickable v-close-popup @click="kickMember(member.user?.nickName)">
              <q-item-section avatar>
                <img src="/src/assets/outBox.svg" alt="remove" style="width: 18px; height: 18px;" />
              </q-item-section>
              <q-item-section class="text-negative">
                {{ selectedChannel?.isPrivate ? 'Remove' : 'Kick' }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-item>
    </q-list>
  </q-drawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useChannelsStore } from 'src/stores/channels/channels';
import { useScrollHandling } from '../composables/useScrollHandling';
import type { ChannelMember } from 'src/lib/api';

const channels = useChannelsStore();
const { onMouseEnter, onMouseLeave } = useScrollHandling('.q-drawer');

const searchQuery = ref('');
const loading = computed(() => channels.loading);

const selectedChannel = computed(() => channels.selected);
const members = computed(() => channels.selectedMembers);

const filteredMembers = computed(() => {
  if (!searchQuery.value.trim()) return members.value;
  
  const query = searchQuery.value.toLowerCase();
  return members.value.filter(m => {
    const nickName = m.user?.nickName?.toLowerCase() ?? '';
    const firstName = m.user?.firstName?.toLowerCase() ?? '';
    const lastName = m.user?.lastName?.toLowerCase() ?? '';
    return nickName.includes(query) || firstName.includes(query) || lastName.includes(query);
  });
});

function getInitials(firstName?: string, lastName?: string, nickName?: string): string {
  const first = firstName?.[0] ?? '';
  const last = lastName?.[0] ?? '';
  return (first + last).toUpperCase() || nickName?.[0]?.toUpperCase() || '?';
}

function isAdmin(userId: number): boolean {
  return selectedChannel.value?.adminId === userId;
}

function getMemberStatus(member: ChannelMember): string | null {
  const status = member.user?.status || 'Online';
  if (!status || typeof status !== 'string' || !status.trim()) {
    return 'Online';
  }
  return status.trim();
}

function getStatusTextClass(status: string): string {
  if (status === 'Online') return 'text-green'
  if (status === 'Do Not Disturb') return 'text-orange'
  return 'text-grey'
}

function getStatusDotClass(status: string): string {
  if (status === 'Online') return 'status-dot-online'
  if (status === 'Do Not Disturb') return 'status-dot-dnd'
  return 'status-dot-offline'
}

function getStatusLabel(status: string): string {
  if (status === 'Online') return 'Online'
  if (status === 'Do Not Disturb') return 'DND'
  return 'Offline'
}

async function kickMember(nickName?: string) {
  if (!nickName) return;
  
  if (selectedChannel.value?.isPrivate) {
    await channels.revokeUser(nickName);
  } else {
    await channels.kickUser(nickName);
  }
}

// Clear search when channel changes and fetch members
watch(() => channels.selectedId, async (newId) => {
  searchQuery.value = '';
  if (newId) {
    await channels.fetchMembers(newId);
  }
});
</script>

<style lang="scss" scoped>
.member-item {
  margin: 4px 12px;
  border-radius: 8px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
}

.status-badge {
  margin-left: 8px;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}

.status-dot-online {
  background-color: #4caf50;
}

.status-dot-offline {
  background-color: #9e9e9e;
}

.status-dot-dnd {
  background-color: #ff9800;
}
</style>
