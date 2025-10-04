<template>
  <q-page padding>
    <div v-for="c in ChannelTypes" :key="c">
      {{ c }}
    </div>
  </q-page>
</template>

<script setup lang="ts">
const ChannelTypes = ['Favourites', 'Groups'];
</script>
