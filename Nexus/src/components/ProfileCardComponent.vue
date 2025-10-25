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
          <p class="text-white text-h4">Užívateľský profil</p>
          <p class="text-grey-6 text-subtitle1">{{ statusText }}</p>
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

      <!-- Notifications -->
      <div class="flex justify-between q-pa-lg">
        <div class="flex">
          <img v-if="notificationsEnabled" src="src/assets/notification.svg" />
          <img v-else src="src/assets/notificationDisabled.svg" />
          <div class="column q-mx-md">
            <p class="text-white text-h6 q-ma-none">Notifikacie</p>
            <p class="text-grey-6 text-subtitle2 q-ma-none">{{ delayedNotificationText }}</p>
          </div>
        </div>
        <q-toggle
          v-model="notificationsEnabled"
          checked-icon="img:/src/assets/check.svg"
          color="green"
          unchecked-icon="img:/src/assets/close.svg"
        />
      </div>
      <q-separator inset color="white" style="opacity: 0.2" />

      <!-- Logout -->
      <div class="flex justify-center items-center q-pa-lg">
        <q-btn rounded class="bg-red-14 text-white col q-py-md" size="md"> Odhlasit sa</q-btn>
      </div>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStatusStore } from 'src/stores/user/userStatus';
import { useNotificationStatusStore } from 'src/stores/user/notificationStatus';
import { UserStatus } from 'src/components/models';

const router = useRouter();
function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    // Ak nie, choď na default route
  }
}

const userStatus = useUserStatusStore();
const notificationStatus = useNotificationStatusStore();
const { currentStatus, statusText } = storeToRefs(userStatus);
const { notificationsEnabled, statusText: notificationStatusText } =
  storeToRefs(notificationStatus);

// Delay pre notifikácie
const delayedNotificationText = ref(notificationStatusText.value);

// Watch pre zmenu notifikácií s delay
watch(notificationStatusText, (newValue) => {
  setTimeout(() => {
    delayedNotificationText.value = newValue;
  }, 10);
});

function setStatus(status: UserStatus) {
  userStatus.setStatus(status);
}
</script>

<style lang="scss" scoped>
.profile-icon {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
}
.profile-card {
  width: 25dvw;
  height: 65dvh;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
}
@import '../css/index.scss';
</style>
