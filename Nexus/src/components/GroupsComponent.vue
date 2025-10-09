<template>
  <q-item class="q-px-lg">
    <q-item-section avatar class="items-center justify-center q-pr-md">
      <img :src="icon" :alt="name" :width="25" :height="25" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface GroupsProps {
  icon: string;
  name: string;
}

withDefaults(defineProps<GroupsProps>(), {
  icon: 'help',
  name: 'Unknown',
});
</script>
<style lang="scss" scoped>
@import '../css/index.scss';
</style>
