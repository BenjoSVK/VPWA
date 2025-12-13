import { defineStore } from 'pinia';
import { UserStatus } from 'src/components/models';
import { authApi } from 'src/lib/api';

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
    async setStatus(status: UserStatus) {
      this.currentStatus = status;
      try {
        await authApi.updateStatus(status);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error updating status:', error);
        }
      }
    },
    async setOnline() {
      await this.setStatus(UserStatus.Online);
    },
    async setOffline() {
      await this.setStatus(UserStatus.Offline);
    },
    async setDnd() {
      await this.setStatus(UserStatus.Dnd);
    },
    setStatusFromBackend(status: string) {
      if (status === 'Online') {
        this.currentStatus = UserStatus.Online;
      } else if (status === 'Offline') {
        this.currentStatus = UserStatus.Offline;
      } else if (status === 'Do Not Disturb') {
        this.currentStatus = UserStatus.Dnd;
      }
    },
  },
});
