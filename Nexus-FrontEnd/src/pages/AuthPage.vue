<template>
  <q-page class="bg-gradient-primary flex items-center justify-center q-pa-xl">
    <q-header>
      <q-btn
        push
        rippled
        class="fixed-top-left z-max q-ma-md go-back-icon cursor-pointer"
        @click="goBack"
      >
        <img src="/src/assets/gobackarrow.svg" />
      </q-btn>
    </q-header>
    
    <c-Login v-if="!showRegister" />
    <c-Register v-else />
  </q-page>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import cLogin from 'src/components/LoginComponent.vue';
import cRegister from 'src/components/RegisterComponent.vue';

const router = useRouter();
const route = useRoute();

const showRegister = computed(() => {
  return route.name === 'auth.register';
});

function goBack() {
  if (route.name === 'auth.login') {
    router.push('/').catch(() => {
      console.error('Failed to navigate to index page');
    });
  } else {
    router.push('/auth/login').catch(() => {
      console.error('Failed to navigate to login page');
    });
  }
}
</script>

<style lang="scss" scoped>
@import '../css/index.scss';
</style>