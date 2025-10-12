<template>
  <q-drawer side="right" aria-label="Users" show-if-above :width="320">
    <div class="q-pa-md users-online">
      <p class="text-weight-medium text-subtitle1 q-ma-none">Používatelia</p>
      <p class="text-grey q-pt-xs q-ma-none">{{ onlineCount }} Online</p>
    </div>
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
          <img v-if="u.icon" :src="u.icon" :alt="u.name" />
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
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUsersStore } from 'src/stores/drawer/users';

const Users = useUsersStore();
const { sorted, onlineCount } = storeToRefs(Users);

onMounted(async () => {
  await Users.loadMock(); // For BE fetchFromApi() or smth like that
  window.addEventListener('focus', () => void Users.reloadUsers());
});
</script>

<style lang="scss" scoped>
.user {
  margin: 0px 0px 4px 12px;
  padding: 12px;
}
.user:first-child {
  margin-top: 12px;
}
.users-online {
  border-bottom: 1.5px solid #f3f4f6;
}
@import '../css/index.scss';
</style>
