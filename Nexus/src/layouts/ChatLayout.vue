<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <!-- <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" /> -->

        <q-toolbar-title> Favourites </q-toolbar-title>
      </q-toolbar>
    </q-header>

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
</script>
