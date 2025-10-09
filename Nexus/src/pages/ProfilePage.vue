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
            <div class="flex profile-icon round">
              <img src="/src/assets/UserProfileDefault.svg" class="q-pa-sm" />
              <Online />
            </div>
          </div>
          <div>dddddffffff</div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const goBack = () => router.push('/Chat');
</script>

<style lang="scss" scoped>
.profile-icon {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
}
.profile-card {
  width: 450px;
  height: 700px;
  border-radius: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
}
.go-back-icon {
  width: 2.4375rem;
  height: 2.4375rem;
  border-radius: 2.61163rem;
  border: 0.7px solid rgba(255, 255, 255, 0.4);
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(0, 0, 0, 0) 100%
  );
  background-size: 300%;
  transition: background-position 0.4s ease;
}
.go-back-icon:hover {
  background-position: right;
}
@import '../css/index.scss';
</style>
