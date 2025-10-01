<template>
  <q-item>
    <q-item-section avatar class="flex items-center justify-center bg-grey-2 q-pa-none">
      <q-icon :name="icon" :size="size" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
export interface GroupProps {
  icon: string;
  size?: string;
  name: string;
}

withDefaults(defineProps<GroupProps>(), {
  icon: 'help',
  name: 'Unknown',
  size: '24px',
});
</script>
