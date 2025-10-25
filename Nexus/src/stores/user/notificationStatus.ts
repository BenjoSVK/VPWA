import { defineStore } from 'pinia';

export const useNotificationStatusStore = defineStore('notificationStatus', {
  state: () => ({
    notificationsEnabled: false,
  }),

  getters: {
    statusText: (state) => (state.notificationsEnabled ? 'Zapnuté' : 'Vypnuté'),
    isEnabled: (state) => state.notificationsEnabled,
    isDisabled: (state) => !state.notificationsEnabled,
  },

  actions: {
    toggleNotifications() {
      this.notificationsEnabled = !this.notificationsEnabled;
    },
    enableNotifications() {
      this.notificationsEnabled = true;
    },
    disableNotifications() {
      this.notificationsEnabled = false;
    },
    setNotifications(enabled: boolean) {
      this.notificationsEnabled = enabled;
    },
  },
});
