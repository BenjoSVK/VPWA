<template>
  <q-item class="q-px-lg">
    <q-item-section avatar class="items-center justify-center channel-item-icon">
      <div class="flex">
        <img :src="icon" :alt="name" class="channel-icon" />
      </div>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface GroupProps {
  icon: string;
  name: string;
}

withDefaults(defineProps<GroupProps>(), {
  icon: 'help',
  name: 'Unknown',
});
</script>
<style lang="scss" scoped>
@import '../css/index.scss';
</style>
