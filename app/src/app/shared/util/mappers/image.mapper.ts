import type { NewsStoryItem } from '../../services/interfaces/news-story.interface';
import type { ImageItem } from '../../services/schemas/news-story.schema';
import {
  formatLocation,
  hashString,
  trimOrNull,
  resolveImageUrl,
} from './news-story.mapper.utils';

/**
 * Maps an array of image items to news story items.
 *
 * Transforms raw image data into structured news story objects with formatted
 * location information, generated IDs, and resolved image URLs.
 */
export function mapImagesToStories(imageItems: ImageItem[]): NewsStoryItem[] {
  return imageItems.map((item) => {
    const badId = String(item.badid);
    const image = item.original ?? item.image ?? '';
    const thumb = item.thumbnail ?? item.image;

    return {
      id: `img:${badId}:${hashString(image)}`,
      kind: 'impression',
      badId,
      badName: item.badname,
      locationText: formatLocation(item.plz, item.ort),
      title: `Bild hochgeladen von ${item.badname}, ${item.ort}`,
      body: item.description?.trim() ?? '',
      imageUrl: resolveImageUrl(image),
      thumbnailUrl: resolveImageUrl(thumb),
      publishedAt: trimOrNull(item.date),
      publishedAtPretty: trimOrNull(item.date_pretty),
      infoId: null,
    };
  });
}
