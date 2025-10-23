import { defineStore } from 'pinia';
import type { Group } from 'src/components/models';

export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [
      { id: 'favorites', name: 'Favorites' },
      { id: 'general', name: 'General Chat' },
      { id: 'developers', name: 'Developers Hub' },
      { id: 'design', name: 'UI/UX Design' },
      { id: 'marketing', name: 'Marketing Team' },
      { id: 'random', name: 'Random Talk' },
      { id: 'memes', name: 'Meme Zone' },
      { id: 'gaming', name: 'Gaming Lounge' },
      { id: 'music', name: 'Music & Vibes' },
      { id: 'study', name: 'Study Room' },
      { id: 'support', name: 'Tech Support' },
      { id: 'announcements', name: 'Announcements' },
      { id: 'team-alpha', name: 'Team Alpha' },
      { id: 'team-beta', name: 'Team Beta' },
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
