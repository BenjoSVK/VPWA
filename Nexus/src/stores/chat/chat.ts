import { defineStore } from 'pinia';
import { useGroupsStore } from 'src/stores/drawer/groups';
import type { Message } from 'src/components/models';

type MsgMap = Record<string, Message[]>; // groupId -> messages
type ReadMap = Record<string, number | null>; // groupId -> lastReadAt timestamp

function seed(now = Date.now()): MsgMap {
  // Generovanie náhodných správ pre každú skupinu
  const generateRandomMessages = (groupId: string, count: number) => {
    const messages = [];
    const names = [
      'Alice',
      'Bob',
      'Charlie',
      'Diana',
      'Eve',
      'Frank',
      'Grace',
      'Henry',
      'Ivy',
      'Jack',
      'Kate',
      'Leo',
      'Mike',
      'Nina',
      'Oscar',
      'Paula',
      'Quinn',
      'Rita',
      'Sam',
      'Tina',
    ];
    const texts = [
      'Ahoj! 👋',
      'Ako sa máš?',
      'Všetko v poriadku?',
      'Super! 😊',
      'Ďakujem!',
      'Nie je zač',
      'Áno, súhlasím',
      'Presne tak!',
      'Máš pravdu',
      'Skvelé! 👍',
      'Dobré ráno! 🌅',
      'Dobrý večer! 🌙',
      'Ako ide projekt?',
      'Všetko ide dobre',
      'Potrebujem pomoc',
      'Môžem pomôcť',
      'Ďakujem za tip',
      'To je dobrý nápad',
      'Skúsme to',
      'Perfektne!',
      'Haha, to je vtipné! 😂',
      'Súhlasím s tebou',
      'Máš úplne pravdu',
      'To je skvelé riešenie',
      'Ďakujem za zdieľanie',
      'Pozriem si to',
      'Určite!',
      'Samozrejme',
      'Áno, prosím',
      'Nie, ďakujem',
      'Ako sa ti páči?',
      'Vyzerá to dobre',
      'Som rád, že to funguje',
      'To je úžasné!',
      'Nemôžem uveriť',
      'To je neuveriteľné',
      'Wow! 🤩',
      'Fantastické!',
      'Výborné!',
      'Skvelá práca!',
      'Potrebujem to do zajtra',
      'Môžeš mi pomôcť?',
      'Určite pomôžem',
      'Žiadny problém',
      'To je jednoduché',
      'Ako na to?',
      'Ukážem ti to',
      'Pozri si toto',
      'To je zaujímavé',
      'Nikdy som to nevidel',
      'Máš nejaké otázky?',
      'Áno, mám',
      'Nie, všetko je jasné',
      'Môžeš to vysvetliť?',
      'Samozrejme',
      'Určite',
      'To je jednoduché',
      'Rozumiem',
      'Aha, teraz rozumiem',
      'Ďakujem za vysvetlenie',
      'Kedy to bude hotové?',
      'Do konca týždňa',
      'To je skvelé',
      'Nemôžem sa dočkať',
      'Ja tiež nie',
      'Bude to úžasné',
      'Som nadšený',
      'Ja tiež!',
      'To bude skvelé',
      'Určite bude',
      'Ako sa ti páči nová verzia?',
      'Je to oveľa lepšie',
      'Súhlasím',
      'Je to skvelé',
      'Milujem to',
      'Ja tiež',
      'To je perfektné',
      'Nemôžem sa dočkať',
      'Ja tiež nie',
      'Bude to úžasné',
      'Máš nejaké pripomienky?',
      'Nie, je to skvelé',
      'Možno len malú',
      'Čo si myslíš?',
      'Myslím, že je to dobré',
      'Súhlasím',
      'To je pravda',
      'Máš pravdu',
      'Presne tak',
      'Áno, súhlasím',
      'Potrebujeme to dokončiť',
      'Áno, máš pravdu',
      'Kedy začneme?',
      'Hneď teraz',
      'Perfektne!',
      'Som pripravený',
      'Ja tiež',
      'Poďme na to',
      'Určite!',
      'Začnime!',
    ];

    for (let i = 0; i < count; i++) {
      const isSent = Math.random() > 0.5;
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomText = texts[Math.floor(Math.random() * texts.length)];
      const timeOffset = Math.floor(Math.random() * 200000) + i * 1000; // Náhodný čas v posledných 200 minútach

      messages.push({
        id: `${groupId}-${i + 1}`,
        groupId,
        text: randomText || 'Správu nebolo možné načítať', // Fallback ak by text bol undefined
        sent: isSent,
        name: isSent ? undefined : randomName,
        avatar: isSent ? undefined : `https://cdn.quasar.dev/img/avatar${(i % 6) + 1}.jpg`,
        createdAt: now - timeOffset,
      });
    }

    return messages.sort((a, b) => a.createdAt - b.createdAt); // Zoradiť podľa času
  };

  return {
    general: generateRandomMessages('general', 200),
    developers: generateRandomMessages('developers', 200),
    'team-alpha': generateRandomMessages('team-alpha', 200),
    'team-beta': generateRandomMessages('team-beta', 200),
    favorites: generateRandomMessages('favorites', 200),
    design: generateRandomMessages('design', 200),
    marketing: generateRandomMessages('marketing', 200),
    random: generateRandomMessages('random', 200),
    memes: generateRandomMessages('memes', 200),
    gaming: generateRandomMessages('gaming', 200),
    music: generateRandomMessages('music', 200),
    study: generateRandomMessages('study', 200),
    support: generateRandomMessages('support', 200),
    announcements: generateRandomMessages('announcements', 200),
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
    addMessage(groupId: string, text: string, sent = true, name?: string) {
      const list = this.messagesByGroup[groupId] ?? (this.messagesByGroup[groupId] = []);

      const pingRegex = /\/ping\s+(\w+)/gi;
      const pings: string[] = [];
      let match;
      while ((match = pingRegex.exec(text)) !== null) {
        pings.push(match[1] ?? 'Unknown');
      }

      const msg: Message = {
        id: crypto.randomUUID(),
        groupId,
        text,
        sent,
        name: sent ? undefined : name || 'User',
        avatar: sent ? undefined : 'img:src/assets/UserDefault.svg',
        createdAt: Date.now(),
        pings,
        isPinged: pings.length > 0,
      };

      list.push(msg);
      return msg;
    },
    setLastRead(groupId: string, ts: number = Date.now()) {
      this.lastReadAtByGroup[groupId] = ts;
    },
    getLastRead(groupId: string): number | null {
      return this.lastReadAtByGroup[groupId] ?? null;
    },
  },
});
