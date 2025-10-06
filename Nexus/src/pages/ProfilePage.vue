<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-gradient-primary flex items-center justify-center q-pa-xl">
        <q-btn
          push
          rippled
          class="fixed-top-left z-max q-ma-md go-back-icon cursor-pointer"
          @click="goBack"
        >
          <img src="/src/assets/gobackarrow.svg" />
        </q-btn>
        <div class="profile-card">
          <div class="flex justify-center items-center q-py-lg">
            <div class="flex profile-icon">
              <img src="/src/assets/UserProfileDefault.svg" class="q-pa-sm" />
              <Online />
            </div>
          </div>
          <div>dddddffffff</div>
          <StatusIcon status="online" />
          <StatusIcon status="offline" />
          <StatusIcon status="dnd" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import StatusIcon from 'src/components/UserStatus.vue';
const router = useRouter();
const goBack = () => router.push('/Chat');
</script>

<style lang="scss" scoped>
@import '../css/index.scss';
</style>
