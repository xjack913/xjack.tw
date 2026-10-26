// 媒體報導、訪談、Podcast、演講。只收查得到原始來源的。

export interface MediaItem {
  date: string;
  kind: '報導' | '訪談' | 'Podcast' | '演講' | '影片' | '專欄';
  title: string;
  outlet?: string;
  url?: string;
}

export const media: MediaItem[] = [];
