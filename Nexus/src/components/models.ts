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
  icon: string;
  name: string;
}
