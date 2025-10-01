<template>
  <q-page>
    <nav class="bg-glass row justify-center items-center">
      <div class="limited-width row justify-between items-center">
        <div class="row items-center">
          <div
            style="width: 32px; height: 32px"
            class="row items-center justify-center bg-gradient-secondary border-rad"
          >
            <img src="~assets/Icon.svg" alt="Icon" width="20px" height="20px" />
          </div>
          <p class="text-dark text-h6 q-ma-none q-mx-md">Nexus</p>
          <div style="background-color: #eceef2" class="row items-center border-rad">
            <p class="q-ma-none q-mx-sm text-dark">IRC Chat</p>
          </div>
        </div>
        <div class="row items-center">
          <IndexButton variant="outline" text="Login" @click="handleDocumentation" />
          <IndexButton
            variant="primary"
            text="GitHub"
            @click="handleGithub"
            class="q-ml-sm"
          />
        </div>
      </div>
    </nav>
  </q-page>
</template>

<script setup lang="ts">
import IndexButton from 'components/IndexButton.vue';

function handleGithub() {
  window.open('https://github.com');
}

function handleDocumentation() {
  window.open('https://github.com');
}
</script>

<style lang="scss" scoped>
@import '../css/index.scss';
</style>
