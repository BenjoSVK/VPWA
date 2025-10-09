<template>
  <q-layout view="lHh Lpr lFf">
    <ChannelHeader />
    <LeftPanel />

    <q-page-container>
      <q-page class="flex column justify-end">
        <Chat />
        <MessageInput />
      </q-page>
    </q-page-container>

    <RightPanel />
  </q-layout>
</template>

<script setup lang="ts">
import RightPanel from 'src/pages/RightPanel.vue';
import LeftPanel from 'src/pages/LeftPanel.vue';
import ChannelHeader from 'src/pages/ChannelHeaderPage.vue';
import MessageInput from 'src/pages/MessageInput.vue';
import Chat from 'src/pages/ChatPage.vue';
</script>
