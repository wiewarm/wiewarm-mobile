export type NewsStoryKind = 'news' | 'impression';

export interface NewsApiItem {
  badid: number;
  badname: string;
  ort: string;
  kanton: string;
  plz: string;
  infoid: number;
  date: string;
  info: string;
  date_pretty: string;
}

export interface ImageApiItem {
  image: string;
  thumbnail?: string;
  original?: string;
  description?: string;
  date?: string;
  date_pretty?: string;
  badid: string;
  badname: string;
  ort: string;
  plz: string;
  kanton: string;
}

export interface NewsStoryItem {
  id: string;
  kind: NewsStoryKind;
  badId: string;
  badName: string;
  locationText: string;
  title: string;
  body: string;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  publishedAtPretty: string | null;
}
