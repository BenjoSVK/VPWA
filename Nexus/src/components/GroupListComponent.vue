<template>
  <q-list class="column">
    <q-btn
      v-for="g in sortedGroups"
      @click="groups.setSelected(g.id)"
      align="left"
      :key="g.id"
      flat
      :active="groups.selectedId === g.id"
      class="q-my-xs border-rad"
      size="md"
      :class="[
        drw.isMini ? 'q-mx-md flex items-center' : 'q-mx-lg',
        groups.selectedId === g.id ? 'active-group' : 'inactive-group',
      ]"
    >
      <template #default>
        <div class="row items-center full-width">
          <q-icon v-if="g.private === true && !drw.isMini" size="18px" class="q-mr-sm">
            <img src="../assets/Lock.svg" alt="group icon" />
            <!-- optional style for private group icon -->
            <!-- style="
                filter: brightness(0) saturate(100%) invert(48%) sepia(79%) saturate(2476%)
                  hue-rotate(346deg) brightness(118%) contrast(119%);
              " -->
          </q-icon>
          <q-icon v-else-if="!drw.isMini" size="18px" class="q-mr-sm">
            <img
              src="../assets/public.svg"
              alt="group icon"
              style="filter: brightness(0) invert(1)"
            />
          </q-icon>
          <span v-if="!drw.isMini" class="text-weight-medium">
            {{ g.name ?? 'Unknown' }}
          </span>
          <span v-else class="text-weight-medium">
            {{ g.name?.[0] ?? '•' }}
          </span>

          <!-- Invited badge for Developers channel -->
          <div
            v-if="g.name === 'Developers Hub' && !drw.isMini"
            class="invite-badge q-ml-auto q-mr-sm"
          >
            <span class="text-caption text-weight-medium">Invited</span>
          </div>

          <q-icon
            v-if="groups.selectedId === g.id && !drw.isMini"
            name="img:src/assets/close.svg"
            size="18px"
            class="q-ml-auto"
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
    // Developers Hub je vždy na vrchu
    if (a.name === 'Developers Hub') return -1;
    if (b.name === 'Developers Hub') return 1;

    // Potom vybraný kanál
    if (a.id === groups.selectedId) return -1;
    if (b.id === groups.selectedId) return 1;

    // Ostatné kanály podľa abecedy
    return a.name.localeCompare(b.name);
  });
});
const drw = useDrawerStore();
const groups = useGroupsStore();
</script>
<style lang="scss" scoped>
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

.invite-badge {
  background: rgba(76, 175, 80, 0.15);
  border: 1px solid rgba(76, 175, 80, 0.4);
  border-radius: 8px;
  padding: 2px 6px;
  display: flex;
  align-items: center;
  color: #4caf50;
  font-size: 10px;
  animation: invitePulse 2s ease-in-out infinite;
}

@keyframes invitePulse {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}
</style>
