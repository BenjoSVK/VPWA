<template>
  <q-page class="bg-gradient-primary flex items-center justify-center q-pa-xl">
    <q-btn
      push
      rippled
      class="fixed-top-left z-max q-ma-md go-back-icon cursor-pointer"
      @click="goBack"
    >
      <img src="/src/assets/gobackarrow.svg" />
    </q-btn>
    <q-card class="profile-card" style="overflow: scroll">
      <!-- Profile -->
      <div>
        <div class="flex justify-center items-center q-py-lg">
          <div class="flex profile-icon round">
            <img src="/src/assets/UserProfileDefault.svg" class="q-pa-sm" />
          </div>
        </div>
        <div class="column justify-center items-center">
          <div class="text-white text-h4">Užívateľský profil</div>
          <div class="text-grey-6 text-subtitle1">{{ statusText }}</div>
        </div>
      </div>

      <!-- Status -->
      <div class="q-px-lg">
        <p class="text-white text-h6">Status</p>
        <div class="column" style="gap: 5px">
          <q-btn
            rounded
            flat
            :class="currentStatus === UserStatus.Online ? 'bg-grey-7' : ''"
            align="left"
            size="md"
            @click="setStatus(UserStatus.Online)"
          >
            <p
              class="text-subtitle2 q-ma-sm q-pl-md"
              :class="currentStatus === UserStatus.Online ? 'text-white' : 'text-grey-6'"
            >
              Online
            </p>
          </q-btn>
          <q-btn
            rounded
            flat
            :class="currentStatus === UserStatus.Offline ? 'bg-grey-7 text-white' : ''"
            align="left"
            size="md"
            @click="setStatus(UserStatus.Offline)"
          >
            <p
              class="text-subtitle2 q-ma-sm q-pl-md"
              :class="currentStatus === UserStatus.Offline ? 'text-white' : 'text-grey-6'"
            >
              Offline
            </p>
          </q-btn>
          <q-btn
            rounded
            flat
            :class="currentStatus === UserStatus.Dnd ? 'bg-grey-7 text-white' : ''"
            align="left"
            size="md"
            @click="setStatus(UserStatus.Dnd)"
          >
            <p
              class="text-subtitle2 q-ma-sm q-pl-md"
              :class="currentStatus === UserStatus.Dnd ? 'text-white' : 'text-grey-6'"
            >
              Do not Disturb
            </p>
          </q-btn>
        </div>
      </div>
      <q-separator inset color="white" style="opacity: 0.2" />

      <!-- Notifications - mentions only toggle -->
      <div class="flex justify-between q-pa-lg">
        <div class="flex">
          <img :src="mentionsOnly ? notifOn : notifOff" class="q-pl-sm" />
          <div class="column q-mx-md">
            <p class="text-white text-h6 q-ma-none">Notifikácie</p>
            <p class="text-grey-6 text-subtitle2 q-ma-none">{{ mentionsOnly ? 'Len @mentions' : 'Všetky správy' }}</p>
          </div>
        </div>
        <q-toggle
          :model-value="mentionsOnly"
          @update:model-value="(val: boolean) => auth.updateNotificationSettings(val)"
          checked-icon="img:/src/assets/check.svg"
          color="green"
          unchecked-icon="img:/src/assets/close.svg"
        />
      </div>
      <q-separator inset color="white" style="opacity: 0.2" />

      <!-- Logout -->
      <div class="flex justify-center items-center q-pa-lg">
        <q-btn
          rounded
          class="bg-red-14 col q-py-md"
          style="cursor: pointer"
          size="md"
          @click="handleLogout"
        >
          <p class="text-subtitle2 q-ma-none text-white">Odhlasit sa</p>
        </q-btn>
      </div>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { UserStatus } from 'src/components/models';
import { useUserStatusStore } from 'src/stores/user/userStatus';
import { useChannelsStore } from 'src/stores/channels/channels';
import { useMessagesStore } from 'src/stores/messages/messages';
import { useAuthStore } from 'src/stores/auth/auth';
import { setAuthToken } from 'src/lib/api';

import notifOn from '../assets/notification.svg';
import notifOff from '../assets/notificationDisabled.svg';

const router = useRouter();
const channels = useChannelsStore();
const messages = useMessagesStore();
const auth = useAuthStore();

// Get notification setting from auth store
const mentionsOnly = computed(() => auth.profile?.notify_mentions_only ?? false);

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    void router.push('/chat');
  }
}

function handleLogout() {
  // Stop all polling
  channels.reset();
  messages.reset();
  
  // Clear auth token
  setAuthToken(null);
  
  // Clear all storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Force full page reload to login
  window.location.href = window.location.origin + '/?_=' + Date.now() + '#/auth/login';
}
const userStatus = useUserStatusStore();
const { currentStatus, statusText } = storeToRefs(userStatus);

async function setStatus(status: UserStatus) {
  await userStatus.setStatus(status);
  
  if (status === UserStatus.Online && userStatus.isOffline) {
    await channels.fetchChannels();
    if (channels.selectedId) {
      await messages.fetchMessages(channels.selectedId);
      messages.setupRealtimeSubscription(channels.selectedId);
    }
  }
}
</script>

<style lang="scss" scoped>
.profile-icon {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
}
.profile-card {
  width: 25dvw;
  height: 70dvh;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
}

@import '../css/index.scss';
</style>
