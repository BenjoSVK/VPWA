<template>
  <div :class="statusIconClass">f</div>
</template>
<script setup lang="ts">
const props = defineProps<{
  status: 'online' | 'offline' | 'dnd';
}>();
const statusIconClass = `status-${props.status}`;
</script>

<style scoped lang="scss">
@import '../css/index.scss';
</style>
