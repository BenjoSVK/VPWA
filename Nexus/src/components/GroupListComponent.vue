<template>
  <q-list class="column">
    <q-btn
      v-for="g in sortedGroups"
      @click="groups.setSelected(g.id)"
      align="left"
      :key="g.id"
      flat
      :active="groups.selectedId === g.id"
      class="q-my-xs border-rad group-item"
      size="md"
      :class="[
        drw.isMini ? 'q-mx-md flex items-center' : 'q-mx-lg',
        groups.selectedId === g.id ? 'active-group' : 'inactive-group',
      ]"
    >
      <template #default>
        <div class="row items-center full-width group-content">
          <q-icon v-if="g.private === true && !drw.isMini" size="18px" class="q-mr-sm group-icon">
            <img src="../assets/Lock.svg" alt="group icon" />
            <!-- optional style for private group icon -->
            <!-- style="
                filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%)
                  hue-rotate(346deg) brightness(118%) contrast(119%);
              " -->
          </q-icon>
          <q-icon v-else-if="!drw.isMini" size="18px" class="q-mr-sm group-icon">
            <img
              src="../assets/public.svg"
              alt="group icon"
              style="filter: brightness(0) invert(1)"
            />
          </q-icon>
          <span v-if="!drw.isMini" class="text-weight-medium group-name">
            {{ g.name ?? 'Unknown' }}
          </span>
          <span v-else class="text-weight-medium group-name-mini">
            {{ g.name?.[0] ?? '•' }}
          </span>
          <q-icon
            v-if="groups.selectedId === g.id && !drw.isMini"
            name="img:src/assets/close.svg"
            size="18px"
            class="q-ml-auto close-icon"
            @click.stop="groups.removeGroup(g.id)"
            style="filter: brightness(0) invert(1) opacity(0.5)"
          />
        </div>
      </template>
    </q-btn>
  </q-list>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useDrawerStore } from 'src/stores/drawer/drawer';
import { useGroupsStore } from '../stores/drawer/groups';
const sortedGroups = computed(() => {
  if (!groups.groups) return [];

  return [...groups.groups].sort((a, b) => {
    if (a.id === groups.selectedId) return -1;
    if (b.id === groups.selectedId) return 1;
    return 0;
  });
});
const drw = useDrawerStore();
const groups = useGroupsStore();
</script>
<style lang="scss" scoped>
.group-item {
  transition: all 0.5s ease-out;
}

.group-content {
  transition: all 0.5s ease-out;
}

.group-icon {
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}

.group-name {
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}

.group-name-mini {
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}

.close-icon {
  transition:
    opacity 0.5s ease-out,
    transform 0.5s ease-out;
}

.active-group {
  background-color: rgba(111, 178, 255, 0.399);
  color: rgba(255, 255, 255, 0.95);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.inactive-group {
  background-color: transparent;
  color: rgba(255, 255, 255, 0.5);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}
</style>
