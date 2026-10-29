export type Archive = {
  id: number;
  title: string;
  date: string;
  year: number;
  author: string;
  content: string;
  images: string[];
};

export type CalendarItem = {
  id: number;
  type: 'capsule' | 'anniversary' | 'archive';
  title: string;
  date: string;
  status?: 'open' | 'sealed' | 'writing';
  dDay?: string;
  meta?: string;
  image?: string;
  yearly?: boolean;
};

export type Capsule = {
  id: number;
  title: string;
  date: string;
  status: 'open' | 'sealed' | 'writing';
  meta: string;
};

export type AnniversaryForm = {
  name: string;
  date: string;
  yearly: boolean;
  memo: string;
  notification: boolean;
  notificationTime: string;
  reminder: string;
};
