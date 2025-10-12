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
    <div class="profile-card" style="overflow: scroll">
      <div class="flex justify-center items-center q-py-lg">
        <div class="flex profile-icon round">
          <img src="/src/assets/UserProfileDefault.svg" class="q-pa-sm" />
        </div>
      </div>
      <div class="column justify-center items-center">
        <p class="text-white text-h4">Užívateľský profil</p>
        <p class="text-grey-6 text-subtitle1">Availibe for messages</p>
      </div>
      <div class="q-pa-lg q-mt-lg">
        <p class="text-white text-h6">Status</p>
        <div class="column" style="gap: 10px">
          <q-btn rounded flat class="bg-grey-7" align="left" size="md">
            <p class="text-white text-subtitle2 q-ma-sm q-pl-md">Online</p>
          </q-btn>
          <q-btn rounded flat align="left" size="md">
            <p class="text-grey-6 text-subtitle2 q-ma-sm q-pl-md">Ofline</p>
          </q-btn>
          <q-btn rounded flat align="left" size="md">
            <p class="text-grey-6 text-subtitle2 q-ma-sm q-pl-md">Do not Disturb</p></q-btn
          >
        </div>
      </div>
      <q-separator />
      <div class="flex justify-between q-pa-lg">
        <div class="flex">
          <img src="src/assets/notification.svg" />
          <div class="column q-mx-md">
            <p class="text-white text-h6 q-ma-none">Notifikacie</p>
            <p class="text-grey-6 teht-subtitle2 q-ma-none">Vypnuté</p>
          </div>
        </div>
        <q-toggle
          v-model="icon"
          checked-icon="img:/src/assets/check.svg"
          color="green"
          unchecked-icon="img:/src/assets/close.svg"
        />
      </div>
      <q-separator />
      <div class="flex justify-center items-center">
        <q-btn rounded class="bg-red-13 text-white" size="md"> Odhlasit sa</q-btn>
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    // Ak nie, choď na default route
  }
}
const icon = ref(false);
</script>

<style lang="scss" scoped>
.profile-icon {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
}
.profile-card {
  width: 30dvw;
  height: 70dvh;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
}
@import '../css/index.scss';
</style>
