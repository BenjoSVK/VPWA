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
}
export type Sender = 'me' | 'other';

export interface Message {
  id: string;
  groupId: string;
  text: string;
  sender: Sender;
  createdAt: number;
}
