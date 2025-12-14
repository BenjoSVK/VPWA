<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from 'src/stores/auth/auth';
import { useUserStatusStore } from 'src/stores/user/userStatus';

const auth = useAuthStore();
const userStatus = useUserStatusStore();

function handleBeforeUnload() {
  if (auth.isAuthenticated) {
    void userStatus.setOffline();
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>
