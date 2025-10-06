import { defineStore } from 'pinia';

export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    drawerState: false,
  }),
  actions: {
    toggleDrawer() {
      this.drawerState = !this.drawerState;
    },
  },
});
