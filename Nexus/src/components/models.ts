// Legacy types - keeping for backwards compatibility during transition
// New types are in src/lib/database.types.ts

export enum UserStatus {
  Online = 'Online',
  Offline = 'Offline',
  Dnd = 'Do Not Disturb',
}

export interface User {
  id: string;
  name: string;
  status: UserStatus;
  icon?: string;
}

export interface Group {
  id: string;
  name: string;
  private: boolean;
}

export interface Message {
  id: string;
  groupId: string;
  text: string;
  sent: boolean;
  createdAt: number;
  name?: string | undefined;
  avatar?: string | undefined;
  pings?: string[];
  isPinged?: boolean;
}
