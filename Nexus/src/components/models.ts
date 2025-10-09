export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}
export enum UserState {
  'Online',
  'Do Not Disturb',
  'Offline',
}
