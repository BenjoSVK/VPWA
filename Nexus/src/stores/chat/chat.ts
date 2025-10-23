import { defineStore } from 'pinia';
import { useGroupsStore } from 'src/stores/drawer/groups';
import type { Message, Sender } from 'src/components/models';

type MsgMap = Record<string, Message[]>; // groupId -> messages
type ReadMap = Record<string, number | null>; // groupId -> lastReadAt timestamp

function seed(now = Date.now()): MsgMap {
  return {
    general: [
      {
        id: 'g-1',
        groupId: 'general',
        text: 'Welcome to General!',
        sender: 'other',
        createdAt: now - 120000,
      },
      { id: 'g-2', groupId: 'general', text: 'Ahoj 👋', sender: 'me', createdAt: now - 90000 },
      {
        id: 'g-3',
        groupId: 'general',
        text: 'Ako ide Quasar?',
        sender: 'other',
        createdAt: now - 60000,
      },
    ],
    developers: [
      {
        id: 'd-1',
        groupId: 'developers',
        text: 'Prosím PR na store refactor',
        sender: 'other',
        createdAt: now - 70000,
      },
    ],
    'team-alpha': [],
    'team-beta': [],
    favorites: [],
    design: [],
    marketing: [],
    random: [],
    memes: [],
    gaming: [],
    music: [],
    study: [],
    support: [],
    announcements: [],
  };
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    messagesByGroup: seed(),
    lastReadAtByGroup: {} as ReadMap,
  }),
  getters: {
    // Správy pre práve vybranú skupinu (viaže sa na useGroupsStore)
    messagesForSelected(state): Message[] {
      const groups = useGroupsStore();
      const gid = groups.selectedId;
      if (!gid) return [];
      return state.messagesByGroup[gid] ?? [];
    },
    // first unread id pre vybranú skupinu (ak máš lastReadAt)
    firstUnreadIdForSelected(state): string | null {
      const groups = useGroupsStore();
      const gid = groups.selectedId;
      if (!gid) return null;
      const lastRead = state.lastReadAtByGroup[gid] ?? null;
      if (!lastRead) return null;
      const list = state.messagesByGroup[gid] ?? [];
      const first = list.find((m) => m.createdAt > lastRead);
      return first?.id ?? null;
    },
  },
  actions: {
    setMessages(groupId: string, msgs: Message[]) {
      this.messagesByGroup[groupId] = msgs;
    },
    addMessage(groupId: string, text: string, sender: Sender = 'me') {
      const list = this.messagesByGroup[groupId] ?? (this.messagesByGroup[groupId] = []);
      list.push({
        id: crypto.randomUUID(),
        groupId,
        text,
        sender,
        createdAt: Date.now(),
      });
    },
    setLastRead(groupId: string, ts: number = Date.now()) {
      this.lastReadAtByGroup[groupId] = ts;
    },
  },
});
