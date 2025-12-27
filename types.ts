export type AppView = 'input' | 'draw' | 'groups';

export interface Participant {
  id: string;
  name: string;
}

export interface GroupResult {
  groupId: number;
  members: Participant[];
}

export interface DrawHistoryItem {
  timestamp: number;
  winner: Participant;
}