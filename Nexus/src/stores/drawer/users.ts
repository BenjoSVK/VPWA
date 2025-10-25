import { defineStore } from 'pinia';
import { UserStatus, type User } from 'src/components/models';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: '' as string | null,
  }),

  getters: {
    // Count how many users are online
    onlineCount: (s) => s.users.filter((u) => u.status === UserStatus.Online).length,
    // Sort first online, then by A to Z
    // Also create a copy of users, so it wont change the previous list of users
    sorted: (s) =>
      [...s.users].sort((a, b) => {
        const rank = (u: User) => (u.status === UserStatus.Online ? 0 : 1);
        if (rank(a) !== rank(b)) return rank(a) - rank(b);
        return a.name.localeCompare(b.name, 'sk');
      }),
  },

  actions: {
    async reloadUsers() {
      this.users = [];
      await this.loadMock();
    },
    async loadMock() {
      this.loading = true;
      try {
        // just for FE
        await new Promise((r) => setTimeout(r, 150));
        const defaultIcon = 'src/assets/UserDefault.svg';
        this.users = [
          { id: 'u1', name: 'Anna Novávková', status: UserStatus.Offline, icon: defaultIcon },
          { id: 'u2', name: 'Peter Kováč', status: UserStatus.Online, icon: defaultIcon },
          { id: 'u3', name: 'Mária Svoboda', status: UserStatus.Online, icon: defaultIcon },
          { id: 'u4', name: 'Tomáš Novák', status: UserStatus.Offline, icon: defaultIcon },
          { id: 'u5', name: 'Jana Dvořáková', status: UserStatus.Online, icon: defaultIcon },
          { id: 'u6', name: 'Martin Černý', status: UserStatus.Dnd, icon: defaultIcon },
          {
            id: 'u7',
            name: 'Eva Procházková - Admin',
            status: UserStatus.Online,
            icon: defaultIcon,
          },
          { id: 'u8', name: 'David Novotný', status: UserStatus.Offline, icon: defaultIcon },
        ];
        this.error = null;
      } catch (e: unknown) {
        const err = e as Error;
        this.error = err.message ?? 'Failed to load users';
      } finally {
        this.loading = false;
      }
    },
    setStatus(id: string, status: UserStatus) {
      const u = this.users.find((u) => u.id === id);
      if (u) u.status = status;
    },
    //     // prepnutie na BE
    //     async fetchFromApi() {
    //       this.loading = true;
    //       try {
    //         // const { data } = await api.get<User[]>('/users')
    //         // this.users = data
    //       } finally {
    //         this.loading = false;
    //       }
    //     },

    //     // update for BE WIP - (WebSocket/sse)
    //     setStatus(id: string, status: UserStatus) {
    //       const u = this.users.find((u) => u.id === id);
    //       if (u) u.status = status;
    //     },
  },
});
