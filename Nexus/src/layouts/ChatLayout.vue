<template>
  <q-layout view="lHh Lpr lFf">
    <HeaderBar />
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
import HeaderBar from 'src/pages/HeaderBar.vue';
</script>
