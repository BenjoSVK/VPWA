<template>
  <div class="items-center justify-center flex" :class="drw.isMini ? '' : 'user-profile-container'">
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
        <p class="q-ma-none text-weight-regular text-body2">Online</p>
      </div>
    </div>
    <div
      v-show="!drw.isMini"
      class="justify-center align-center items-center flex cursor-pointer q-ma-sm"
    >
      <img
        src="/src/assets/notification.svg"
        name="Settings"
        class="text-light"
        @click="handleProfileCard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from 'src/assets/UserDefault.svg';
import { useDrawerStore } from 'src/stores/drawer/drawer';
import { useRouter } from 'vue-router';

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
</style>
