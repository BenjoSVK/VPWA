<template>
  <q-drawer
    side="right"
    aria-label="Users"
    show-if-above
    :width="320"
    :breakpoint="1023"
    style="border-left: 1px solid #e0e0e0"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    v-if="showUsers"
  >
    <div class="q-px-md q-pt-md q-pb-sm">
      <p class="text-weight-bold text-subtitle1 q-ma-none q-pl-xs">Používatelia</p>
      <Search />
    </div>
    <q-separator class="q-my-sm" />
    <p class="text-grey text-subtitle2 text-weight-bold q-pt-xs q-px-md q-ma-none">
      ONLINE — {{ onlineCount }}
    </p>
    <div>
      <q-item
        v-for="u in sorted"
        :key="u.id"
        :icon="u.icon"
        :name="u.name"
        :status="u.status"
        class="user"
      >
        <q-item-section avatar>
          <img
            v-if="u.icon"
            :src="u.icon"
            :alt="u.name"
            :class="{ 'is-dimmed': u.status !== 'Online' }"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ u.name }}</q-item-label>
          <q-item-label class="text-grey">{{ u.status }}</q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUsersStore } from 'src/stores/drawer/users';
import { useGroupsStore } from 'src/stores/drawer/groups';
import { useScrollHandling } from '../composables/useScrollHandling';
import Search from 'src/components/SearchComponent.vue';
// Stav pre zobrazenie používateľov
const showUsers = ref(false);

const Users = useUsersStore();
const groups = useGroupsStore();
const { sorted, onlineCount } = storeToRefs(Users);
const { selectedId } = storeToRefs(groups);

const { onMouseEnter, onMouseLeave } = useScrollHandling('.q-drawer');

onMounted(async () => {
  await Users.loadMock(); // For BE fetchFromApi() or smth like that
  window.addEventListener('focus', () => void Users.reloadUsers());

  // Listener pre zobrazenie používateľov
  window.addEventListener('show-users', displayUsers);
});

// Funkcia pre zobrazenie používateľov
const displayUsers = () => {
  showUsers.value = true;

  // Skry používateľov po 10 sekundách
  // setTimeout(() => {
  //   showUsers.value = false;
  // }, 10000);
};

// Sleduj zmenu kanála a skry používateľov
watch(selectedId, () => {
  if (showUsers.value) {
    showUsers.value = false;
  }
});

// Exportuj funkciu pre použitie v iných komponentoch
defineExpose({
  displayUsers,
});
</script>

<style lang="scss" scoped>
.user {
  margin: 0px 0px 4px 12px;
  padding: 12px;
}
.is-dimmed {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}
</style>
