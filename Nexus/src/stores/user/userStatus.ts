import { defineStore } from 'pinia';
import { UserStatus } from 'src/components/models';

export const useUserStatusStore = defineStore('userStatus', {
  state: () => ({
    currentStatus: UserStatus.Online as UserStatus,
  }),

  getters: {
    statusText: (state) => {
      switch (state.currentStatus) {
        case UserStatus.Online:
          return 'Available for messages';
        case UserStatus.Offline:
          return 'Not available for messages';
        case UserStatus.Dnd:
          return 'Do not disturb';
        default:
          return 'Available for messages';
      }
    },
    isOnline: (state) => state.currentStatus === UserStatus.Online,
    isOffline: (state) => state.currentStatus === UserStatus.Offline,
    isDnd: (state) => state.currentStatus === UserStatus.Dnd,
  },

  actions: {
    setStatus(status: UserStatus) {
      this.currentStatus = status;
    },
    setOnline() {
      this.currentStatus = UserStatus.Online;
    },
    setOffline() {
      this.currentStatus = UserStatus.Offline;
    },
    setDnd() {
      this.currentStatus = UserStatus.Dnd;
    },
  },
});
