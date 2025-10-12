import { defineStore } from 'pinia';
import FavouritesIcon from 'assets/favourites.svg';
import GroupsIcon from 'assets/groups.svg';
import type { Group } from 'src/components/models';

export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [
      { id: 'fav', icon: FavouritesIcon, name: 'Favorites' },
      { id: 'teams', icon: GroupsIcon, name: 'Groups' },
    ] as Group[],
    selectedId: null as string | null,
  }),
  getters: {
    selected: (s) => s.groups.find((g) => g.id === s.selectedId) ?? null,
  },
  actions: {
    setSelected(id: string) {
      this.selectedId = id;
    },
  },
});
