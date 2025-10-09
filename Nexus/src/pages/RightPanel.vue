<template>
  <q-drawer side="right" arial-label="Users" show-if-above bordered :width="320">
    <div class="q-pa-md users-online">
      <p class="text-weight-medium text-subtitle1 q-ma-none">Používatelia</p>
      <p class="text-grey q-pt-xs q-ma-none">5 Online</p>
    </div>
    <div>
      <Users v-for="link in linksList" :key="link.name" v-bind="link" class="user" />
    </div>
  </q-drawer>
</template>
<script setup lang="ts">
import Users, { type UsersProps } from 'components/UsersComponent.vue';
const linksList: UsersProps[] = [
  {
    name: 'Anna Novávková',
    status: 'Offline',
  },
  {
    name: 'Peter Kováč',
    status: 'Offline',
  },
  {
    name: 'Mária Svoboda',
    status: 'Online',
  },
  {
    name: 'Tomáš Novák',
    status: 'Offline',
  },
  {
    name: 'Jana Dvořáková',
    status: 'Offline',
  },
  {
    name: 'Martin Černý',
    status: 'Offline',
  },
  {
    name: 'Eva Procházková',
    status: 'Offline',
  },
  {
    name: 'David Novotný',
    status: 'Offline',
  },
];
</script>
<style lang="scss" scoped>
.users-online {
  border-bottom: 1px solid #f3f4f6;
}
.user:first-child {
  margin-top: 12px;
}
.user {
  margin: 0px 0px 4px 12px;
  padding: 12px;
}
@import '/src/css/index.scss';
</style>
