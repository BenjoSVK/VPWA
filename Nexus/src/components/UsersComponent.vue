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
        @click="handleMemberClick(member.user?.nickName)"
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" size="40px">
            {{ getInitials(member.user?.firstName, member.user?.lastName, member.user?.nickName) }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-medium">
            {{ member.user?.nickName ?? 'Unknown' }}
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleMemberClick(nickName?: string) {
  // Reserved for future use (e.g., open user profile)
}

async function kickMember(nickName?: string) {
  if (!nickName) return;
  
  if (selectedChannel.value?.isPrivate) {
    await channels.revokeUser(nickName);
  } else {
    await channels.kickUser(nickName);
  }
}

// Clear search when channel changes
watch(() => channels.selectedId, () => {
  searchQuery.value = '';
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
</style>
