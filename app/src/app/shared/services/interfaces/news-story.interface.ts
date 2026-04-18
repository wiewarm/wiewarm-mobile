export type NewsStoryKind = 'news' | 'impression';

export interface NewsStoryItem {
  id: string;
  kind: NewsStoryKind;
  badId: number;
  badName: string;
  locationText: string;
  title: string;
  body: string;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  publishedAt: string | null;
  publishedAtPretty: string | null;
  /** Numeric ID of the infos row – required for delete. Only set for kind === 'news'. */
  infoId: number | null;
}
