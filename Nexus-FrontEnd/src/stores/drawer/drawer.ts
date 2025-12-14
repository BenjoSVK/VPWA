import { defineStore } from 'pinia';

export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    isOpen: true,
    isMini: true,
  }),
  actions: {
    toggleMini() {
      this.isOpen = true;
      this.isMini = !this.isMini;
    },
  },
});
