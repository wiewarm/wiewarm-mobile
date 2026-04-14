import type { NewsStoryItem } from '../../services/interfaces/news-story.interface';
import type {
  ImageItem,
  NewsItem,
} from '../../services/schemas/news-story.schema';
import { toTimestamp } from '../date.util';
import {
  formatLocation,
  trimOrNull,
  resolveImageUrl,
} from './news-story.mapper.utils';

function latestImagesByBadId(imageItems: ImageItem[]): Map<string, ImageItem> {
  const imgByBadId = new Map<string, ImageItem>();
  const tsByBadId = new Map<string, number>();

  for (const img of imageItems) {
    const badId = String(img.badid);

    const tsRaw = toTimestamp(img.date, img.date_pretty);
    const ts = Number.isFinite(tsRaw) ? tsRaw : -Infinity;

    const prevTs = tsByBadId.get(badId) ?? -Infinity;
    if (ts > prevTs) {
      tsByBadId.set(badId, ts);
      imgByBadId.set(badId, img);
    }
  }

  return imgByBadId;
}

function toNewsStory(item: NewsItem, img?: ImageItem): NewsStoryItem {
  const badId = String(item.badid);

  return {
    id: `news:${badId}:${item.infoid}`,
    kind: 'news',
    badId,
    badName: item.badname,
    locationText: formatLocation(item.plz, item.ort),
    title: `Mitteilung von ${item.badname}, ${item.ort}`,
    body: item.info?.trim() ?? '',
    imageUrl: resolveImageUrl(img?.image),
    thumbnailUrl: resolveImageUrl(img?.thumbnail),
    publishedAt: trimOrNull(item.date),
    publishedAtPretty: trimOrNull(item.date_pretty),
    infoId: item.infoid,
  };
}

export function mapNewsToStories(
  newsItems: NewsItem[],
  imageItems: ImageItem[],
): NewsStoryItem[] {
  const latest = latestImagesByBadId(imageItems);
  return newsItems.map((item) =>
    toNewsStory(item, latest.get(String(item.badid))),
  );
}
