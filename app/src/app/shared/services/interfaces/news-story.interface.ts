export type NewsStoryKind = 'news' | 'impression';

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
