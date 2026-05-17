export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  dateTime: string;
  location: string;
  type: 'PUBLIC' | 'PRIVATE';
  creatorId: number;
  creatorName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
