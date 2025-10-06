<template>
  <div class="user-profile-container items-center flex">
    <q-avatar>
      <img :src="UserAvatar" alt="avatar" class="avatar-img" />
    </q-avatar>
    <div class="col">
      <div class="text-light items-center">
        <p class="q-ma-none user-name">User Name</p>
      </div>
      <div class="text-grey">
        <P class="q-ma-none user-status">Online</P>
      </div>
    </div>
    <div class="justify-center align-center items-center flex user-settings">
      <img src="/src/assets/settings.svg" name="Settings" class="text-light user-settings-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import UserAvatar from 'src/assets/UserDefault.svg';
</script>
<style lang="scss" scoped>
@import '../css/leftpanel.scss';
</style>
