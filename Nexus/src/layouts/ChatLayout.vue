<template>
  <q-layout view="lHh Lpr lFf">
    <ChannelHeader />
    <LeftPanel />

    <q-page-container>
      <q-page padding>
        <h5>Obsah stránky</h5>
      </q-page>
    </q-page-container>

    <RightPanel />
  </q-layout>
</template>

<script setup lang="ts">
import RightPanel from 'src/pages/RightPanel.vue';
import LeftPanel from 'src/pages/LeftPanel.vue';
import ChannelHeader from 'src/pages/ChannelHeaderPage.vue';
</script>
