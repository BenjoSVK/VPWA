<template>
  <q-item>
    <q-item-section avatar>
      <img :src="icon" :alt="name" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
      <q-item-label class="text-grey">{{ status }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface UsersProps {
  icon?: string;
  name: string;
  status: 'Online' | 'Offline' | 'Dnd';
}

withDefaults(defineProps<UsersProps>(), {
  icon: '/src/assets/UserDefault.svg',
  name: 'Unknown',
  status: 'Offline',
});
</script>
<style lang="scss" scoped>
@import '../css/index.scss';
</style>
