import { defineStore } from 'pinia';
import type { Group } from 'src/components/models';

export const useGroupsStore = defineStore('groups', {
  state: () => ({
    groups: [
      { id: 'favorites', name: 'Favorites', private: false },
      { id: 'general', name: 'General Chat', private: false },
      { id: 'developers', name: 'Developers Hub', private: true },
      { id: 'design', name: 'UI/UX Design', private: true },
      { id: 'marketing', name: 'Marketing Team', private: false },
      { id: 'random', name: 'Random Talk', private: false },
      { id: 'memes', name: 'Meme Zone', private: false },
      { id: 'gaming', name: 'Gaming Lounge', private: false },
      { id: 'music', name: 'Music & Vibes', private: false },
      { id: 'study', name: 'Study Room', private: false },
      { id: 'support', name: 'Tech Support', private: false },
      { id: 'announcements', name: 'Announcements', private: false },
      { id: 'team-alpha', name: 'Team Alpha', private: true },
      { id: 'team-beta', name: 'Team Beta', private: true },
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
    addGroup(name: string, isPrivate: boolean) {
      const newId = `group-${Date.now()}`;
      const newGroup: Group = {
        id: newId,
        name: name,
        private: isPrivate,
      };
      // Pridá novú skupinu na začiatok zoznamu
      this.groups.unshift(newGroup);
      // Automaticky vyberie novú skupinu
      this.selectedId = newId;
    },
    removeGroup(groupId: string) {
      // Odstráni skupinu zo zoznamu
      this.groups = this.groups.filter((g) => g.id !== groupId);
      // Ak bola odstránená aktuálne vybraná skupina, zruš výber
      if (this.selectedId === groupId) {
        this.selectedId = null;
      }
    },
  },
});
