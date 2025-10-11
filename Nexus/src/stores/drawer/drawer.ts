import { defineStore } from 'pinia';

export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    isOpen: true,
    isMini: false,
  }),
  actions: {
    toggleMini() {
      this.isOpen = true;
      this.isMini = !this.isMini;
    }, // Drawer nech je vždy otvorený
  },
});
