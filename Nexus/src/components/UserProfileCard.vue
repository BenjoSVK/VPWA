<template>
  <div
    class="items-center justify-center flex"
    :class="ui.drawerState ? '' : 'user-profile-container'"
  >
    <q-avatar>
      <img
        :src="UserAvatar"
        alt="avatar"
        class="avatar-img cursor-pointer"
        @click="handleProfileCard"
      />
    </q-avatar>
    <div v-if="!drawerState" class="col">
      <div class="text-light items-center">
        <p class="q-ma-none user-name">User Name</p>
      </div>
      <div class="text-grey">
        <p class="q-ma-none user-status">Online</p>
      </div>
    </div>
    <div
      v-if="!drawerState"
      class="justify-center align-center items-center flex cursor-pointer q-ma-sm"
    >
      <img
        src="/src/assets/settings.svg"
        name="Settings"
        class="text-light user-settings"
        @click="handleProfileCard"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from 'src/assets/UserDefault.svg';
import { useDrawerStore } from 'src/stores/drawer';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const ui = useDrawerStore();
const drawerState = computed(() => ui.drawerState);

async function handleProfileCard() {
  await router.push('/Profile');
}
</script>
<style lang="scss" scoped>
@import '../css/leftpanel.scss';
</style>
