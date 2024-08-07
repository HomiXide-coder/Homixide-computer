export interface DBResponse {
  0: boolean;
  1?: string;
  2?: string;
}

export interface AnnouncementType {
  id: number;
  author: string;
  title: string;
  description: string;
  date: string;
}
