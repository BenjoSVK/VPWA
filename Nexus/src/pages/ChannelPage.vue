<template>
  <c-Header />
  <c-Channels />
  <q-page class="flex column justify-end">
    <c-Chat />
  </q-page>

  <c-Users />
</template>
<script setup lang="ts">
import cHeader from '../components/HeaderComponent.vue';
import cChannels from 'src/components/GroupsComponent.vue';
import cChat from 'src/components/ChatComponent.vue';
import cUsers from 'src/components/UsersComponent.vue';
</script>
