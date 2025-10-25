<template>
  <div class="col flex items-center" :class="drw.isMini ? 'justify-center' : 'q-pl-lg'">
    <q-btn
      push
      class="hamburger-icon border-rad flex q-pa-xs"
      :class="drw.isMini ? '' : 'q-mr-sm'"
      @click="handleProfileCard"
    >
      <img
        src="/src/assets/settings.svg"
        class="q-ma-sm user-settings"
        style="width: 20px; fill: #d1d5dc"
      />
    </q-btn>
    <p v-if="!drw.isMini" class="text-subtitle2 text-grey-5 q-ma-none">Settings</p>
  </div>
  <div :class="drw.isMini ? 'q-py-lg' : 'q-pa-lg'">
    <div
      class="items-center justify-center flex"
      :class="drw.isMini ? '' : 'user-profile-container'"
    >
      <q-avatar>
        <img
          :src="UserAvatar"
          alt="avatar"
          class="avatar-img cursor-pointer"
          @click="handleProfileCard"
        />
      </q-avatar>
      <div v-show="!drw.isMini" class="col q-pl-md">
        <div class="text-light items-center">
          <p class="q-ma-none text-weight-medium text-subtitle2">User Name</p>
        </div>
        <div class="text-grey">
          <p class="q-ma-none text-weight-regular text-body2">{{ userStatus.statusText }}</p>
        </div>
      </div>
      <div
        v-show="!drw.isMini"
        class="justify-center align-center items-center flex cursor-pointer q-ma-sm"
      >
        <img
          v-if="notificationsEnabled"
          src="/src/assets/notification.svg"
          name="Settings"
          class="text-light"
          @click.stop="notificationStatus.disableNotifications()"
        />
        <img
          v-else
          src="/src/assets/notificationDisabled.svg"
          name="Settings"
          class="text-light"
          @click.stop="notificationStatus.enableNotifications()"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from 'src/assets/UserDefault.svg';
import { useDrawerStore } from 'src/stores/drawer/drawer';
import { useRouter } from 'vue-router';
import { useUserStatusStore } from 'src/stores/user/userStatus';
import { storeToRefs } from 'pinia';
import { useNotificationStatusStore } from 'src/stores/user/notificationStatus';
const userStatus = useUserStatusStore();
const notificationStatus = useNotificationStatusStore();
const { notificationsEnabled } = storeToRefs(notificationStatus);
const router = useRouter();
const drw = useDrawerStore();

async function handleProfileCard() {
  await router.push('/profile');
}
</script>
<style lang="scss" scoped>
.user-profile-container {
  border-radius: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 13px;
}
.avatar-img {
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  border-width: 3px;
}
.avatar-img:hover {
  transform: scale(1.08);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.avatar-img:active {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(255, 255, 255, 0.15);
  filter: brightness(1.2) saturate(1.2);
}
.hamburger-icon {
  background-color: rgba(255, 255, 255, 0.1);
}
.hamburger-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transition: background-color 0.3s ease;
}
.user-settings {
  transition: transform 0.8s ease;
}
.hamburger-icon:hover .user-settings {
  transform: rotate(135deg);
}
</style>
